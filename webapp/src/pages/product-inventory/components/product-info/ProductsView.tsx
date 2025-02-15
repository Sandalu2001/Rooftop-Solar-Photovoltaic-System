import {
  Box,
  Paper,
  Typography,
  alpha,
  Stack,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import InventoryTable from "../../../../components/table/InventoryDashboardTable";
import SearchIcon from "@mui/icons-material/Search";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import AddProductModal from "../../../../components/modal/AddProductModal";

const ProductsView = () => {
  const [addProductClicked, setAddProductClicked] = useState(false);
  return (
    <>
      {" "}
      <Paper
        variant="outlined"
        sx={{
          flex: 3.5,
          width: "100%",
          height: "70vh",
          border: "none",
          p: 3,
          borderRadius: 3,
        }}
      >
        <Stack sx={{ height: "100%" }}>
          <Stack
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Product Overview
            </Typography>
            <Stack flexDirection={"row"} gap={2}>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                sx={{ borderRadius: 3 }}
                onClick={() => setAddProductClicked(true)}
              >
                Add Product
              </Button>
              <TextField
                variant="outlined"
                label="Search Product"
                size="small"
                sx={{
                  width: 250,
                }}
                InputProps={{
                  sx: { borderRadius: 15, bgcolor: "background.default" },
                  endAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Stack>
          <InventoryTable />
        </Stack>
      </Paper>
      {/* --------------Add Product Modal------------------ */}
      <AddProductModal
        open={addProductClicked}
        handleClose={() => setAddProductClicked(false)}
      />
    </>
  );
};

export default ProductsView;
