import numpy as np
from scipy.spatial.distance import cdist
import torch
import cv2
import os
from detectron2.utils.visualizer import Visualizer
from detectron2.structures import Instances
from model.detectron_model import DetectronModel  # Import your existing model
from math import sqrt
import math
from PIL import Image, ImageDraw

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
    

    # ------------------ NEW VERSION ------------------ #
    def get_category_ids(self, coco_data, category_names):
        """Gets category IDs for given category names.

        Args:
            coco_data (dict): COCO annotation dictionary.
            category_names (list): List of category names (e.g., ['building', 'shadow']).

        Returns:
            dict: Dictionary mapping category names to their IDs.
                    Returns None for a category if not found.
        """
        category_ids = {}
        for cat_info in coco_data.get('categories', []):
            if cat_info['name'] in category_names:
                category_ids[cat_info['name']] = cat_info['id']
        return category_ids
    
    def calculate_centroid(self,segmentation):
        """Calculates the centroid of a polygon segmentation.

        Args:
            segmentation (list): COCO segmentation format (list of lists of floats).
                                Assumes a single polygon for simplicity.

        Returns:
            tuple: (centroid_x, centroid_y) or None if segmentation is invalid.
        """
        if not segmentation or not segmentation[0]:
            return None  # Handle empty or invalid segmentation

        polygon = np.array(segmentation[0]).reshape(-1, 2)  # Reshape to (n_points, 2)
        centroid_x = np.mean(polygon[:, 0])
        centroid_y = np.mean(polygon[:, 1])
        return centroid_x, centroid_y
    
    def calculate_distance(self, centroid1, centroid2):
        """Calculates Euclidean distance between two centroids.

        Args:
            centroid1 (tuple): (x, y) centroid of the first object.
            centroid2 (tuple): (x, y) centroid of the second object.

        Returns:
            float: Euclidean distance.
        """
        if centroid1 is None or centroid2 is None:
            return float('inf')  # Return infinity if either centroid is invalid
        x1, y1 = centroid1
        x2, y2 = centroid2
        return sqrt((x2 - x1)**2 + (y2 - y1)**2)
    
    def find_building_shadow_pairs(self,coco_data, distance_threshold=100):
        """Finds building and corresponding shadow annotation pairs in a COCO JSON and returns in COCO format.

        Assumptions for correspondence:
        - Annotations are in the same image.
        - Shadows are spatially close to buildings (within distance_threshold).
        - Simplest correspondence: For each building, find the closest shadow within the threshold.

        Args:
            coco_data (dict): COCO annotation dictionary.
            distance_threshold (int, optional): Maximum distance between centroids
                                            to consider a building and shadow as corresponding.
                                            Defaults to 100 pixels. Adjust based on image size
                                            and object scale in your dataset.

        Returns:
            dict: A COCO format dictionary containing annotations representing building-shadow pairs.
                 The 'annotations' list in the returned dictionary will contain modified building and shadow
                 annotations, each linked by a 'pair_id'.
        """

        category_ids = self.get_category_ids(coco_data, ['Building', 'Shadow'])

        if 'Building' not in category_ids or 'Shadow' not in category_ids:
            print("Error: 'building' or 'shadow' categories not found in COCO annotations.")
            return {}

        building_category_id = category_ids['Building']
        shadow_category_id = category_ids['Shadow']

        image_annotations = {}
        for annotation in coco_data.get('annotations', []):
            image_id = annotation['image_id']
            if image_id not in image_annotations:
                image_annotations[image_id] = []
            image_annotations[image_id].append(annotation)

        coco_pairs_data = {
            'images': coco_data.get('images', []),
            'categories': coco_data.get('categories', []),
            'annotations': [] # Initialize empty annotations list for pairs
        }
        annotation_id_counter = 1 # Counter for new annotation IDs (if needed, though we can reuse original)
        pair_id_counter = 1 # Counter for pair IDs

        for image_id, annotations_in_image in image_annotations.items():
            building_annotations = [ann for ann in annotations_in_image if ann['category_id'] == building_category_id]
            shadow_annotations = [ann for ann in annotations_in_image if ann['category_id'] == shadow_category_id]

            if not building_annotations or not shadow_annotations:
                continue  # No buildings or shadows in this image, skip

            for building_ann in building_annotations:
                # Calculate centroid of building annotation
                building_centroid = self.calculate_centroid(building_ann.get('segmentation'))
                if building_centroid is None:
                    continue # Skip if building segmentation is invalid

                closest_shadow_ann = None
                min_distance = float('inf')

                # Find the closest shadow to the building
                for shadow_ann in shadow_annotations:
                    shadow_centroid = self.calculate_centroid(shadow_ann.get('segmentation'))
                    if shadow_centroid is None:
                        continue # Skip if shadow segmentation is invalid

                    distance = self.calculate_distance(building_centroid, shadow_centroid)
                    if distance < min_distance and distance <= distance_threshold:
                        min_distance = distance
                        closest_shadow_ann = shadow_ann

                if closest_shadow_ann:
                    building_ann['pair_id'] = pair_id_counter # Add pair_id to building annotation
                    closest_shadow_ann['pair_id'] = pair_id_counter # Add pair_id to shadow annotation
                    coco_pairs_data['annotations'].append(building_ann) # Add building annotation to coco_pairs_data
                    coco_pairs_data['annotations'].append(closest_shadow_ann) # Add shadow annotation to coco_pairs_data
                    pair_id_counter += 1
                    # Optionally remove paired shadow to prevent re-pairing (depends on desired logic)
                    # shadow_annotations.remove(closest_shadow_ann) # Be careful modifying list while iterating

        return coco_pairs_data

    def visualize_building_shadow_pairs(self, coco_pairs_data, image_path, output_dir="results"):
        """Visualizes building-shadow pairs on a single image and saves it. (Single Image Version)

        Args:
            coco_pairs_data (dict): COCO format dictionary with paired annotations for ONE image.
            image_path (str): Path to the original image.
            output_dir (str, optional): Directory to save annotated image. Defaults to "results".
        """
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)

        try:
            image = Image.open(image_path).convert("RGB")
            draw = ImageDraw.Draw(image)
        except FileNotFoundError:
            print(f"Warning: Image file not found: {image_path}. Skipping visualization.")
            return  # Exit if image not found

        annotations = coco_pairs_data.get('annotations', []) # Get annotations, handle if missing

        for ann in annotations:
            if 'segmentation' not in ann or not ann['segmentation']:
                print(f"Warning: Missing segmentation data for annotation {ann}. Skipping...")
                continue  # Skip annotations with no segmentation data

            polygon = np.array(ann['segmentation'][0]).reshape(-1, 2).tolist()
            flat_polygon = [coord for point in polygon for coord in point]  # Flatten to [x1, y1, x2, y2, ...]

            # Assign colors based on category
            category_ids = self.get_category_ids(coco_pairs_data, ['Building', 'Shadow'])
            if ann['category_id'] == category_ids.get('Building'):
                color = (255, 0, 0)  # Red for building
            elif ann['category_id'] == category_ids.get('Shadow'):
                color = (0, 0, 255)  # Blue for shadow
            else:
                color = (0, 255, 0)  # Green for others

            draw.polygon(flat_polygon, outline=color, fill=color)

        # Save the visualized image to the output directory
        base_filename = os.path.splitext(os.path.basename(image_path))[0]
        output_filename = f"{base_filename}_annotated.jpg"
        output_path = os.path.join(output_dir, output_filename)
            
        image.save(output_path, "JPEG")            
        print(f"Saved annotated image: {output_path}")
        return output_path
    
    def calculate_shadow_length(self,segmentation):
        """Calculates the longest length of a shadow from segmentation points.
        
        Args:
            segmentation (list): COCO segmentation format (list of lists of floats).
        
        Returns:
            float: Maximum Euclidean distance between shadow boundary points.
        """
        if not segmentation or not segmentation[0]:
            return None  # Handle empty or invalid segmentation

        points = np.array(segmentation[0]).reshape(-1, 2)  # Reshape to (N, 2)
        
        max_length = 0
        for i in range(len(points)):
            for j in range(i + 1, len(points)):  # Compare all pairs of points
                distance = np.linalg.norm(points[i] - points[j])
                max_length = max(max_length, distance)

        return max_length
    
    def calculate_building_height(self, shadow_length, sun_elevation_angle):
        """Calculates the height of a building using shadow length and sun angle.

        Args:
            shadow_length (float): Length of the shadow in pixels.
            sun_elevation_angle (float): Sun elevation angle in degrees.

        Returns:
            float: Estimated building height.
        """
        if shadow_length is None or sun_elevation_angle <= 0:
            return None  # Avoid division by zero
        
        # Convert degrees to radians for tan function
        sun_angle_rad = math.radians(sun_elevation_angle)

        # Height formula: shadow_length * tan(sun_angle)
        height = shadow_length * math.tan(sun_angle_rad)
        
        return height
    
    def compute_building_heights(self, coco_data, sun_elevation_angle):
        """Computes building heights from shadow lengths and sun elevation angle.

        Args:
            coco_data (dict): COCO annotation dictionary.
            sun_elevation_angle (float): Sun elevation angle in degrees.

        Returns:
            dict: Mapping of building IDs to their estimated heights.
        """
        category_ids = self.get_category_ids(coco_data, ['Building', 'Shadow'])

        if 'Building' not in category_ids or 'Shadow' not in category_ids:
            print("Error: 'building' or 'shadow' categories not found in COCO annotations.")
            return {}

        building_heights = {}

        for image_ann in coco_data.get('annotations', []):
            if image_ann['category_id'] == category_ids['Shadow']:
                print(image_ann.get('segmentation'))
                shadow_length = self.calculate_shadow_length(image_ann.get('segmentation'))
                if shadow_length is None:
                    continue

                height = self.calculate_building_height(shadow_length, sun_elevation_angle)
                print(height)
                building_heights[image_ann['id']] = height

        return building_heights

            