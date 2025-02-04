import os
import json
import cv2
import numpy as np
from pycocotools.coco import COCO

# Load coco annotaiton
def load_coco_json(json_path):
    with open(json_path, 'r') as f:
        return json.load(f)

# 
def save_coco_json(data, output_path):
    with open(output_path, 'w') as f:
        json.dump(data, f, indent=4)

# flip the file 
def flip_image(image, flip_code):
    return cv2.flip(image, flip_code)


def update_annotations(annotations, img_height, img_width, transform):
    updated_annotations = []
    for ann in annotations:
        new_ann = ann.copy()
        bbox = ann['bbox']
        x, y, w, h = bbox
        
        if transform == 'vertical':
            new_ann['bbox'] = [x, img_height - (y + h), w, h]
        elif transform == 'horizontal':
            new_ann['bbox'] = [img_width - (x + w), y, w, h]
        elif transform == 'both':
            new_ann['bbox'] = [img_width - (x + w), img_height - (y + h), w, h]
        
        updated_annotations.append(new_ann)
    return updated_annotations

def augment_dataset(image_dir, json_path, output_dir, output_json):
    os.makedirs(output_dir, exist_ok=True)
    coco_data = load_coco_json(json_path)
    coco = COCO(json_path)
    new_images = []
    new_annotations = []
    image_id_offset = len(coco_data['images'])
    ann_id_offset = len(coco_data['annotations'])
    
    for image in coco_data['images']:
        img_path = os.path.join(image_dir, image['file_name'])
        img = cv2.imread(img_path)
        if img is None:
            continue
        img_height, img_width = img.shape[:2]
        image_id = image['id']
        
        anns = coco.getAnnIds(imgIds=[image_id])
        annotations = coco.loadAnns(anns)
        
        transformations = {
            'vertical': flip_image(img, 0),
            'horizontal': flip_image(img, 1),
            'both': flip_image(img, -1)
        }
        
        for i, (key, transformed_img) in enumerate(transformations.items(), 1):
            new_filename = f"aug_{key}_{image['file_name']}"
            new_img_id = image_id + i * image_id_offset
            new_img_path = os.path.join(output_dir, new_filename)
            cv2.imwrite(new_img_path, transformed_img)
            
            new_images.append({
                'id': new_img_id,
                'file_name': new_filename,
                'width': img_width,
                'height': img_height
            })
            
            transformed_annotations = update_annotations(annotations, img_height, img_width, key)
            for ann in transformed_annotations:
                ann['id'] += ann_id_offset
                ann['image_id'] = new_img_id
                new_annotations.append(ann)
                ann_id_offset += 1
    
    coco_data['images'].extend(new_images)
    coco_data['annotations'].extend(new_annotations)
    save_coco_json(coco_data, output_json)

augment_dataset('images', 'sample-coco.json', 'augmented_images', 'augmented-coco.json')
