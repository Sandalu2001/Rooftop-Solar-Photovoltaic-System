import detectron2
import os
import cv2


# import some common detectron2 utilities
from detectron2 import model_zoo
from detectron2.config import get_cfg
from detectron2.utils.visualizer import Visualizer
from detectron2.data import MetadataCatalog
from detectron2.utils.visualizer import ColorMode
from detectron2.engine import DefaultPredictor
from detectron2.utils.logger import setup_logger

# --- Configuration for GCS ---
GCS_BUCKET_NAME = 'rooftop-segmentation'           
GCS_MODEL_BLOB_NAME = 'detectron2_model/model_final.pth' 
# ---

class DetectronModel:
    def __init__(self):
        """Load the Detectron2 model"""
        setup_logger()
        self.cfg = get_cfg()
        self.cfg.OUTPUT_DIR = "./model/output"
        self.cfg.MODEL.ROI_HEADS.NUM_CLASSES = 4 
        self.cfg.merge_from_file(model_zoo.get_config_file("COCO-InstanceSegmentation/mask_rcnn_R_101_FPN_3x.yaml"))  
        self.cfg.MODEL.WEIGHTS = os.path.join(self.cfg.OUTPUT_DIR, "model_final.pth") 
        self.cfg.MODEL.ROI_HEADS.SCORE_THRESH_TEST = 0.5  
        self.cfg.MODEL.DEVICE = "cpu"  

        self.predictor = DefaultPredictor(self.cfg)
        self.metadata = MetadataCatalog.get("dataset_train").set(
            thing_classes=["Building", "Shadow", "Tree", "Tree shadow"] 
        ) 

    def predict(self, image_path: str):
        """Perform object detection and return the processed image path"""
        im = cv2.imread(image_path)
        if im is None:
            raise ValueError("Failed to read image.")

        outputs = self.predictor(im)

        v = Visualizer(
            im[:, :, ::-1], 
            metadata=self.metadata, 
            scale=0.5, 
            instance_mode=ColorMode.IMAGE_BW
        )
        out = v.draw_instance_predictions(outputs["instances"].to("cpu"))

        # Save processed image
        result_path = os.path.join("results", os.path.basename(image_path))
        cv2.imwrite(result_path, out.get_image()[:, :, ::-1]) 
        return result_path
