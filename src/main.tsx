import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
// IMPORT STYLES
import "./App.css";
// IMPORT PROVIDERS
import AuthProvider from "./components/providers/AuthProvider";
//IMPORT COMPONENTS
import AuthRoot from "./components/roots/AuthRoot";
import DashboardRoot from "./components/roots/DashboardRoot";
//IMPORT PAGES
import {
  AppPage,
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
} from "./pages/Pages";

//ROUTER
const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardRoot />,
    children: [{ index: true, element: <AppPage /> }],
  },
  {
    path: "/auth",
    element: <AuthRoot />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
