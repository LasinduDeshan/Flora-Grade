import os
from PIL import Image
import torchvision.transforms as T

# Path to class B folder
b_dir = 'backend/dataset/B'
img_files = [f for f in os.listdir(b_dir) if f.lower().endswith(('jpg', 'jpeg', 'png', 'bmp', 'gif', 'avif'))]

# Load the single image
img_path = os.path.join(b_dir, img_files[0])
img = Image.open(img_path)

# Define augmentations
augment = T.Compose([
    T.RandomResizedCrop(224, scale=(0.8, 1.0)),
    T.RandomHorizontalFlip(),
    T.RandomRotation(30),
    T.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.3, hue=0.1),
])

# Number of augmented images to create
num_augmented = 10

for i in range(num_augmented):
    aug_img = augment(img)
    save_path = os.path.join(b_dir, f'augmented_{i+1}.jpg')
    aug_img.save(save_path)
    print(f'Saved {save_path}')

print('Augmentation complete!') 