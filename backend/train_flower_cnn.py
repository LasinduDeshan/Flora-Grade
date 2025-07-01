import torch
import torch.nn as nn
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader, Subset
import numpy as np
from sklearn.metrics import confusion_matrix, classification_report
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt

# Data transforms with augmentation for training
train_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.1),
    transforms.ToTensor(),
])
val_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

dataset = datasets.ImageFolder('backend/dataset', transform=train_transform)
num_classes = len(dataset.classes)

# Stratified split
labels = [label for _, label in dataset]
indices = np.arange(len(dataset))
train_idx, val_idx = train_test_split(indices, test_size=0.2, stratify=labels, random_state=42)
train_dataset = Subset(dataset, train_idx)
val_dataset = Subset(dataset, val_idx)
# Set validation transform
val_dataset.dataset.transform = val_transform

train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)

# Model
model = models.mobilenet_v2(pretrained=True)
model.classifier[1] = nn.Linear(model.last_channel, num_classes)

# Compute class weights
class_sample_count = np.array([np.sum(np.array(labels) == i) for i in range(num_classes)])
class_weights = 1. / class_sample_count
weights = torch.FloatTensor(class_weights)

# Training setup
criterion = nn.CrossEntropyLoss(weight=weights)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)

def evaluate(model, loader):
    model.eval()
    all_preds = []
    all_labels = []
    with torch.no_grad():
        for imgs, labels in loader:
            outputs = model(imgs)
            _, preds = torch.max(outputs, 1)
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
    return np.array(all_preds), np.array(all_labels)

epochs = 10
for epoch in range(epochs):
    model.train()
    running_loss = 0.0
    for imgs, labels in train_loader:
        optimizer.zero_grad()
        outputs = model(imgs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        running_loss += loss.item()
    print(f"Epoch {epoch+1}/{epochs}, Loss: {running_loss/len(train_loader):.4f}")
    # Validation loss/accuracy
    val_preds, val_labels = evaluate(model, val_loader)
    val_acc = (val_preds == val_labels).mean()
    print(f"Validation Accuracy: {val_acc:.4f}")

# Final evaluation
val_preds, val_labels = evaluate(model, val_loader)
all_labels_list = list(range(num_classes))
print("\nClassification Report:")
print(classification_report(val_labels, val_preds, target_names=dataset.classes, labels=all_labels_list, zero_division=0))
print("Confusion Matrix:")
print(confusion_matrix(val_labels, val_preds, labels=all_labels_list))

# Save model
torch.save(model.state_dict(), 'flower_cnn.pth')
print("Model saved as flower_cnn.pth") 