export const convertCOCOToAnnotorious = (cocoData: CocoDataInterface) => {
  return cocoData.annotations.map((ann) => {
    // Extract polygon points with explicit typing
    const points: [number, number][] = ann.segmentation[0].reduce<
      [number, number][]
    >((acc, val, index, arr) => {
      if (index % 2 === 0 && arr[index + 1] !== undefined) {
        acc.push([val, arr[index + 1]]);
      }
      return acc;
    }, []);

    // Calculate bounds
    const xValues = points.map(([x]) => x);
    const yValues = points.map(([, y]) => y);
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
            cocoData.categories.find((cat) => cat.id === ann.category_id)
              ?.name || "Unknown",
        },
      ],
      target: {
        selector: {
          type: "POLYGON",
          geometry: {
            bounds,
            points,
          },
        },
      },
    };
  });
};

interface CocoDataInterface {
  images: {
    id: number;
    file_name: string;
    height: number;
    width: number;
  }[];
  annotations: {
    id: number;
    image_id: number;
    category_id: number;
    segmentation: number[][];
    bbox: number[];
    area: number;
    iscrowd: number;
    score: number;
  }[];
  categories: {
    id: number;
    name: string;
  }[];
}
