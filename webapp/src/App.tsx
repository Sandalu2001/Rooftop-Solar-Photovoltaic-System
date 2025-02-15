import React, { useEffect, useState } from "react";
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
import DefaultComponent from "./components/annotation/Annotation";
import { Annotorious } from "@annotorious/react";
import CashierPanel from "./pages/analytics-dashboard/InventoryPanel";
import AdminPanel from "./pages/tool/Tool";
import Home from "./pages/home/Home";

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
          element: <AdminPanel />,
        },
        {
          path: "/projects",
          element: <CashierPanel />,
        },
        {
          path: "/contact",
          element: <AdminPanel />,
        },
      ],
      errorElement: <AdminPanel />,
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
    <Annotorious>
      <Box className="App">
        <RouterProvider router={router} />
        {/* <DefaultComponent /> */}
      </Box>
    </Annotorious>
  );
}

export default App;
