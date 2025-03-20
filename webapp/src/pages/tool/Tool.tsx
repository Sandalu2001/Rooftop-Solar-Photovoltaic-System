import {
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import Cover from "../../assets/images/roof.png";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import CustomIconButton from "../../components/common/CustomIconButton";
import {
  AnnotationState,
  ImageAnnotation,
  ImageAnnotationPopup,
  ImageAnnotator,
  useAnnotations,
  useAnnotator,
  useSelection,
} from "@annotorious/react";
import "@annotorious/react/annotorious-react.css";
import FactCard from "../../components/common/FactCard";
import ControlPanel from "../../components/common/ControlPanel";

enum ClassTypes {
  BUILDING = "building",
  BUILDINGSHADOW = "building-shadow",
  TREE = "tree",
  THREESHADOW = "tree-shadow",
}
const Tool = () => {
  const [selectedClass, setSelectedClass] = useState<ClassTypes>(
    ClassTypes.BUILDING
  );

  const annotations = useAnnotations();
  const anno = useAnnotator();
  const { selected } = useSelection(); // Get the selected annotation
  const [selectedId, setSelectedId] = useState<string | null>(null);

  //----------------- Styling the annotations ----------------- //
  useEffect(() => {
    if (anno && annotations.length > 0) {
      anno.setStyle((annotation, state) => {
        const classTag = annotation.bodies[0]?.value;

        console.log(classTag);
        let color: any = "#0000FF"; // Default to blue
        switch (classTag) {
          case ClassTypes.BUILDING:
            color = "#0000FF"; // Blue
            break;
          case ClassTypes.BUILDINGSHADOW:
            color = "#808080"; // Gray
            break;
          case ClassTypes.TREE:
            color = "#008000"; // Green
            break;
          case ClassTypes.THREESHADOW:
            color = "#A9A9A9"; // Dark Gray
            break;
        }

        const opacity = state?.selected ? 0.9 : 0.25;

        return {
          fill: color,
          fillOpacity: opacity,
          stroke: color,
          strokeOpacity: 1,
        };
      });
    }
  }, [annotations.length]);
  //------------------------------------------------------------------ //

  //----------------- Capture selecting an annotation ----------------- //
  useEffect(() => {
    if (selected.length > 0) {
      setSelectedId(selected[0].annotation.id);
    } else {
      setSelectedId(null);
    }
  }, [selected]);
  //------------------------------------------------------------------ //

  //------ Update the class of the selected annotation --------------- //
  useEffect(() => {
    console.log("gewek");
    if (
      annotations &&
      annotations.length > 0 &&
      annotations[annotations.length - 1].bodies.length === 0
    ) {
      const newAnnotation = {
        ...annotations[annotations.length - 1],
        bodies: [{ value: selectedClass, purpose: "tagging" }],
      };
      anno.updateAnnotation(newAnnotation);
    }
  }, [selectedClass, annotations.length]);

  //------ Delete the selected annotation --------------------------- //
  const handleDelete = () => {
    if (anno && selectedId) {
      console.log("Deleting annotation: " + selectedId);
      anno.removeAnnotation(selectedId);
      setSelectedId(null);
    }
  };
  //------------------------------------------------------------------ //

  // const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const target = event.target;

  //   if (target === null) {
  //     throw new Error("target can not be null");
  //   }
  //   setSelectedClass(e.target.value as ClassTypes)
  // };

  return (
    <Stack
      height={"100%"}
      gap={4}
      sx={{
        marginX: 8,
        pb: 8,
        paddingX: 12,
      }}
    >
      <Stack
        sx={{
          gap: 2,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 500 }}>
          Review Detected Shadows, Modify if Necessary
        </Typography>
      </Stack>

      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: "center",
          gap: 4,
        }}
      >
        <Stack
          flex={2}
          sx={{
            gap: 2,
          }}
        >
          <FactCard
            description="Talk to our experts and read their research and analysis reports"
            color="primary"
          />
          <FactCard
            description="Understand the costs and advantages of switching to renewable energy, Uncover what your peers are doing in the region"
            color="inherit"
          />
          <FactCard
            description="Get standardized views of data and insight across borders and
languages to more easily compare and strategize"
            color="inherit"
          />
        </Stack>

        <Stack flex={2} sx={{ gap: 2 }}>
          <div>
            <ImageAnnotator
              containerClassName="annotation-layer"
              tool="polygon"
            >
              <img
                src={Cover}
                alt="Annotatable"
                style={{
                  height: 533,
                  width: 800,
                  borderRadius: 20,
                }}
              />
            </ImageAnnotator>

            <ImageAnnotationPopup popup={(props) => <div>Hello World</div>} />
          </div>

          <Stack
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignContent={"center"}
            alignItems={"center"}
          >
            <FormControl sx={{ minWidth: 200 }} size="small">
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={selectedClass}
                size="small"
                label="class"
                onChange={(e) => setSelectedClass(e.target.value as ClassTypes)}
                sx={{
                  borderRadius: 5,
                  p: 0,
                  m: 0,
                  minHeight: 0,
                  "& legend": { display: "none" },
                  borderSize: 3,
                  "& .MuiInputLabel-root": {
                    display: "none",
                  },
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"building"}>Building</MenuItem>
                <MenuItem value={"building-shadow"}>Building Shadow</MenuItem>
                <MenuItem value={"tree"}>Tree</MenuItem>
                <MenuItem value={"tree-shadow"}>Tree Shadow</MenuItem>
              </Select>
            </FormControl>

            <Stack>
              <ControlPanel />
            </Stack>

            <Stack flexDirection={"row"} gap={2}>
              <CustomIconButton
                color="success"
                action={() => console.log("Done!")}
                icon={<DoneIcon fontSize="large" />}
              />
              <CustomIconButton
                color="error"
                action={() => handleDelete()}
                icon={<CloseIcon fontSize="large" />}
              />
            </Stack>
          </Stack>
          <h3>Saved Annotations:</h3>
          <pre>{JSON.stringify(annotations, null, 2)}</pre>

          <Typography>Selected Annotation </Typography>
          <pre>{JSON.stringify(selected, null, 2)}</pre>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Tool;
