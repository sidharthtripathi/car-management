import { StrictMode, Suspense,lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { Join } from "./pages/Join";
import CreateCar from "./pages/CreateCar";
import ListCars from "./pages/ListCars";
// import CreateCar from "./pages/CreateCar";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/join",
    element: <Join />,
  },
  {
    path : "/create",
    element : <CreateCar/>
  },
  {
    path : "/list",
    element : <ListCars/>
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
