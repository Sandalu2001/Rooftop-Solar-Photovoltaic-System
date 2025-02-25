from model.detectron_model import DetectronModel
import cv2
import numpy as np
from pycocotools import mask as mask_util
import pycocotools.mask as mask_utils
import json

class DataTypeConversionModel:
    def __init__(self):
        self.model = DetectronModel()
        self.category_mapping = {1: "Building", 2: "Shadow", 3: "Tree", 4: "Tree_Shadow"}  # Adjust as needed

    def convert(self, image_path: str, image_id: int):
        """Run inference on an image, return COCO-style annotations, and a visualized annotated image"""
        img = cv2.imread(image_path)
        original_img = img.copy()  # Keep a copy for visualization
        outputs = self.model.predictor(img)
        instances = outputs["instances"].to("cpu")

        pred_masks = instances.pred_masks.numpy()  # Shape: (N, H, W)
        pred_boxes = instances.pred_boxes.tensor.numpy()  # Shape: (N, 4)
        scores = instances.scores.numpy()  # Confidence scores
        pred_classes = instances.pred_classes.numpy()  # Class indices

        image_height, image_width = img.shape[:2]
        coco_annotations = []

        colors = np.random.randint(0, 255, (len(pred_classes), 3), dtype=np.uint8)  # Generate random colors for classes

        for i in range(len(pred_masks)):  
            # Convert binary mask to polygons
            contours, _ = cv2.findContours(pred_masks[i].astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            segmentation = []
            for contour in contours:
                contour = contour.flatten().tolist()  # Convert to list
                if len(contour) > 4:  # Only add valid polygons
                    segmentation.append(contour)

            if not segmentation:  
                continue  # Skip empty segmentations

            # Convert box format (x1, y1, x2, y2) → (x, y, width, height)
            x1, y1, x2, y2 = pred_boxes[i]
            bbox = [float(x1), float(y1), float(x2 - x1), float(y2 - y1)]

            # Compute area from the mask
            area = float(mask_util.area(mask_util.encode(np.asfortranarray(pred_masks[i].astype(np.uint8)))))

            category_id = int(pred_classes[i]) + 1  # COCO category IDs start from 1
            category_name = self.category_mapping.get(category_id, "Unknown")

            # COCO annotation format
            annotation = {
                "id": i + 1,  # Unique annotation ID
                "image_id": image_id,  # Reference to image
                "category_id": category_id,
                "segmentation": segmentation,  # Polygon segmentation
                "bbox": bbox,
                "area": area,
                "iscrowd": 0,  # No crowd annotations
                "score": float(scores[i])
            }
            coco_annotations.append(annotation)

            # 🔹 VISUALIZATION PART 🔹
            color = [int(c) for c in colors[i]]  # Get unique color for object

            # Draw bounding box
            cv2.rectangle(original_img, (int(x1), int(y1)), (int(x2), int(y2)), color, 2)

            # Draw segmentation mask (overlay with transparency)
            mask = pred_masks[i].astype(np.uint8) * 255  # Convert boolean mask to 0-255
            colored_mask = np.zeros_like(original_img, dtype=np.uint8)
            colored_mask[:, :, 0] = mask * color[0]  # Red channel
            colored_mask[:, :, 1] = mask * color[1]  # Green channel
            colored_mask[:, :, 2] = mask * color[2]  # Blue channel

            alpha = 0.5  # Transparency
            original_img = cv2.addWeighted(original_img, 1, colored_mask, alpha, 0)

            # Add label (category + confidence)
            label = f"{category_name}: {scores[i]:.2f}"
            cv2.putText(original_img, label, (int(x1), int(y1) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

        # Save and return the annotated image
        output_path = "annotated_image.jpg"
        cv2.imwrite(output_path, original_img)

        # Prepare final COCO output
        coco_output = {
            "images": [{"id": image_id, "file_name": image_path, "height": image_height, "width": image_width}],
            "annotations": coco_annotations,
            "categories": [{"id": 1, "name": "Building"}, {"id": 2, "name": "Shadow"},
                           {"id": 3, "name": "Tree"}, {"id": 4, "name": "Tree_Shadow"}]
        }

        return coco_output, output_path  # Return both COCO annotations and annotated image path


# Example usage:
# model = DataTypeConversionModel()
# coco_annotations, annotated_img_path = model.convert("test_image.jpg", image_id=1)
# print("COCO annotations:", coco_annotations)
# print("Annotated image saved at:", annotated_img_path)
