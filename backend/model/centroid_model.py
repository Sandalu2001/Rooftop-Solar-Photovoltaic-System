import numpy as np
from scipy.spatial.distance import cdist
import torch
from detectron2.structures import Instances
import cv2
from model.detectron_model import DetectronModel  

class BuildingShadowMatcher:
    def __init__(self):
        self.model = DetectronModel()
        self.building_class = 0 
        self.shadow_class = 1  
        self.tree_class = 2
        self.tree_shadow_class = 3

    def extract_masks(self, image_path):
        """Extract building and shadow masks from the image"""
        outputs = self.model.predictor(cv2.imread(image_path))
        instances = outputs["instances"].to("cpu")
        
        # Get masks and categories
        masks = instances.pred_masks.numpy()
        classes = instances.pred_classes.numpy()
        
        buildings = [masks[i] for i in range(len(classes)) if classes[i] == self.building_class]
        shadows = [masks[i] for i in range(len(classes)) if classes[i] == self.shadow_class]
        # trees = [masks[i] for i in range(len(classes)) if classes[i] == self.tree_class]
        # treeShadows = [masks[i] for i in range(len(classes)) if classes[i] == self.tree_shadow_class]
        
        return buildings, shadows

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

    def process_image(self, image_path):
        """Run the full process: predict, extract, match"""
        buildings, shadows = self.extract_masks(image_path)
        matches = self.match_buildings_to_shadows(buildings, shadows)
        
        for b_id, s_id in matches.items():
            print(f"Building {b_id} -> Shadow {s_id}")
        
        return matches