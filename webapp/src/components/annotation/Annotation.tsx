import React from "react";
import {
  Annotorious,
  ImageAnnotationPopup,
  ImageAnnotator,
  useAnnotations,
} from "@annotorious/react";
import "@annotorious/react/annotorious-react.css";

const ImageAnnotation: React.FC = () => {
  // Get all annotations in real-time
  const annotations = useAnnotations();

  // Extract polygon coordinates
  const getCoordinates = (annotation: any) => {
    const selectorValue = annotation?.target?.selector?.value;
    if (selectorValue?.startsWith("polygon(")) {
      return selectorValue
        .replace("polygon(", "")
        .replace(")", "")
        .split(",")
        .map((point: any) => {
          const [x, y] = point.trim().split(" ");
          return { x: parseFloat(x), y: parseFloat(y) };
        });
    }
    return [];
  };

  return (
    <div>
      <h2>Image Annotation</h2>
      <ImageAnnotator containerClassName="annotation-layer" tool="polygon">
        <img
          src="https://images.pexels.com/photos/1187079/pexels-photo-1187079.jpeg"
          alt="Annotatable"
        />
      </ImageAnnotator>

      <ImageAnnotationPopup popup={(props) => <div>Hello World</div>} />

      <h3>Saved Annotations:</h3>
      <pre>{JSON.stringify(annotations, null, 2)}</pre>

      <h3>Extracted Coordinates:</h3>
      {annotations.map((annotation) => (
        <pre key={annotation.id}>
          {JSON.stringify(getCoordinates(annotation), null, 2)}
        </pre>
      ))}
    </div>
  );
};

export default ImageAnnotation;
