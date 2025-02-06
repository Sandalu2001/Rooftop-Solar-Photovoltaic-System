import {
  Paper,
  Typography,
  alpha,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import SupplierInfoCard from "./SupplierInfoCard";
import { OrderStatus } from "../../../../types/componentInterfaces";
import SearchIcon from "@mui/icons-material/Search";
const SuppliersView = () => {
  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        flex: 1,
        width: "100%",
        height: "100%",
        border: "none",
        borderRadius: 3,
        p: 2,
      }}
    >
      <Stack
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{ marginY: 1.5 }}
      >
        <Typography variant="h6" fontWeight={600} color={"GrayText"}>
          Supplier Overview
        </Typography>

        <TextField
          variant="outlined"
          label="Search Orders"
          size="small"
          sx={{
            width: 200,
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
      <Stack
        sx={{
          background: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.selectedOpacity
            ),
          height: 600,
          borderRadius: 3,

          gap: 4,
          overflow: "auto",
        }}
      >
        <Stack sx={{ gap: 1.2, overflow: "auto", paddingY: 2 }}>
          <SupplierInfoCard
            orderId={3432}
            expectedTotal={24500}
            noOfItems={5}
            supplier={"ESS. ELectronics, Matara, Sri Lanka"}
            date={new Date().toDateString()}
            status={OrderStatus.PENDING}
            products={[
              {
                productName: "Laptop",
                price: 999.99,
                quantity: 10,
              },
              {
                productName: "Smartphone",
                price: 699.99,
                quantity: 25,
              },
              {
                productName: "Headphones",
                price: 199.99,
                quantity: 50,
              },
              {
                productName: "Smartwatch",
                price: 249.99,
                quantity: 30,
              },
              {
                productName: "Tablet",
                price: 499.99,
                quantity: 15,
              },
              {
                productName: "Monitor",
                price: 299.99,
                quantity: 20,
              },
              {
                productName: "Keyboard",
                price: 89.99,
                quantity: 100,
              },
              {
                productName: "Mouse",
                price: 49.99,
                quantity: 150,
              },
              {
                productName: "External Hard Drive",
                price: 129.99,
                quantity: 40,
              },
              {
                productName: "USB-C Hub",
                price: 39.99,
                quantity: 200,
              },
            ]}
          />

          <SupplierInfoCard
            orderId={1343}
            expectedTotal={145500}
            noOfItems={5}
            supplier={"Abans Lanka, Colombo 11, Sri Lanka"}
            date={new Date().toDateString()}
            status={OrderStatus.DELIVERED}
            products={[
              {
                productName: "Laptop",
                price: 999.99,
                quantity: 10,
              },
              {
                productName: "Smartphone",
                price: 699.99,
                quantity: 25,
              },
              {
                productName: "Headphones",
                price: 199.99,
                quantity: 50,
              },
              {
                productName: "Smartwatch",
                price: 249.99,
                quantity: 30,
              },
              {
                productName: "Tablet",
                price: 499.99,
                quantity: 15,
              },
              {
                productName: "Monitor",
                price: 299.99,
                quantity: 20,
              },
              {
                productName: "Keyboard",
                price: 89.99,
                quantity: 100,
              },
              {
                productName: "Mouse",
                price: 49.99,
                quantity: 150,
              },
              {
                productName: "External Hard Drive",
                price: 129.99,
                quantity: 40,
              },
              {
                productName: "USB-C Hub",
                price: 39.99,
                quantity: 200,
              },
            ]}
          />

          <SupplierInfoCard
            orderId={2232}
            expectedTotal={54670}
            noOfItems={5}
            supplier={"Athula Store, Colombo,Sri Lanka"}
            date={new Date().toDateString()}
            status={OrderStatus.ONDELIVERY}
            products={[
              {
                productName: "Laptop",
                price: 999.99,
                quantity: 10,
              },
              {
                productName: "Smartphone",
                price: 699.99,
                quantity: 25,
              },
              {
                productName: "Headphones",
                price: 199.99,
                quantity: 50,
              },
              {
                productName: "Smartwatch",
                price: 249.99,
                quantity: 30,
              },
              {
                productName: "Tablet",
                price: 499.99,
                quantity: 15,
              },
              {
                productName: "Monitor",
                price: 299.99,
                quantity: 20,
              },
              {
                productName: "Keyboard",
                price: 89.99,
                quantity: 100,
              },
              {
                productName: "Mouse",
                price: 49.99,
                quantity: 150,
              },
              {
                productName: "External Hard Drive",
                price: 129.99,
                quantity: 40,
              },
              {
                productName: "USB-C Hub",
                price: 39.99,
                quantity: 200,
              },
            ]}
          />

          <SupplierInfoCard
            orderId={3434}
            expectedTotal={84200}
            noOfItems={5}
            supplier={"Sandalu"}
            date={new Date().toDateString()}
            status={OrderStatus.CANCELLED}
            products={[
              {
                productName: "Laptop",
                price: 999.99,
                quantity: 10,
              },
              {
                productName: "Smartphone",
                price: 699.99,
                quantity: 25,
              },
              {
                productName: "Headphones",
                price: 199.99,
                quantity: 50,
              },
              {
                productName: "Smartwatch",
                price: 249.99,
                quantity: 30,
              },
              {
                productName: "Tablet",
                price: 499.99,
                quantity: 15,
              },
              {
                productName: "Monitor",
                price: 299.99,
                quantity: 20,
              },
              {
                productName: "Keyboard",
                price: 89.99,
                quantity: 100,
              },
              {
                productName: "Mouse",
                price: 49.99,
                quantity: 150,
              },
              {
                productName: "External Hard Drive",
                price: 129.99,
                quantity: 40,
              },
              {
                productName: "USB-C Hub",
                price: 39.99,
                quantity: 200,
              },
            ]}
          />
        </Stack>
      </Stack>
    </Paper>
  );
};

export default SuppliersView;
