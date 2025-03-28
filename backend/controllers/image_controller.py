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
    filename = secure_filename(file.filename) 
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

@image_controller.route("/satellite-image", methods=["GET"])
def get_satellite_data():
    try:
        point = ee.Geometry.Point([-122.4194, 37.7749]).buffer(500)  # San Francisco

        # Fetch the image collection
        collection =  (
            ee.ImageCollection("COPERNICUS/S2")
            .filterBounds(point)
            .filterDate("2023-01-01", "2023-12-31")
            .sort("system:time_start", False)
            
            .first()
        )

        vis_params = {
            "bands": ["B4", "B3", "B2"],  # RGB bands
            "min": 0,
            "max": 3000,
            "dimensions": 1024
        }
     
        # # Check if any images exist
        # count = collection.size().getInfo()  # Convert to Python int
        # if count == 0:
        #     return jsonify({'error': 'No images found for this location'}), 404

        # image = collection.first()  # Get the first image

        print("Fetching image")

         # Generate Map Tile URL (For Leaflet / React)
        map_id = collection.getMapId(vis_params)
        return jsonify({
            "tile_url": map_id["tile_fetcher"].url_format
        })
        # # Generate thumbnail URL
        # url = collection.getThumbURL({'min': 0, 'max': 3000, 'bands': ['B4', 'B3', 'B2']})
        # return jsonify({'image_url': url})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@image_controller.route('/centroid',methods=['POST'])
def get_centroid():
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
        coco_output = converter.convert(img_path,1)
        updated_coco_output = matcher.find_building_shadow_pairs(coco_output)
        # print(updated_coco_output)
        result_path = matcher.visualize_building_shadow_pairs(updated_coco_output,img_path,"uploads")

        building_heights = matcher.compute_building_heights(updated_coco_output, 45)
        print(building_heights)
        print(result_path)
         # Convert to absolute path
        abs_result_path = os.path.abspath(result_path)
        print(f"Sending file: {abs_result_path}")

        if not os.path.exists(abs_result_path):
            return jsonify({"error": f"File not found: {abs_result_path}"}), 500
        
        return send_file(abs_result_path, mimetype="image/png")

        # if shadowPairs is None:
        #     return jsonify({"error": "No shadow pairs found"}), 404

        # return jsonify({"shadowPairs": shadowPairs})
    except Exception as e:
        return jsonify({"error": str(e)}), 500