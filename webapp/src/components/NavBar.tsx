import React, { useEffect, useState } from "react";
import {
  Toolbar,
  Typography,
  AppBar,
  Stack,
  Avatar,
  Paper,
  alpha,
  IconButton,
  Badge,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { navBarHeight, navBarWidth } from "../constants";
import { useLocation } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddToCartPopper from "./popper/AddToCartPopper";
import { useAppDispatch } from "../slices/store";
import TodayIcon from "@mui/icons-material/Today";
import BasicInfoPopper from "./popper/BasicInfoPopper";
import UserInfoPopper from "./popper/UserInfoPopper";
import { NavBarProps } from "../types/componentInterfaces";
import { Link } from "react-router-dom";

const NavBar = ({ commonPageTabs }: NavBarProps) => {
  const location = useLocation().search;
  const [routeName, setRouteName] = useState(location.split("=").pop());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userInfoAnchorEl, setUserInfoAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const date = new Date();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Estminations", path: "/about" },
    { label: "Solar Panels", path: "/services" },
    { label: "Contact Us", path: "/contact" },
  ];

  const addToCartPopperHandler = (
    event: React.MouseEvent<HTMLElement> | null
  ) => {
    if (event) {
      event.preventDefault();
      setAnchorEl(anchorEl ? null : event.currentTarget);
    } else {
      setAnchorEl(null);
    }
  };

  const basicInfoPopperHandler = (
    event: React.MouseEvent<HTMLElement> | null
  ) => {
    if (event) {
      event.preventDefault();
      setUserInfoAnchorEl(userInfoAnchorEl ? null : event.currentTarget);
    } else {
      setUserInfoAnchorEl(null);
    }
  };

  useEffect(() => {
    setRouteName(location.split("=").pop());
  }, [location]);
  return (
    <>
      <AppBar
        position="relative"
        sx={{
          display: "flex",
          justifyContent: "center",
          boxShadow: "none",
          bgcolor: "transparent",
          mb: 8,
        }}
      >
        <Toolbar>
          <Stack
            flexDirection={"row"}
            sx={{
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Stack
              sx={{
                flexDirection: "row",
                gap: 1,
                alignItems: "center",
              }}
            >
              <Typography
                variant="h3"
                fontWeight={"700"}
                fontFamily={"MuseoModerno"}
                color={"primary"}
              >
                SOLAR
              </Typography>
              <Typography
                color={"secondary"}
                variant="h5"
                fontWeight={"700"}
                fontFamily={"MuseoModerno"}
              >
                Sync
              </Typography>
            </Stack>

            <List
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              {navLinks.map(({ label, path }) => (
                <ListItem
                  key={path}
                  component={Link}
                  to={path}
                  sx={{
                    textDecoration: "none",
                    color: "black",
                    fontSize: 20,
                    minWidth: 120,
                  }}
                >
                  <ListItemText
                    primary={label}
                    sx={{
                      textDecoration: "none",
                      fontSize: 20,
                    }}
                    primaryTypographyProps={{
                      fontSize: 12,
                      fontWeight: "semi-bold",
                    }}
                  />
                </ListItem>
              ))}
            </List>

            <Stack>
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 30,
                  p: 0.4,
                  pr: 2,
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  cursor: "pointer",
                }}
                onClick={basicInfoPopperHandler}
              >
                <Avatar
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.8),
                    width: 50,
                    height: 50,
                  }}
                >
                  SS
                </Avatar>
                <Stack justifyContent={"center"}>
                  <Typography variant="body2" color={"GrayText"}>
                    Cashier
                  </Typography>
                  <Typography variant="body1" fontWeight={"600"}>
                    Sandalu De Silva
                  </Typography>
                </Stack>
              </Paper>
              <UserInfoPopper
                anchorEl={userInfoAnchorEl}
                handleClick={basicInfoPopperHandler}
              />
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;
