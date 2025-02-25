import numpy as np
from scipy.spatial.distance import cdist
import torch
import cv2
import os
from detectron2.utils.visualizer import Visualizer
from detectron2.structures import Instances
from model.detectron_model import DetectronModel  # Import your existing model

class BuildingShadowMatcher:
    def __init__(self):
        self.model = DetectronModel()
        self.building_class = 0  # Index for "Building" in thing_classes
        self.shadow_class = 1  # Index for "Shadow" in thing_classes

    def extract_masks(self, image_path):
        """Extract building and shadow masks from the image"""
        outputs = self.model.predictor(cv2.imread(image_path))
        instances = outputs["instances"].to("cpu")
        
        # Get masks and categories
        masks = instances.pred_masks.numpy()
        classes = instances.pred_classes.numpy()

        print(len(masks[0][0]))
        
        buildings = [masks[i] for i in range(len(classes)) if classes[i] == self.building_class]
        shadows = [masks[i] for i in range(len(classes)) if classes[i] == self.shadow_class]
        
        return buildings, shadows, instances, outputs

    def compute_centroids(self, masks):
        """Compute the centroid of each mask"""
        centroids = []
        for mask in masks:
            y, x = np.where(mask)  # Get nonzero pixels
            if len(x) == 0 or len(y) == 0:
                continue  # Skip empty masks
            centroid_x = np.mean(x)
            centroid_y = np.mean(y)
            centroids.append((centroid_x, centroid_y))
        return centroids

    def match_buildings_to_shadows(self, buildings, shadows):
        """Match each building to the closest shadow using centroid distance"""
        building_centroids = self.compute_centroids(buildings)
        shadow_centroids = self.compute_centroids(shadows)
        
        if not building_centroids or not shadow_centroids:
            return {}
        
        distances = cdist(building_centroids, shadow_centroids, metric='euclidean')
        building_to_shadow = {i: np.argmin(distances[i]) for i in range(len(building_centroids))}
        
        return building_to_shadow

    def visualize_matches(self, image_path, instances, matches):
        """Visualize the first building and shadow match with labels"""
        im = cv2.imread(image_path)
        v = Visualizer(im[:, :, ::-1], metadata=self.model.metadata, scale=0.5)
        out = v.draw_instance_predictions(instances)

        # Convert RGB to BGR (since OpenCV expects BGR format)
        result_image = out.get_image()[:, :, ::-1].copy() 

        if matches:
            for b_id, s_id in matches.items():
                building_mask = instances.pred_masks[b_id].numpy()
                shadow_mask = instances.pred_masks[s_id].numpy()
                
                # Get centroids for labeling
                b_centroid = self.compute_centroids([building_mask])[0]
                s_centroid = self.compute_centroids([shadow_mask])[0]
                
                # Draw labels
                cv2.putText(result_image, f"Building {b_id}", 
                            (int(b_centroid[0]), int(b_centroid[1])), 
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)
                cv2.putText(result_image, f"Shadow {s_id}", 
                            (int(s_centroid[0]), int(s_centroid[1])), 
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

                print(f"Building {b_id} -> Shadow {s_id}")

        result_path = os.path.join("results", os.path.basename(image_path))
        cv2.imwrite(result_path, result_image)  # Use corrected image
        return result_path

        """Visualize the first building and shadow match with labels"""
        im = cv2.imread(image_path)
        v = Visualizer(im[:, :, ::-1], metadata=self.model.metadata, scale=0.5)
        out = v.draw_instance_predictions(instances)
        
        if matches:
            for b_id, s_id in matches.items():
                building_mask = instances.pred_masks[b_id].numpy()
                shadow_mask = instances.pred_masks[s_id].numpy()
                
                # Get centroids for labeling
                b_centroid = self.compute_centroids([building_mask])[0]
                s_centroid = self.compute_centroids([shadow_mask])[0]
                
                # Draw labels
                cv2.putText(out.get_image()[:, :, ::-1], f"Building {b_id}", (int(b_centroid[0]), int(b_centroid[1])), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)
                cv2.putText(out.get_image()[:, :, ::-1], f"Shadow {s_id}", (int(s_centroid[0]), int(s_centroid[1])), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                
                print(f"Building {b_id} -> Shadow {s_id}")
        
        result_path = os.path.join("results", os.path.basename(image_path))
        cv2.imwrite(result_path, out.get_image()[:, :, ::-1])
        return result_path

    def process_image(self, image_path):
        """Run the full process: predict, extract, match, visualize"""
        buildings, shadows, instances, outputs = self.extract_masks(image_path)
        matches = self.match_buildings_to_shadows(buildings, shadows)
        
        return self.visualize_matches(image_path, outputs["instances"].to("cpu"), matches)
