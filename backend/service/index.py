from flask import Flask
from flask_cors import CORS

import os, sys
sys.path.insert(0, os.path.abspath('./detectron2'))

from controllers.image_controller import image_controller

app = Flask(__name__)
CORS(app) 
app.register_blueprint(image_controller) 

if __name__ == "__main__":
    app.run(debug=True)