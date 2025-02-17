from flask import Flask

import os, sys
sys.path.insert(0, os.path.abspath('./detectron2'))

from controllers.image_controller import image_controller

app = Flask(__name__)
app.register_blueprint(image_controller) 

if __name__ == "__main__":
    app.run(debug=True)