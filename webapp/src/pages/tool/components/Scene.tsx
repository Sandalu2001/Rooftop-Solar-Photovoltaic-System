import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import Lights from "./Lights";
import * as THREE from "three";
import { object } from "yup";

// Green - Y
// Blue - Z
// Red - X

const SCALE_FACTOR = 500; // Shrinking factor

const Object = ({
  segmentation,
  height,
  categoryId,
}: {
  segmentation: number[][];
  height: number;
  categoryId: number;
}) => {
  const shape = useMemo(() => {
    const newShape = new THREE.Shape();
    if (Array.isArray(segmentation) && segmentation.length > 0) {
      const points = segmentation[0];
      if (points.length >= 2) {
        newShape.moveTo(points[0] / SCALE_FACTOR, points[1] / SCALE_FACTOR);
        for (let i = 2; i < points.length; i += 2) {
          newShape.lineTo(
            points[i] / SCALE_FACTOR,
            points[i + 1] / SCALE_FACTOR
          );
        }
        newShape.closePath(); // Close the shape
      }
    }
    return newShape;
  }, [segmentation]);

  // Extrude the shape into 3D
  const extrudeSettings = {
    depth:
      categoryId === 1 ? height / SCALE_FACTOR : (height * 0.4) / SCALE_FACTOR,
    bevelEnabled: false,
    steps: 2,
  };
  const basedGeometry = useMemo(
    () => new THREE.ExtrudeGeometry(shape, extrudeSettings),
    [shape]
  );

  // Create the top face geometry
  const topGeometry = useMemo(() => new THREE.ShapeGeometry(shape), [shape]);

  //----------Tree Canopy--------//
  const extrudeTreeTopSettings = {
    depth: (height * 0.6) / SCALE_FACTOR,
    bevelEnabled: false,
    steps: 2,
  };

  const topTreeGeometry = useMemo(
    () => new THREE.ExtrudeGeometry(shape, extrudeTreeTopSettings),
    [shape]
  );
  //----------------------------//

  //-------- Tree Trunk Cylinder -----------//
  const trunkHeight = (height * 0.4) / SCALE_FACTOR; // Trunk takes up 40% of height
  const trunkGeometry = useMemo(
    () => new THREE.ExtrudeGeometry(shape, extrudeSettings),
    [shape]
  );
  //--------------------------------------//

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[2.2, 0, 1.6]}>
      {categoryId === 3 ? (
        <>
          <>
            {/* Trunk */}
            <mesh
              geometry={trunkGeometry}
              castShadow
              receiveShadow
              scale={[-1, 1, 1]}
            >
              <meshStandardMaterial color={"brown"} side={THREE.DoubleSide} />
            </mesh>

            {/* Canopy */}
            <mesh
              geometry={topTreeGeometry}
              position={[0, 0, (height * 0.4) / SCALE_FACTOR]}
              castShadow
              receiveShadow
              scale={[-1, 1, 1]}
            >
              <meshStandardMaterial color={"lime"} side={THREE.DoubleSide} />
            </mesh>

            {/* Top Face Of the Canopy */}
            <mesh
              geometry={topGeometry}
              position={[0, 0, height / SCALE_FACTOR]}
              castShadow
              receiveShadow
              scale={[-1, 1, 1]}
            >
              <meshStandardMaterial color={"lime"} side={THREE.DoubleSide} />
            </mesh>
          </>
        </>
      ) : (
        <>
          <mesh
            geometry={basedGeometry}
            castShadow
            receiveShadow
            scale={[-1, 1, 1]} // Invert the mesh to face the camera
          >
            <meshStandardMaterial
              color={categoryId === 1 ? "yellow" : "lime"}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Top face positioned at the object's top */}
          <mesh
            geometry={topGeometry}
            position={[0, 0, height / SCALE_FACTOR]}
            castShadow
            receiveShadow
            scale={[-1, 1, 1]}
          >
            <meshStandardMaterial
              color={categoryId === 1 ? "yellow" : "lime"}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}
    </group>
  );
};

function Floor() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
      <circleGeometry args={[4]} />
      <meshStandardMaterial color="#fff" />
    </mesh>
  );
}

const Scene = ({ annotations }: { annotations: any[] }) => {
  return (
    <group position={[0, 0, 0]}>
      {annotations.map((item) => {
        if (item.category_id === 1 || item.category_id === 3) {
          return (
            <Object
              key={item.id}
              segmentation={item.segmentation}
              height={item.object_height}
              categoryId={item.category_id}
            />
          );
        }
        return null;
      })}
    </group>
  );
};

