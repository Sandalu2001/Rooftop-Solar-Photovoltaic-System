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
from shapely.geometry import Polygon
from shapely.ops import triangulate
from pycocotools import mask as mask_utils
import matplotlib.pyplot as plt
import numpy as np
import pyvista as pv
import trimesh
import random

class BuildingShadowMatcher:
    def __init__(self):
        self.model = DetectronModel()
        self.building_class = 0  # Index for "Building" in thing_classes
        self.shadow_class = 1  # Index for "Shadow" in thing_classes

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
    
    def find_building_tree_shadow_pairs(self, coco_data, distance_threshold=100):
        """Finds building-shadow and tree-shadow pairs in a COCO JSON and returns them uniquely.

        Args:
            coco_data (dict): COCO annotation dictionary.
            distance_threshold (int, optional): Maximum distance between centroids
                                                to consider objects as corresponding pairs.

        Returns:
            dict: A COCO format dictionary containing building-shadow and tree-shadow pairs,
                uniquely identified with separate `pair_id` sequences.
        """

        # Get category IDs for Buildings, Shadows, Trees, and Tree_Shadows
        category_ids = self.get_category_ids(coco_data, ['Building', 'Shadow', 'Tree', 'Tree_Shadow'])

        # Ensure all required categories exist
        if any(cat not in category_ids for cat in ['Building', 'Shadow', 'Tree', 'Tree_Shadow']):
            print("Error: One or more categories ('Building', 'Shadow', 'Tree', 'Tree_Shadow') not found in COCO annotations.")
            return {}

        building_category_id = category_ids['Building']
        shadow_category_id = category_ids['Shadow']
        tree_category_id = category_ids['Tree']
        tree_shadow_category_id = category_ids['Tree_Shadow']

        # Organize annotations by image
        image_annotations = {}
        for annotation in coco_data.get('annotations', []):
            image_id = annotation['image_id']
            if image_id not in image_annotations:
                image_annotations[image_id] = []
            image_annotations[image_id].append(annotation)

        coco_pairs_data = {
            'images': coco_data.get('images', []),
            'categories': coco_data.get('categories', []),
            'annotations': []
        }

        # Unique pair ID counters for buildings and trees
        building_pair_id_counter = 1
        tree_pair_id_counter = 1000  # Start at 1000 to distinguish from building pairs

        for image_id, annotations_in_image in image_annotations.items():
            # Separate annotations by type
            building_annotations = [ann for ann in annotations_in_image if ann['category_id'] == building_category_id]
            shadow_annotations = [ann for ann in annotations_in_image if ann['category_id'] == shadow_category_id]
            tree_annotations = [ann for ann in annotations_in_image if ann['category_id'] == tree_category_id]
            tree_shadow_annotations = [ann for ann in annotations_in_image if ann['category_id'] == tree_shadow_category_id]

            ## --- Pair Buildings with Shadows ---
            for building_ann in building_annotations:
                building_centroid = self.calculate_centroid(building_ann.get('segmentation'))
                if building_centroid is None:
                    continue

                closest_shadow_ann = None
                min_distance = float('inf')

                for shadow_ann in shadow_annotations:
                    shadow_centroid = self.calculate_centroid(shadow_ann.get('segmentation'))
                    if shadow_centroid is None:
                        continue

                    distance = self.calculate_distance(building_centroid, shadow_centroid)
                    if distance < min_distance and distance <= distance_threshold:
                        min_distance = distance
                        closest_shadow_ann = shadow_ann

                if closest_shadow_ann:
                    building_ann['pair_id'] = building_pair_id_counter
                    closest_shadow_ann['pair_id'] = building_pair_id_counter
                    coco_pairs_data['annotations'].append(building_ann)
                    coco_pairs_data['annotations'].append(closest_shadow_ann)
                    building_pair_id_counter += 1

            ## --- Pair Trees with Tree_Shadows ---
            for tree_ann in tree_annotations:
                tree_centroid = self.calculate_centroid(tree_ann.get('segmentation'))
                if tree_centroid is None:
                    continue

                closest_tree_shadow_ann = None
                min_distance = float('inf')

                for tree_shadow_ann in tree_shadow_annotations:
                    tree_shadow_centroid = self.calculate_centroid(tree_shadow_ann.get('segmentation'))
                    if tree_shadow_centroid is None:
                        continue

                    distance = self.calculate_distance(tree_centroid, tree_shadow_centroid)
                    if distance < min_distance and distance <= distance_threshold:
                        min_distance = distance
                        closest_tree_shadow_ann = tree_shadow_ann

                if closest_tree_shadow_ann:
                    tree_ann['pair_id'] = tree_pair_id_counter
                    closest_tree_shadow_ann['pair_id'] = tree_pair_id_counter
                    coco_pairs_data['annotations'].append(tree_ann)
                    coco_pairs_data['annotations'].append(closest_tree_shadow_ann)
                    tree_pair_id_counter += 1

        return coco_pairs_data
    
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
    
    def calculate_object_height(self, shadow_length, sun_elevation_angle):
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
    
    def compute_object_heights(self, coco_data, sun_elevation_angle, category_names):
        """Computes building heights from shadow lengths and adds them to the COCO annotations.

        Args:
            coco_data (dict): COCO annotation dictionary.
            sun_elevation_angle (float): Sun elevation angle in degrees.
            category_names (dict): Category names.

        Returns:
            dict: Updated COCO data with `building_height` included in building annotations.
        """
        category_ids = self.get_category_ids(coco_data, category_names)

        if category_names[0] not in category_ids or category_names[1] not in category_ids:
            print("Error: "+category_names[0]+" or "+category_names[1]+" categories not found in COCO annotations.")
            return coco_data  # Return original data if categories are missing

        object_category_id = category_ids[category_names[0]]
        shadow_category_id = category_ids[category_names[1]]

        # Create a mapping of shadows by image_id
        shadow_annotations = {ann['image_id']: [] for ann in coco_data['annotations'] if ann['category_id'] == shadow_category_id}
        for ann in coco_data['annotations']:
            if ann['category_id'] == shadow_category_id:
                shadow_annotations[ann['image_id']].append(ann)

        # Update buildings with estimated height
        for ann in coco_data['annotations']:
            if ann['category_id'] == object_category_id:
                image_id = ann['image_id']

                # Find the nearest shadow for this object
                closest_shadow = None
                min_distance = float('inf')

                object_centroid = self.calculate_centroid(ann.get('segmentation'))
                if object_centroid is None:
                    continue

                for shadow_ann in shadow_annotations.get(image_id, []):
                    shadow_centroid = self.calculate_centroid(shadow_ann.get('segmentation'))
                    if shadow_centroid is None:
                        continue

                    distance = self.calculate_distance(object_centroid, shadow_centroid)
                    if distance < min_distance:
                        min_distance = distance
                        closest_shadow = shadow_ann

                # Compute height only if a shadow is found
                if closest_shadow:
                    shadow_length = self.calculate_shadow_length(closest_shadow.get('segmentation'))
                    if shadow_length is not None:
                        object_height = self.calculate_object_height(shadow_length, sun_elevation_angle)
                        ann['object_height'] = object_height  # Add to COCO annotation

        return coco_data  # Return updated COCO JSON

    def extract_object_data(self,coco_data,category):
        """Extracts object footprints and heights from COCO annotations.

        Args:
            coco_data (dict): COCO annotation dictionary with `object_height`.
            category (str): The category to filter ('Building' or 'Tree').

        Returns:
            list: List of (footprint, height) tuples.
        """
        objects = []

        # Get the category id for the specified category
        category_id = self.get_category_ids(coco_data, [category]).get(category)
        if category_id is None:
            print(f"Error: Category '{category}' not found in COCO annotations.")
            return objects
            
        for ann in coco_data.get("annotations", []):
            if ann.get("category_id") == category_id:
                # Get the object height (which could be a tree or building)
                height = ann.get("object_height", None)  # Assuming 'object_height' instead of 'building_height'
                segmentation = ann.get("segmentation", [[]])[0]
                
                if segmentation and height is not None:
                    points = np.array(segmentation).reshape(-1, 2)
                    objects.append((points, height))

        return objects

    def generate_3d_model(self, coco_data, output_path, image_path):
        """Generates an interactive 3D model from COCO data, including trees and buildings.

        Args:
            coco_data (dict): COCO annotation dictionary with `object_height`.
            output_path (str): Output directory to save the 3D model.
            image_path (str): Path to the original image.

        Returns:
            str: Path to the saved 3D GLB file.
        """
        plotter = pv.Plotter(off_screen=True)

        # Load image to get dimensions
        img = Image.open(image_path)
        img_width, img_height = img.size

        # Scale the image to match ground plane
        scale_factor = 1.0  
        i_size = img_width * scale_factor
        j_size = img_height * scale_factor

        # Load ground texture
        ground_texture = pv.read_texture(image_path)
        
        # Create the ground plane
        image_plane = pv.Plane(
            center=(img_width / 2, -img_height / 2, 0),
            i_size=i_size,
            j_size=j_size,
            direction=(0, 0, 1)
        )
        image_plane.texture_map_to_plane(inplace=True)
        plotter.add_mesh(image_plane, texture=ground_texture)

        # Extract buildings and trees
        buildings = self.extract_object_data(coco_data, "Building")
        trees = self.extract_object_data(coco_data, "Tree")

        ## ---- ADD BUILDINGS ---- ##
        for footprint, height in buildings:
            footprint_3d = np.array([(x, -y, 0) for x, y in footprint])
            top_3d = np.array([(x, -y, height) for x, y in footprint])

            all_points = np.vstack([footprint_3d, top_3d])
            faces = []

            # Side walls
            for i in range(len(footprint)):
                next_i = (i + 1) % len(footprint)
                faces.append([4, i, next_i, next_i + len(footprint), i + len(footprint)])

            # Bottom face
            faces.append([len(footprint)] + list(range(len(footprint))))  

            # Top face
            faces.append([len(footprint)] + list(range(len(footprint), len(all_points))))  

            # Create building mesh
            mesh = pv.PolyData(all_points, np.hstack(faces))

            # Random building color
            building_color = [random.random(), random.random(), random.random()]
            plotter.add_mesh(mesh, color=building_color, show_edges=True)

        ## ---- ADD TREES ---- ##
        for footprint, height in trees:
            # Tree position (assume centroid)
            centroid = np.mean(footprint, axis=0)
            x, y = centroid

            # Create tree trunk (Cylinder)
            trunk_radius = height * 0.1  # 10% of height
            trunk = pv.Cylinder(center=(x, -y, trunk_radius), direction=(0, 0, 1), 
                                radius=trunk_radius, height=height * 0.5)
            plotter.add_mesh(trunk, color=(0.55, 0.27, 0.07))  # Brown trunk

            # Create tree canopy (Sphere)
            canopy_radius = height * 0.4  # 40% of height
            canopy = pv.Sphere(center=(x, -y, height * 0.75), radius=canopy_radius)
            plotter.add_mesh(canopy, color=(0.13, 0.55, 0.13))  # Green canopy

        ## ---- EXPORT MODEL ---- ##
        plotter.camera_position = 'iso'
        output_glb_path = os.path.join(output_path, "3d_model.glb")
        plotter.export_gltf(output_glb_path)

        return output_glb_path






            