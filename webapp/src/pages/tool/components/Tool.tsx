import {
  alpha,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Popover,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import Cover from "../../../assets/images/rooftop-exsample.jpg";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import CustomIconButton from "../../../components/common/CustomIconButton";
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
import FactCard from "../../../components/common/FactCard";
import ControlPanel from "../../../components/common/ControlPanel";
import { StepperInterface } from "../../../types/componentInterfaces";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { convertCOCOToAnnotorious } from "../../../utils/utils";
import {
  AnnotoriousAnnotation,
  annotoriousAnnotation,
  convertAnnotoriousToCOCO,
  imageMetadata,
} from "../../../utils/utils2";
import { useAppSelector } from "../../../slices/store";

enum ClassTypes {
  BUILDING = "building",
  BUILDINGSHADOW = "building-shadow",
  TREE = "tree",
  THREESHADOW = "tree-shadow",
}
const Tool = ({ setActiveStep }: StepperInterface) => {
  const [selectedClass, setSelectedClass] = useState<ClassTypes>(
    ClassTypes.BUILDING
  );

  const image = useAppSelector((state) => state.solar.image);
  const cocoAnnotations = useAppSelector((state) => state.solar.cocoJSON);
  const [imageURL, setImageURL] = useState<string | null>(null);

  const annotations = useAnnotations();
  const anno = useAnnotator();
  const { selected } = useSelection();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isEffectRun = useRef(false);
  const [convertedAnnotations, setConvertedAnnotations] = useState<any>();

  useEffect(() => {
    console.log("Redux cocoAnnotations:", cocoAnnotations);

    if (cocoAnnotations?.coco_output) {
      const newAnnotations = convertCOCOToAnnotorious(cocoAnnotations);
      console.log("Converted Annotations:", newAnnotations);
      setConvertedAnnotations(newAnnotations);
    } else {
      console.warn(
        "Invalid or missing coco_output in cocoAnnotations:",
        cocoAnnotations
      );
    }
  }, [cocoAnnotations]);

  useEffect(() => {
    if (!anno || isEffectRun.current) return;
    isEffectRun.current = true;

    console.log("Hello ");
    console.log("convertedAnnotations in useEffect:", convertedAnnotations); // Debugging

    if (convertedAnnotations) {
      convertedAnnotations.forEach((annotation: any) => {
        if (annotation !== null) {
          anno.addAnnotation(annotation);
        }
      });
    }
  }, [anno, convertedAnnotations]);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageURL(e.target?.result as string);
      };
      reader.readAsDataURL(image);
    } else {
      setImageURL(null);
    }
  }, [image]);

  //-------for the Fast cards ----------------- //
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

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
      sx={{
        alignContent: "center",
        paddingY: 8,
        gap: 2,
      }}
    >
      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: "center",
          alignItems: "center",
          gap: 2,
          position: "relative",
        }}
      >
        <Stack
          sx={{
            flex: 1.2,
            borderRadius: 5,
            background: "none",
            display: "flex",
            gap: 4,
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>
            <ImageAnnotator
              containerClassName="annotation-layer"
              tool="polygon"
            >
              {imageURL ? (
                <img
                  src={imageURL}
                  alt="Annotatable"
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: 20,
                  }}
                />
              ) : (
                <Typography>No Image Found</Typography>
              )}
            </ImageAnnotator>

            <ImageAnnotationPopup popup={(props) => <div>Hello World</div>} />
          </div>

          <Stack
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignContent={"center"}
            alignItems={"center"}
            sx={{ pt: 0, width: "100%" }}
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

            <Stack flexDirection={"row"}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => setActiveStep(1)}
                sx={{
                  display: "flex",
                  alignSelf: "end",
                  borderRadius: 2,
                  boxShadow: "none",
                  "&:hover .MuiSvgIcon-root": {
                    position: "relative",
                    animation: "moveIcon 0.4s infinite alternate ease-in-out",
                  },
                  "@keyframes moveIcon": {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(8px)" },
                  },
                }}
                endIcon={<ArrowForwardIcon />}
              >
                Get the insights
              </Button>
            </Stack>
          </Stack>

          <Typography>Selected Annotation </Typography>
          <pre>{JSON.stringify(selected, null, 2)}</pre>
        </Stack>

        <Popover
          id="mouse-over-popover"
          sx={{ pointerEvents: "none" }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          onClose={handlePopoverClose}
        >
          <Stack
            flex={1}
            sx={{
              gap: 2,
              maxWidth: 400,
              p: 2,
              borderRadius: 5,
            }}
          >
            <FactCard
              description="Understand the costs and advantages of switching to renewable energy, Uncover what your peers are doing in the region"
              color="inherit"
            />
            <FactCard
              description="Get standardized views of data and insight across borders and
languages to more easily compare and strategize"
              color="inherit"
            />
            <FactCard
              description="Talk to our experts and read their research and analysis reports"
              color="primary"
            />
            <FactCard
              description="Understand the costs and advantages of switching to renewable energy, Uncover what your peers are doing in the region"
              color="inherit"
            />
          </Stack>
        </Popover>

        <IconButton
          size="large"
          color="inherit"
          sx={{
            position: "absolute",
            top: 20,
            left: 20,
            color: "white",
            background: (theme) => alpha(theme.palette.common.black, 0.8),
            "&:hover": {
              background: (theme) => alpha(theme.palette.common.black, 0.05),
            },
          }}
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          <MoreVertIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default Tool;
