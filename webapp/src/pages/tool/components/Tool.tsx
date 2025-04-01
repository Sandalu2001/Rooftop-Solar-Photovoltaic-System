import {
  alpha,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Popover,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  ImageAnnotationPopup,
  ImageAnnotator,
  useAnnotations,
  useAnnotator,
  useSelection,
} from "@annotorious/react";
import "@annotorious/react/annotorious-react.css";
import FactCard from "../../../components/common/FactCard";
import ControlPanel from "../../../components/common/ControlPanel";
import {
  AnnotoriousAnnotation,
  StepperInterface,
} from "../../../types/componentInterfaces";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  convertAnnotoriousToCOCO,
  convertCOCOToAnnotorious,
} from "../../../utils/utils";
import { useAppDispatch, useAppSelector } from "../../../slices/store";
import { ClassTypes } from "../../../types/enums";
import CustomIconButton from "../../../components/common/CustomIconButton";
import { getPairs } from "../../../slices/solar-slice";

const Tool = ({ setActiveStep }: StepperInterface) => {
  const [selectedClass, setSelectedClass] = useState<ClassTypes>(
    ClassTypes.BUILDING
  );

  const image = useAppSelector((state) => state.solar.image);
  const cocoAnnotations = useAppSelector((state) => state.solar.cocoJSON);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const annotations = useAnnotations();
  const anno = useAnnotator();
  const { selected } = useSelection();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isEffectRun = useRef(false);
  const [convertedAnnotations, setConvertedAnnotations] = useState<any>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [pairKey, setPairKey] = useState<string>("");

  console.log("cocoAnnotations", annotations);

  // Capture selecting an annotation
  useEffect(() => {
    if (selected.length > 0) {
      const selectedAnnotation = selected[0].annotation;
      setSelectedId(selectedAnnotation.id);

      // Extract the category from the annotation bodies
      const categoryBody = selectedAnnotation.bodies.find(
        (body: any) => body.purpose === "tagging"
      );
      setSelectedCategory(categoryBody?.value ?? null);
      // Check if there is a pairKey stored in the annotation
      const pairKeyBody = selectedAnnotation.bodies.find(
        (body: any) => body.purpose === "pairKey"
      );
      setPairKey(pairKeyBody?.value ?? "");
    } else {
      setSelectedId(null);
      setSelectedCategory(null);
      setPairKey("");
    }
  }, [selected]);

  const handlePairKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPairKey(e.target.value);
  };

  // Function to update annotation with the new pairKey
  const updatePairKey = () => {
    if (anno && selectedId) {
      const annotation = annotations.find((a) => a.id === selectedId);
      if (annotation) {
        const updatedAnnotation = {
          ...annotation,
          bodies: [
            ...annotation.bodies.filter((b) => b.purpose !== "pairKey"), // Remove old pairKey
            { purpose: "pairKey", value: pairKey }, // Add new pairKey
          ],
        };
        anno.updateAnnotation(updatedAnnotation);
      }
    }
  };

  // Convert COCO annotations to Annotorious format
  useEffect(() => {
    if (cocoAnnotations?.coco_output) {
      const newAnnotations = convertCOCOToAnnotorious(cocoAnnotations);
      setConvertedAnnotations(newAnnotations);
    } else {
      console.warn(
        "Invalid or missing coco_output in cocoAnnotations:",
        cocoAnnotations
      );
    }
  }, [cocoAnnotations]);

  // Add converted annotations to Annot
  useEffect(() => {
    if (!anno || isEffectRun.current) return;
    isEffectRun.current = true;

    if (convertedAnnotations) {
      convertedAnnotations.forEach((annotation: any) => {
        if (annotation !== null) {
          anno.addAnnotation(annotation);
        }
      });
    }
  }, [anno, convertedAnnotations]);

  // Load image into the annotator
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
        let color: any = "#FFFFFF"; // Default to white
        switch (classTag) {
          case ClassTypes.BUILDING:
            color = "#F7374F"; // Red
            break;
          case ClassTypes.BUILDINGSHADOW:
            color = "#261FB3"; // Blue
            break;
          case ClassTypes.TREE:
            color = "#D3E671"; // Green
            break;
          case ClassTypes.THREESHADOW:
            color = "#FF2DF1"; // Yellow
            break;
        }

        const opacity = state?.selected ? 0.9 : 0.5;

        return {
          fill: color,
          fillOpacity: opacity,
          stroke: color,
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

  return (
    <Stack
      height={"100%"}
      sx={{
        alignContent: "center",
        paddingY: 8,
        gap: 2,
        flexDirection: "row",
      }}
    >
      <Stack
        flex={1}
        sx={{
          gap: 2,
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
      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: "center",
          alignItems: "center",
          gap: 2,
          flex: 3,
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

            <ImageAnnotationPopup
              popup={(props) => (
                <Stack
                  spacing={2}
                  sx={{
                    background: (theme) => theme.palette.common.white,
                    p: 2,
                    borderRadius: 3,
                    boxShadow: 2,
                  }}
                >
                  <Typography>Category: {selectedCategory}</Typography>

                  <TextField
                    label="Pair Key"
                    variant="outlined"
                    size="small"
                    value={pairKey}
                    onChange={handlePairKeyChange}
                  />
                  <Button variant="contained" onClick={updatePairKey}>
                    Update Pair Key
                  </Button>
                </Stack>
              )}
            />
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
                <MenuItem value={ClassTypes.BUILDING}>Building</MenuItem>
                <MenuItem value={ClassTypes.BUILDINGSHADOW}>
                  Building Shadow
                </MenuItem>
                <MenuItem value={ClassTypes.TREE}>Tree</MenuItem>
                <MenuItem value={ClassTypes.THREESHADOW}>Tree Shadow</MenuItem>
              </Select>
            </FormControl>

            <IconButton
              sx={{
                color: "white",
                background: (theme) => alpha(theme.palette.common.black, 0.8),
                "&:hover": {
                  background: (theme) => alpha(theme.palette.common.black, 1),
                },
              }}
              onClick={handleDelete}
            >
              <DeleteIcon fontSize="large" />
            </IconButton>

            <Stack flexDirection={"row"}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() =>
                  dispatch(
                    getPairs(
                      convertAnnotoriousToCOCO(
                        annotations as any,
                        cocoAnnotations.coco_output.images[0]
                      )
                    )
                  )
                }
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

          {/* <Typography>Selected Annotation </Typography>
          <pre>{JSON.stringify(selected, null, 2)}</pre> */}
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