const Visualizer1 = () => {
  const annotations = [
    {
      area: 51840.0,
      bbox: [
        497.5185852050781, 900.8060302734375, 272.5939636230469, 274.8046875,
      ],
      category_id: 1,
      id: 1,
      image_id: 1,
      iscrowd: 0,
      object_height: 172.12204972053985,
      pair_id: 1,
      score: 0.9878525733947754,
      segmentation: [
        [
          716, 910, 696, 905, 663, 904, 601, 912, 588, 918, 560, 921, 526, 932,
          509, 942, 501, 952, 500, 996, 511, 1035, 526, 1043, 556, 1039, 579,
          1040, 586, 1051, 587, 1141, 596, 1164, 602, 1169, 650, 1171, 714,
          1163, 745, 1155, 755, 1141, 760, 1094, 756, 1022, 737, 935, 728, 919,
        ],
      ],
    },
    {
      area: 52125.0,
      bbox: [
        427.29034423828125, 305.7288818359375, 259.8548583984375,
        243.24652099609375,
      ],
      category_id: 1,
      id: 3,
      image_id: 1,
      iscrowd: 0,
      object_height: 311.00643080167964,
      pair_id: 2,
      score: 0.9786121845245361,
      segmentation: [
        [
          667, 319, 654, 309, 644, 307, 563, 308, 521, 315, 498, 322, 460, 326,
          448, 331, 439, 339, 432, 350, 435, 495, 439, 509, 445, 517, 460, 526,
          479, 526, 513, 521, 535, 513, 546, 513, 564, 527, 569, 537, 583, 543,
          655, 542, 665, 539, 674, 526, 681, 479, 671, 334,
        ],
      ],
    },

    {
      area: 47791.0,
      bbox: [
        1320.370849609375, 209.4273681640625, 264.89208984375, 238.571044921875,
      ],
      category_id: 1,
      id: 5,
      image_id: 1,
      iscrowd: 0,
      object_height: 327.67056627045395,
      pair_id: 3,
      score: 0.9749723076820374,
      segmentation: [
        [
          1573, 224, 1563, 217, 1552, 214, 1513, 210, 1436, 210, 1419, 217,
          1410, 227, 1365, 246, 1352, 259, 1343, 263, 1335, 277, 1325, 283,
          1323, 386, 1326, 415, 1333, 437, 1342, 442, 1357, 443, 1440, 428,
          1466, 420, 1493, 403, 1533, 395, 1542, 389, 1554, 375, 1558, 340,
          1571, 324, 1577, 308, 1578, 243,
        ],
      ],
    },
    {
      area: 44675.0,
      bbox: [
        484.5195007324219, 606.8073120117188, 242.02236938476562,
        255.096923828125,
      ],
      category_id: 1,
      id: 8,
      image_id: 1,
      iscrowd: 0,
      object_height: 240.98340191805738,
      pair_id: 4,
      score: 0.9359306693077087,
      segmentation: [
        [
          490, 648, 486, 656, 487, 714, 496, 726, 506, 733, 522, 738, 528, 745,
          530, 791, 535, 810, 548, 819, 585, 816, 594, 825, 605, 848, 617, 855,
          699, 851, 714, 841, 718, 830, 716, 728, 698, 629, 690, 620, 679, 614,
          661, 610, 616, 610, 583, 616, 564, 624, 517, 635,
        ],
      ],
    },
    {
      area: 19447.0,
      bbox: [
        2170.844970703125, 100.56394958496094, 109.0771484375,
        216.9449005126953,
      ],
      category_id: 1,
      id: 21,
      image_id: 1,
      iscrowd: 0,
      object_height: 264.7640458974745,
      pair_id: 5,
      score: 0.6705812215805054,
      segmentation: [
        [
          2279, 102, 2226, 102, 2205, 108, 2179, 121, 2175, 146, 2192, 247,
          2193, 283, 2196, 299, 2205, 310, 2255, 312, 2279, 306,
        ],
      ],
    },
    {
      area: 86548.0,
      bbox: [
        1812.623779296875, 757.8076782226562, 358.37744140625,
        371.70062255859375,
      ],
      category_id: 3,
      id: 9,
      image_id: 1,
      iscrowd: 0,
      object_height: 345.11012735067624,
      pair_id: 1000,
      score: 0.9208218455314636,
      segmentation: [
        [
          2022, 764, 1992, 764, 1972, 771, 1961, 780, 1945, 784, 1933, 792,
          1921, 794, 1910, 806, 1890, 812, 1870, 824, 1859, 835, 1845, 841,
          1826, 876, 1829, 910, 1834, 917, 1838, 938, 1853, 975, 1854, 1019,
          1861, 1044, 1878, 1069, 1917, 1113, 1928, 1122, 1937, 1125, 2000,
          1126, 2017, 1124, 2036, 1117, 2064, 1093, 2123, 1070, 2143, 1051,
          2167, 1016, 2169, 984, 2164, 961, 2151, 947, 2136, 941, 2112, 923,
          2098, 899, 2090, 869, 2088, 843, 2076, 816, 2035, 771,
        ],
      ],
    },
    {
      area: 112429.0,
      bbox: [
        1192.777099609375, 925.5806274414062, 504.889404296875,
        335.12493896484375,
      ],
      category_id: 3,
      id: 13,
      image_id: 1,
      iscrowd: 0,
      object_height: 528.4590807243262,
      pair_id: 1001,
      score: 0.8799708485603333,
      segmentation: [
        [
          1657, 1004, 1635, 986, 1620, 980, 1561, 976, 1526, 968, 1518, 959,
          1495, 950, 1472, 946, 1418, 948, 1380, 962, 1362, 972, 1294, 974,
          1271, 978, 1258, 990, 1234, 1003, 1226, 1017, 1211, 1027, 1203, 1038,
          1199, 1063, 1201, 1086, 1208, 1111, 1232, 1158, 1245, 1169, 1252,
          1181, 1271, 1196, 1320, 1217, 1344, 1236, 1364, 1244, 1466, 1251,
          1510, 1247, 1543, 1231, 1581, 1192, 1633, 1164, 1650, 1158, 1673,
          1134, 1689, 1097, 1691, 1064, 1674, 1028, 1664, 1018,
        ],
      ],
    },
    {
      area: 26218.0,
      bbox: [
        1165.8106689453125, 479.3341369628906, 220.53076171875,
        185.95773315429688,
      ],
      category_id: 3,
      id: 15,
      image_id: 1,
      iscrowd: 0,
      object_height: 171.86331778480243,
      pair_id: 1002,
      score: 0.8062847852706909,
      segmentation: [
        [
          1363, 496, 1346, 482, 1327, 482, 1303, 505, 1295, 508, 1288, 517,
          1280, 519, 1270, 529, 1253, 536, 1252, 542, 1243, 549, 1240, 556,
          1214, 561, 1173, 579, 1168, 587, 1167, 628, 1174, 649, 1185, 654,
          1209, 646, 1225, 645, 1232, 651, 1258, 660, 1310, 663, 1336, 662,
          1349, 656, 1356, 648, 1362, 628, 1377, 609, 1382, 595, 1382, 568,
          1366, 536, 1369, 508,
        ],
      ],
    },
    {
      area: 137699.0,
      bbox: [
        2.3377685546875, 993.3616333007812, 562.8723754882812,
        398.27349853515625,
      ],
      category_id: 3,
      id: 18,
      image_id: 1,
      iscrowd: 0,
      object_height: 504.75835802886905,
      pair_id: 1003,
      score: 0.6898996233940125,
      segmentation: [
        [
          555, 1155, 539, 1113, 530, 1099, 527, 1086, 507, 1055, 492, 1045, 473,
          1025, 450, 1019, 415, 1020, 351, 1044, 289, 1054, 224, 1072, 174,
          1081, 152, 1094, 92, 1114, 72, 1129, 49, 1139, 42, 1145, 26, 1170, 24,
          1185, 9, 1223, 7, 1271, 20, 1301, 40, 1326, 93, 1365, 131, 1374, 245,
          1376, 276, 1373, 327, 1359, 357, 1344, 379, 1328, 404, 1299, 413,
          1280, 437, 1255, 468, 1247, 501, 1244, 533, 1228, 546, 1215, 555,
          1194,
        ],
      ],
    },
  ];

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Suspense fallback={<div>Loading...</div>}>
        <Canvas
          camera={{
            position: [0, 4, 4], // Zoomed out a bit more
            fov: 60,
            near: 2,
            far: 10000,
          }}
          shadows
        >
          <Lights />
          <Floor />
          <Scene annotations={annotations} />
          <OrbitControls target={[0, 0, 0]} />
          THREE.
          <axesHelper args={[2]} />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default Visualizer1;
