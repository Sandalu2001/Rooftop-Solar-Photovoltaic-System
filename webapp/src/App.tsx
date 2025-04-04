import React, { JSX, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Layout from "./components/layout/Layout";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import "./App.css";
import { Amplify } from "aws-amplify";
import { getCurrentUser } from "@aws-amplify/auth";
import outputs from "./amplify_outputs.json";
import Login from "./components/Login";
import { AuthState } from "./types/componentInterfaces";
import { useAppDispatch, useAppSelector } from "./slices/store";
import { setAuthState } from "./slices/auth-slice";
import { Annotorious } from "@annotorious/react";
import Tool from "./pages/tool/index";
import Home from "./pages/home/Home";
import MapComponent from "./pages/tool/Map";
import { SnackbarProvider } from "notistack";

Amplify.configure(outputs);

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    assessLoggedInState();
  }, []);

  const assessLoggedInState = () => {
    getCurrentUser()
      .then((user) => {
        localStorage.setItem("pos-app-state", AuthState.ACTIVE);
        dispatch(setAuthState(AuthState.ACTIVE));
      })
      .catch((error) => {
        localStorage.setItem("pos-app-state", AuthState.LOGOUT);
        dispatch(setAuthState(AuthState.LOGOUT));
      });
  };

  const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
    if (
      (localStorage.getItem("pos-app-state") as AuthState | null) ===
        AuthState.LOGOUT ||
      (localStorage.getItem("pos-app-state") as AuthState | null) === null
    ) {
      return <Navigate to="/login" replace />;
    }
    return element;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute element={<Layout />} />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/about",
          element: <MapComponent />,
        },
        {
          path: "/tool",
          element: <Tool />,
        },
        {
          path: "contact",
          element: <Tool />,
        },
      ],
      errorElement: <Tool />,
    },
    {
      path: "/login",
      element:
        (localStorage.getItem("pos-app-state") as AuthState | null) ===
        AuthState.ACTIVE ? (
          <Navigate to="/" replace />
        ) : (
          <Login />
        ),
    },
  ]);

  return (
    <SnackbarProvider maxSnack={3} preventDuplicate>
      <Annotorious>
        <Box className="App">
          <RouterProvider router={router} />
          {/* <DefaultComponent /> */}
        </Box>
      </Annotorious>
    </SnackbarProvider>
  );
}

export default App;
