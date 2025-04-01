from model.detectron_model import DetectronModel
import cv2
import numpy as np
from pycocotools import mask as mask_util
import pycocotools.mask as mask_utils
import json

class DataTypeConversionModel:
    def __init__(self):
        self.model = DetectronModel()
        self.category_mapping = {1: "Building", 2: "Shadow", 3: "Tree", 4: "Tree_Shadow"} 
    
    def convert(self, image_path: str, image_id: int):
        """Run inference on an image, return COCO-style annotations"""
        img = cv2.imread(image_path)
        outputs = self.model.predictor(img)
        instances = outputs["instances"].to("cpu")

        pred_masks = instances.pred_masks.numpy()  # Shape: (N, H, W)
        pred_boxes = instances.pred_boxes.tensor.numpy()  # Shape: (N, 4)
        scores = instances.scores.numpy()  # Confidence scores
        pred_classes = instances.pred_classes.numpy()  # Class indices

        image_height, image_width = img.shape[:2]
        coco_annotations = []

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

        # Prepare final COCO output
        coco_output = {
            "images": [{"id": image_id, "file_name": image_path, "height": image_height, "width": image_width}],
            "annotations": coco_annotations,
            "categories": [{"id": 1, "name": "Building"}, {"id": 2, "name": "Shadow"},
                           {"id": 3, "name": "Tree"}, {"id": 4, "name": "Tree_Shadow"}]
        }

        return coco_output  # Return both COCO annotations and annotated image path

    def visualize_coco_annotations(self, image_path, coco_data):
        """Visualizes COCO annotations on an image with transparency."""
        img = cv2.imread(image_path)

        category_colors = {
            1: (255, 0, 0),   # Blue - Building
            2: (0, 0, 255),   # Red - Shadow
            3: (0, 255, 0),   # Green - Tree
            4: (128, 0, 128)  # Purple - Tree_Shadow
        }

        overlay = img.copy()  # Create an overlay for transparency
        alpha = 0.5  # Transparency level

        for annotation in coco_data["annotations"]:
            category_id = annotation["category_id"]
            bbox = annotation["bbox"]
            segmentation = annotation["segmentation"]
            score = annotation.get("score", 1.0)

            color = category_colors.get(category_id, (255, 255, 255))

            # Draw bounding box
            x, y, w, h = map(int, bbox)
            cv2.rectangle(img, (x, y), (x + w, y + h), color, 2)

            # Draw segmentation mask with transparency
            for seg in segmentation:
                points = np.array(seg, dtype=np.int32).reshape((-1, 2))
                cv2.polylines(img, [points], isClosed=True, color=color, thickness=2)
                cv2.fillPoly(overlay, [points], color=color)  # Fill mask on overlay

            # Add label
            category_name = next((cat["name"] for cat in coco_data["categories"] if cat["id"] == category_id), "Unknown")
            label = f"{category_name}: {score:.2f}"
            cv2.putText(img, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

        # Apply transparency blending
        img = cv2.addWeighted(overlay, alpha, img, 1 - alpha, 0)

        output_path = "visualized_image.jpg"
        cv2.imwrite(output_path, img)
        return output_path
    

    def smooth_masks(self, pred_masks):
        """Apply morphological operations to smooth masks."""
        smoothed_masks = []
        kernel = np.ones((5, 5), np.uint8)  # Adjust kernel size for stronger smoothing
        
        for mask in pred_masks:
            mask = mask.astype(np.uint8) * 255  # Convert to binary format
            smoothed = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)  # Closing operation
            smoothed = cv2.morphologyEx(smoothed, cv2.MORPH_OPEN, kernel)  # Opening operation
            smoothed_masks.append(smoothed // 255)  # Convert back to boolean format
        
        return np.array(smoothed_masks, dtype=bool)

    def convert_with_smoothing(self, image_path: str, image_id: int):
        """Run inference and smooth building and shadow annotations."""
        img = cv2.imread(image_path)
        outputs = self.model.predictor(img)
        instances = outputs["instances"].to("cpu")

        pred_masks = instances.pred_masks.numpy()  # Shape: (N, H, W)
        pred_boxes = instances.pred_boxes.tensor.numpy()  # Shape: (N, 4)
        scores = instances.scores.numpy()  # Confidence scores
        pred_classes = instances.pred_classes.numpy()  # Class indices

        # Apply smoothing only to Building (1) and Shadow (2) categories
        mask_indices = np.isin(pred_classes, [0, 1])  # Adjust indices if needed
        pred_masks[mask_indices] = self.smooth_masks(pred_masks[mask_indices])

        image_height, image_width = img.shape[:2]
        coco_annotations = []

        for i in range(len(pred_masks)):
            contours, _ = cv2.findContours(pred_masks[i].astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            segmentation = []
            for contour in contours:
                contour = cv2.approxPolyDP(contour, epsilon=2.0, closed=True)  # Approximate polygons
                contour = contour.flatten().tolist()
                if len(contour) > 4:
                    segmentation.append(contour)
            if not segmentation:
                continue

            x1, y1, x2, y2 = pred_boxes[i]
            bbox = [float(x1), float(y1), float(x2 - x1), float(y2 - y1)]
            area = float(mask_util.area(mask_util.encode(np.asfortranarray(pred_masks[i].astype(np.uint8)))))
            category_id = int(pred_classes[i]) + 1
            annotation = {
                "id": i + 1,
                "image_id": image_id,
                "category_id": category_id,
                "segmentation": segmentation,
                "bbox": bbox,
                "area": area,
                "iscrowd": 0,
                "score": float(scores[i])
            }
            coco_annotations.append(annotation)
        
        coco_output = {
            "images": [{"id": image_id, "file_name": image_path, "height": image_height, "width": image_width}],
            "annotations": coco_annotations,
            "categories": [{"id": 1, "name": "Building"}, {"id": 2, "name": "Shadow"},
                            {"id": 3, "name": "Tree"}, {"id": 4, "name": "Tree_Shadow"}]
        }
        
        return coco_output   
