import {
  alpha,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
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
import { StepperInterface } from "../../../types/componentInterfaces";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  convertAnnotoriousToCOCO,
  convertCOCOToAnnotorious,
} from "../../../utils/utils";
import { useAppDispatch, useAppSelector } from "../../../slices/store";
import { ClassTypes } from "../../../types/enums";
import { get3DObjectJSON } from "../../../slices/solar-slice";
import { State } from "../../../types/common.type";
import { LoadingButton } from "@mui/lab";

const Tool = ({ setActiveStep }: StepperInterface) => {
  const [selectedClass, setSelectedClass] = useState<ClassTypes>(
    ClassTypes.BUILDING
  );

  const [chosenBuildingId, setChosenBuildingId] = useState<string | null>(null);
  const modelState = useAppSelector((state) => state.solar.modelState);
  const image = useAppSelector((state) => state.solar.image);
  const cocoAnnotations = useAppSelector((state) => state.solar.cocoJSON);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const annotations = useAnnotations();
  const anno = useAnnotator();
  const { selected } = useSelection();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isEffectRun = useRef(false);
  const [convertedAnnotations, setConvertedAnnotations] = useState<
    ({
      id: string;
      bodies: {
        purpose: string;
        value: string;
      }[];
      target: {
        selector: {
          type: string;
          geometry: {
            bounds: {
              minX: number;
              minY: number;
              maxX: number;
              maxY: number;
            };
            points: [...any][];
          };
        };
      };
    } | null)[]
  >();

  useEffect(() => {
    modelState === State.SUCCESS ? setActiveStep(2) : console.log();
  }, [modelState]);

  // Add converted annotations to Annotorious & Find initial chosen building
  useEffect(() => {
    if (
      !anno ||
      isEffectRun.current ||
      !convertedAnnotations ||
      convertedAnnotations.length === 0
    )
      return;

    if (
      anno.getAnnotations().length > 0 &&
      anno.getAnnotations().length >= convertedAnnotations.length
    ) {
      console.log("Annotations appear to be loaded already.");
      // Find initial chosen building even if already loaded
      const initiallyChosen = convertedAnnotations.find((a) =>
        a?.bodies?.some(
          (b: any) => b.purpose === "selectedBuilding" && b.value === true
        )
      );
      if (initiallyChosen && !chosenBuildingId) {
        console.log(
          "Found initially chosen building on load:",
          initiallyChosen.id
        );
        setChosenBuildingId(initiallyChosen.id);
      }
      isEffectRun.current = true; // Mark as run
      return;
    }

    // Mark as run *before* adding potentially async operations
    isEffectRun.current = true;
    let foundChosenId: string | null = null;

    convertedAnnotations.forEach((annotation: any) => {
      if (annotation !== null) {
        try {
          // Check if annotation already exists before adding
          if (!anno.getAnnotationById(annotation.id)) {
            anno.addAnnotation(annotation);
          } else {
            console.log(`Annotation ${annotation.id} already exists.`);
          }

          // Check if this annotation is marked as the chosen one
          if (
            annotation.bodies?.some(
              (b: any) => b.purpose === "selectedBuilding" && b.value === true
            )
          ) {
            foundChosenId = annotation.id;
            console.log(
              "Found initially chosen building during load:",
              foundChosenId
            );
          }
        } catch (error) {
          console.error(
            "Error adding/checking annotation:",
            annotation.id,
            error
          );
        }
      }
    });

    // Set the initial chosen ID after iterating through all loaded annotations
    if (foundChosenId && !chosenBuildingId) {
      setChosenBuildingId(foundChosenId);
    }
  }, [anno, convertedAnnotations, chosenBuildingId]);

  // Capture selecting an annotation
  useEffect(() => {
    if (!anno) return;

    if (selected.length === 1) {
      const newlySelectedAnnotation = selected[0].annotation;
      const newlySelectedId = newlySelectedAnnotation.id;
      setSelectedId(newlySelectedId);

      const isBuilding = newlySelectedAnnotation.bodies.some(
        (body) =>
          body.purpose === "tagging" && body.value === ClassTypes.BUILDING
      );

      // --- Logic to update the *chosen* building ---
      if (isBuilding && newlySelectedId !== chosenBuildingId) {
        console.log(
          `Building ${newlySelectedId} selected. Updating chosen building.`
        );

        //  Deselect the previously chosen building if it exists
        if (chosenBuildingId) {
          const previouslyChosen = annotations.find(
            (a) => a.id === chosenBuildingId
          );
          if (previouslyChosen) {
            // Create updated annotation *without* the selectedBuilding marker
            const updatedPrevious = {
              ...previouslyChosen,
              bodies: previouslyChosen.bodies.filter(
                (b) => b.purpose !== "selectedBuilding"
              ),
            };
            // Only update if bodies actually changed
            if (
              updatedPrevious.bodies.length !== previouslyChosen.bodies.length
            ) {
              console.log("Deselecting previous building:", chosenBuildingId);
              anno.updateAnnotation(updatedPrevious);
            }
          } else {
            console.warn(
              "Could not find previously chosen building annotation:",
              chosenBuildingId
            );
          }
        }

        //  Select the new building
        const newlyChosen = annotations.find((a) => a.id === newlySelectedId);
        if (newlyChosen) {
          // Create updated annotation *with* the selectedBuilding marker
          const updatedNew = {
            ...newlyChosen,
            // Add the marker, ensuring no duplicates of the marker itself
            bodies: [
              ...newlyChosen.bodies.filter(
                (b) => b.purpose !== "selectedBuilding"
              ), // Remove old marker just in case
              { purpose: "selectedBuilding", value: true }, // Add the new marker
            ],
          };
          console.log("Selecting new building:", newlySelectedId);
          anno.updateAnnotation(updatedNew);
          setChosenBuildingId(newlySelectedId); // Update the state
        } else {
          console.error(
            "Could not find newly selected building annotation:",
            newlySelectedId
          );
        }
      } else if (isBuilding && newlySelectedId === chosenBuildingId) {
        console.log(`Building ${newlySelectedId} is already the chosen one.`);
        // Optional: Allow deselecting by clicking the same building again?
        // If so, add logic here to remove the marker and setChosenBuildingId(null)
      } else if (!isBuilding) {
        console.log(
          `Annotation ${newlySelectedId} selected, but it's not a building. Ignoring for chosen building logic.`
        );
        // Keep track of general selection highlight info if needed
        const categoryBody = newlySelectedAnnotation.bodies.find(
          (body: any) => body.purpose === "tagging"
        );
      }
      // --- End of chosen building logic ---
    } else if (selected.length === 0) {
      // User clicked away, deselecting everything
      setSelectedId(null);
      console.log("Selection cleared.");
    } else {
      // Multiple annotations selected - ignore for single building selection logic
      console.log(
        "Multiple annotations selected. Ignoring for chosen building logic."
      );
      setSelectedId(null); // Clear single selection ID
    }

    console.log(annotations);
  }, [selected, anno, chosenBuildingId]); // Add anno and chosenBuildingId dependencies
  //------------------------------------------------------------------ //

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

        // Determine opacity and stroke based on state
        let fillOpacity = 0.5;
        let strokeWidth = 1;
        let strokeColor = color;

        // Check if it's the specifically CHOSEN building
        const isChosen = annotation.id === chosenBuildingId;

        if (isChosen) {
          fillOpacity = 0.7;
          strokeWidth = 4;
          strokeColor = "#FFFF00";
          color = "#FED13D";
        } else if (state?.selected) {
          fillOpacity = 0.8;
          strokeWidth = 2;
        } else if (state?.hovered) {
          fillOpacity = 0.65;
          strokeWidth = 2;
        }

        return {
          fill: color,
          fillOpacity: fillOpacity,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        };
      });
    }
  }, [annotations.length, chosenBuildingId, anno]);
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
          description="Review Annotations – Check the automatically detected shadow regions for accuracy."
          color="inherit"
        />
        <FactCard
          description="Make Adjustments – Modify, add, or remove annotations using the editing tools."
          color="inherit"
        />
        <FactCard
          description="Select the building that you needed to be estminated the photovoltaic energy"
          color="primary"
        />
        <FactCard
          description="Make sure you select the right location , because the results depends on your input"
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

            {chosenBuildingId == selectedId && (
              <ImageAnnotationPopup
                popup={(props) => (
                  <Stack
                    spacing={1} // Reduced spacing
                    sx={{
                      background: (theme) =>
                        alpha(theme.palette.background.paper, 0.95), // Slightly transparent bg
                      p: 1.5, // Smaller padding
                      borderRadius: 2,
                      boxShadow: 3, // More prominent shadow
                      border: (theme) =>
                        `1px solid ${theme.palette.primary.main}`, // Primary color border
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                      Choose this building?
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      Confirm
                    </Button>
                  </Stack>
                )}
              />
            )}
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
              <LoadingButton
                loading={modelState === State.LOADING}
                variant="contained"
                color="primary"
                size="large"
                onClick={() => {
                  dispatch(
                    get3DObjectJSON({
                      image,
                      cocoData: convertAnnotoriousToCOCO(
                        annotations as any,
                        cocoAnnotations.coco_output.images[0]
                      ),
                    })
                  );
                }}
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
              </LoadingButton>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Tool;
