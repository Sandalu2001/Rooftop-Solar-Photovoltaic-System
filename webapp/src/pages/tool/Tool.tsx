import {
  Box,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Cover from "../../assets/images/roof.png";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import CustomIconButton from "../../components/common/CustomIconButton";
import {
  Annotation,
  AnnotationState,
  Annotorious,
  createImageAnnotator,
  ImageAnnotation,
  ImageAnnotationPopup,
  ImageAnnotator,
  useAnnotations,
  useAnnotator,
  useSelection,
} from "@annotorious/react";
import "@annotorious/react/annotorious-react.css";

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
  const { selected } = useSelection();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    console.log(annotations);
    if (anno && annotations.length > 0) {
      anno.setStyle((annotation, state) => {
        // const classTag = annotation.body[0].value;
        // console.log(classTag);

        let color: any = "#0000FF"; // Default to blue
        // switch (classTag) {
        //   case ClassTypes.BUILDING:
        //     color = "#0000FF"; // Blue
        //     break;
        //   case ClassTypes.BUILDINGSHADOW:
        //     color = "#808080"; // Gray
        //     break;
        //   case ClassTypes.TREE:
        //     color = "#008000"; // Green
        //     break;
        //   case ClassTypes.THREESHADOW:
        //     color = "#A9A9A9"; // Dark Gray
        //     break;
        // }

        const opacity = state?.selected ? 0.9 : 0.25;

        return {
          fill: color,
          fillOpacity: opacity,
          stroke: color,
          strokeOpacity: 1,
        };
      });
    }
  }, [annotations]);

  useEffect(() => {
    if (selected.length > 0) {
      setSelectedId(selected[0].annotation.id);
    } else {
      setSelectedId(null);
    }
  }, [selected]);

  useEffect(() => {
    if (anno && annotations && annotations.length > 0) {
      const newAnnotation = {
        ...annotations[annotations.length - 1],
        body: [{ value: selectedClass }],
      };
      console.log("gfgfg");

      anno.updateAnnotation(newAnnotation);
    }
  }, [annotations, anno]);

  const handleDelete = () => {
    if (anno && selectedId) {
      console.log("Deleting annotation: " + selectedId);
      anno.removeAnnotation(selectedId);
      setSelectedId(null);
    }
  };

  return (
    <Stack
      height={"100%"}
      sx={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        marginX: 8,
        pb: 8,
        gap: 10,
        paddingX: 12,
      }}
    >
      <Stack sx={{ gap: 2 }}>
        <Typography variant="h2"> For the Annotation</Typography>
        <Typography variant="h5">
          Basically, on a table row hover, I want to make it set a background
          color different from what it is currently doing.
        </Typography>
      </Stack>

      <Stack sx={{ gap: 2 }}>
        <div>
          <ImageAnnotator containerClassName="annotation-layer" tool="polygon">
            <img
              src={Cover}
              alt="Annotatable"
              style={{
                width: "100%",
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
          <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
            <InputLabel id="demo-select-small-label">Class</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={selectedClass}
              size="medium"
              label="class"
              onChange={(e) => setSelectedClass(e.target.value as ClassTypes)}
              sx={{
                borderRadius: 5,
                "& legend": { display: "none" },
                "& .MuiInputLabel-root": {
                  display: "none",
                },
                borderSize: 3,
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"building"}>Building</MenuItem>
              <MenuItem value={"building-shadow"}>Building Shadow </MenuItem>
              <MenuItem value={"tree"}>Tree</MenuItem>
              <MenuItem value={"tree-shadow"}>Tree Shadow</MenuItem>
            </Select>
          </FormControl>

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
        {/* <pre>{JSON.stringify(annotations, null, 2)}</pre> */}

        <Typography>Selected Annotation </Typography>
        <pre>{JSON.stringify(selected, null, 2)}</pre>
      </Stack>
    </Stack>
  );
};

export default Tool;
