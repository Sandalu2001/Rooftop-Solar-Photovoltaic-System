import albumentations as A
from albumentations.augmentations.geometric.transforms import Rotate
from albumentations.augmentations.transforms import HorizontalFlip
from pycocotools.coco import COCO
import cv2
import json

# Load your COCO JSON
with open("sample-COCO.json", "r") as f:
    coco_data = json.load(f)

# Define augmentations
transform = A.Compose([
    A.HorizontalFlip(p=0.5),
    A.ShiftScaleRotate(shift_limit=0.1, scale_limit=0.1, rotate_limit=15, p=0.5),
    A.RandomBrightnessContrast(p=0.2)
], additional_targets={'mask': 'image'})

# Example for a single image
image = cv2.imread("path_to_image.png")
mask = cv2.imread("path_to_mask.png", cv2.IMREAD_GRAYSCALE)  # Assuming mask is grayscale

# Apply augmentation
augmented = transform(image=image, mask=mask)
aug_image = augmented['image']
aug_mask = augmented['mask']

# Save the new image and mask
cv2.imwrite("augmented_image.png", aug_image)
cv2.imwrite("augmented_mask.png", aug_mask)
