import dayjs from "dayjs";
import { REQUIRED, TYPERROR } from "../configs/constants";
import * as yup from "yup";
import {
  AnnotoriousAnnotation,
  CocoDataInterface,
} from "../types/componentInterfaces";
import { ClassTypes } from "../types/enums";
import * as THREE from "three";

// -------------------------- Annotorious to COCO -------------------------- //
export function convertAnnotoriousToCOCO(
  annotations: AnnotoriousAnnotation[],
  imageMetadata: CocoDataInterface["coco_output"]["images"][0]
): CocoDataInterface {
  const defaultCategories: CocoDataInterface["coco_output"]["categories"] = [
    { id: 1, name: ClassTypes.BUILDING },
    { id: 2, name: ClassTypes.BUILDINGSHADOW },
    { id: 3, name: ClassTypes.TREE },
    { id: 4, name: ClassTypes.THREESHADOW },
  ];

  // Convert annotations
  const convertedAnnotations = annotations.map((annotoriousAnn, index) => {
    const { points, bounds } = annotoriousAnn.target.selector.geometry;

    // Flatten points for segmentation
    const segmentation = [points.flat()];

    // Calculate bbox
    const bbox = [
      bounds.minX,
      bounds.minY,
      bounds.maxX - bounds.minX,
      bounds.maxY - bounds.minY,
    ];

    // Calculate area
    const area = Math.abs(
      points.reduce((acc, current, i, arr) => {
        const next = arr[(i + 1) % arr.length];
        return acc + (current[0] * next[1] - next[0] * current[1]);
      }, 0) / 2
    );

    // Find category ID
    const categoryName = annotoriousAnn.bodies[0]?.value || "Unknown";
    const category = defaultCategories.find(
      (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    const isBuildingSelected =
      annotoriousAnn.bodies[1]?.value.toString() || "false";

    return {
      id: index + 1, // Generate sequential ID
      image_id: imageMetadata.id,
      category_id: category ? category.id : 0, // Default to 0 if category not found
      segmentation: segmentation,
      bbox: bbox,
      area: area,
      iscrowd: 0,
      score: 1.0,
      selectedBuilding: isBuildingSelected,
    };
  });

  // Construct full COCO data interface
  return {
    coco_output: {
      images: [imageMetadata],
      annotations: convertedAnnotations,
      categories: defaultCategories,
    },
  };
}
// -------------------------- Annotorious to COCO -------------------------- //

// -------------------------- COCO to Annotorious -------------------------- //
export const convertCOCOToAnnotorious = (cocoData: CocoDataInterface) => {
  return cocoData.coco_output.annotations
    .map((ann) => {
      if (!ann.segmentation || ann.segmentation.length === 0) return null;

      // Extract polygon points, handling multiple segmentations
      const points: [number, number][][] = ann.segmentation.map((segment) =>
        segment.reduce<[number, number][]>((acc, val, index, arr) => {
          if (index % 2 === 0 && arr[index + 1] !== undefined) {
            acc.push([val, arr[index + 1]]);
          }
          return acc;
        }, [])
      );

      // Flatten points array (if there's only one polygon)
      const flatPoints = points.length === 1 ? points[0] : points.flat();

      // Calculate bounds
      const xValues = flatPoints.map(([x]) => x);
      const yValues = flatPoints.map(([, y]) => y);
      const bounds = {
        minX: Math.min(...xValues),
        minY: Math.min(...yValues),
        maxX: Math.max(...xValues),
        maxY: Math.max(...yValues),
      };

      return {
        id: `ann-${ann.id}`,
        bodies: [
          {
            purpose: "tagging",
            value:
              cocoData.coco_output.categories.find(
                (cat) => cat.id === ann.category_id
              )?.name || "Unknown",
          },
        ],
        target: {
          selector: {
            type: "POLYGON",
            geometry: {
              bounds,
              points: flatPoints,
            },
          },
        },
      };
    })
    .filter(Boolean);
};
// -------------------------- COCO to Annotorious -------------------------- //

export const uploadImageSchema = yup.object({
  latitude: yup.number().required(REQUIRED).typeError(TYPERROR),
  longtitude: yup.number().required(REQUIRED).typeError(TYPERROR),
  date: yup.date().required(REQUIRED),
  file: yup.mixed().required(REQUIRED),
  // .test("fileSize", "File size is too large (Max: 20MB)", (value) => {
  //   return value && value.size <= 20 * 1024 * 1024; // 2MB limit
  // })
  // .test("fileType", "Only image files are allowed", (value) => {
  //   return (
  //     value && ["image/png", "image/jpeg", "image/jpg"].includes(value.type)
  //   );
  // }),
});

//-------- Calculate Centroid Function -----------//
export const calculateCentroid = (points: number[][]) => {
  let area = 0;
  let centroidX = 0;
  let centroidY = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % n]; // Next point, wrap around

    const term = p1[0] * p2[1] - p2[0] * p1[1];
    area += term;
    centroidX += (p1[0] + p2[0]) * term;
    centroidY += (p1[1] + p2[1]) * term;
  }

  area = 0.5 * area;
  centroidX = centroidX / (6 * area);
  centroidY = centroidY / (6 * area);

  return { x: centroidX, y: centroidY };
};

//---------------------------------------------//

export function getGradientColor(
  directLightIntensity: number,
  isShadowed: boolean
) {
  const color = new THREE.Color();

  if (directLightIntensity == 1) {
    // Radiant Blue to Black for Shadowed Areas (shadowIntensity now 0 to 1, 1=full shadow)
    color.lerpColors(
      new THREE.Color("blue"), // Radiant blue (base shadowed color)
      new THREE.Color("blue"), // Fade to black for deeper shadow
      1 // intensity is now just a boolean isShadowed, so always full shadow color if shadowed
    );
  } else if (directLightIntensity == 0) {
    // Adjusted range
    // Red to Yellow for high direct light
    color.lerpColors(
      new THREE.Color("red"),
      new THREE.Color("red"),
      directLightIntensity // Normalize intensity to 0-1 in this range
    );
  } else if (directLightIntensity < 0.5) {
    // Adjusted range
    // Red to Yellow for higher direct light
    color.lerpColors(
      new THREE.Color("yellow"),
      new THREE.Color("yellow"),
      directLightIntensity // Normalize intensity to 0-1 in this range
    );
  } else {
    // Yellow to Green for lower direct light
    color.lerpColors(
      new THREE.Color("green"),
      new THREE.Color("green"),
      directLightIntensity // Normalize intensity to 0-1 in this range
    );
  }
  return color;
}
