import os
import tarfile
import urllib.request
from PIL import Image
import numpy as np
import cv2

# Download the dataset
url = "https://www.robots.ox.ac.uk/~vgg/data/flowers/102/102flowers.tgz"
tgz_path = "102flowers.tgz"
extract_dir = "jpg"

if not os.path.exists(tgz_path):
    print("Downloading dataset...")
    urllib.request.urlretrieve(url, tgz_path)
else:
    print("Dataset already downloaded.")

# Extract the dataset
if not os.path.exists(extract_dir):
    print("Extracting dataset...")
    with tarfile.open(tgz_path, "r:gz") as tar:
        tar.extractall(path="backend")
else:
    print("Dataset already extracted.")

# Feature extraction functions (reuse from your backend)
def color_vibrancy(np_img):
    hsv = cv2.cvtColor(np_img, cv2.COLOR_RGB2HSV)
    saturation = hsv[:, :, 1]
    avg_saturation = np.mean(saturation) / 255.0
    return avg_saturation

def symmetry_score(np_img):
    gray = cv2.cvtColor(np_img, cv2.COLOR_RGB2GRAY)
    flipped = np.fliplr(gray)
    score = 1.0 - np.mean(np.abs(gray - flipped)) / 255.0
    return score

def damage_score(np_img):
    gray = cv2.cvtColor(np_img, cv2.COLOR_RGB2GRAY)
    edges = cv2.Canny(gray, 100, 200)
    edge_density = np.sum(edges > 0) / edges.size
    brown_mask = (np_img[:, :, 0] < 100) & (np_img[:, :, 1] < 80) & (np_img[:, :, 2] < 80)
    brown_ratio = np.sum(brown_mask) / np_img.size
    return edge_density, brown_ratio

def shape_uniformity(np_img):
    gray = cv2.cvtColor(np_img, cv2.COLOR_RGB2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(blurred, 60, 255, cv2.THRESH_BINARY_INV)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if contours:
        cnt = max(contours, key=cv2.contourArea)
        area = cv2.contourArea(cnt)
        perimeter = cv2.arcLength(cnt, True)
        circularity = 4 * np.pi * area / (perimeter ** 2 + 1e-6)
        return circularity
    return 0

def grade_flower_logic(vibrancy, symmetry, edge_density, brown_ratio, circularity):
    if vibrancy > 0.5 and symmetry > 0.8 and edge_density < 0.05 and brown_ratio < 0.01 and circularity > 0.7:
        return "A"
    elif vibrancy > 0.35 and symmetry > 0.6 and edge_density < 0.1 and brown_ratio < 0.03 and circularity > 0.5:
        return "B"
    else:
        return "C"

# Create output folders
for grade in ['A', 'B', 'C']:
    os.makedirs(f'dataset/{grade}', exist_ok=True)

# Assign images
img_dir = "backend/jpg"
img_files = [f for f in os.listdir(img_dir) if f.endswith('.jpg')]
print(f"Processing {len(img_files)} images...")

for img_file in img_files:
    img_path = os.path.join(img_dir, img_file)
    try:
        image = Image.open(img_path).convert("RGB").resize((256, 256))
        np_img = np.array(image)
        vibrancy = color_vibrancy(np_img)
        symmetry = symmetry_score(np_img)
        edge_density, brown_ratio = damage_score(np_img)
        circularity = shape_uniformity(np_img)
        grade = grade_flower_logic(vibrancy, symmetry, edge_density, brown_ratio, circularity)
        out_path = f'backend/dataset/{grade}/{img_file}'
        image.save(out_path)
    except Exception as e:
        print(f"Error processing {img_file}: {e}")

print("Auto-assignment complete!")