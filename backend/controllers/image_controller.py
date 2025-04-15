import os
from flask import Blueprint, request, jsonify, send_file
from werkzeug.utils import secure_filename
from model.detectron_model import DetectronModel
from model.centroid_model import BuildingShadowMatcher
from model.data_type_conversion_model import DataTypeConversionModel
import ee

image_controller = Blueprint("image_controller", __name__)
model = DetectronModel()
matcher = BuildingShadowMatcher()
converter = DataTypeConversionModel()

ee.Initialize(project='ee-final-year-project-2001')

UPLOAD_FOLDER = "uploads"
RESULT_FOLDER = "results"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

@image_controller.route("/predict", methods=["POST"])
def predict():
    """Handle image upload and run model inference."""
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    # Save uploaded image
    filename = secure_filename(file.filename) 
    img_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(img_path)

    try:
        result_path = model.predict(img_path)
        
         # Convert to absolute path
        abs_result_path = os.path.abspath(result_path)
        print(f"Sending file: {abs_result_path}")

        if not os.path.exists(abs_result_path):
            return jsonify({"error": f"File not found: {abs_result_path}"}), 500
        
        return send_file(abs_result_path, mimetype="image/png")
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@image_controller.route("/convert", methods=["POST"])
def convert():
    """Handle image upload and run model inference."""
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    # Save uploaded image
    filename = secure_filename(file.filename) # Returns a secure file name 
    img_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(img_path)

    try:
        coco_output = converter.convert_with_smoothing(img_path,1)
        output_path = converter.visualize_coco_annotations(img_path, coco_output)
        
         # Convert to absolute path
        abs_result_path = os.path.abspath(output_path)

        if not os.path.exists(abs_result_path):
            return jsonify({"error": f"File not found: {abs_result_path}"}), 500
        
        # return coco_output
        return jsonify({"coco_output": coco_output})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@image_controller.route('/centroid',methods=['POST'])
def get_centroid():
    json_data = request.form.get("json")
    if not json_data:
        return jsonify({"error": "No JSON data received"}), 400
    
    if json_data:
        coco_output = eval(json_data)

    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    image = request.files['image']
    if image.filename == '':
            return jsonify({"error": "No selected image"}), 400

    # Save image
    img_path = os.path.join(UPLOAD_FOLDER, image.filename) 
    image.save(img_path)

    try:
        updated_coco_output = matcher.find_building_tree_shadow_pairs(coco_output.get('coco_output',{}),250)
        coco_output_with_tree_height = matcher.compute_object_heights(updated_coco_output, 45, ['Tree', 'Tree_Shadow'])
        coco_output_with_building_height = matcher.compute_object_heights(coco_output_with_tree_height, 45, ['Building', 'Shadow'])

        return jsonify({"coco_output": coco_output_with_building_height})
    except Exception as e:
        return jsonify({"error": str(e)}), 500