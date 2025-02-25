import os
from flask import Blueprint, request, jsonify, send_file
from werkzeug.utils import secure_filename
from model.detectron_model import DetectronModel
from model.centroid_model import BuildingShadowMatcher
from model.data_type_conversion_model import DataTypeConversionModel

image_controller = Blueprint("image_controller", __name__)
model = DetectronModel()
matcher = BuildingShadowMatcher()
converter = DataTypeConversionModel()

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
    filename = secure_filename(file.filename) # Returns a secure file name 
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


@image_controller.route("/match", methods=["POST"])
def match():
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
        result_path = matcher.process_image(img_path)
        
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
        coco_output, output_path = converter.convert(img_path,1)
        
         # Convert to absolute path
        abs_result_path = os.path.abspath(output_path)
        print(f"Sending file: {abs_result_path}")

        if not os.path.exists(abs_result_path):
            return jsonify({"error": f"File not found: {abs_result_path}"}), 500
        
        # return coco_output
        return send_file(abs_result_path, mimetype="image/png")
    except Exception as e:
        return jsonify({"error": str(e)}), 500