from flask import Flask
from controllers.image import image_controller

app = Flask(__name__)
app.register_blueprint(image_controller)  # Register the controller

if __name__ == "__main__":
    app.run(debug=True)