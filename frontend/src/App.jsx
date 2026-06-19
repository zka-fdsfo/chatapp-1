import React from "react";
import { RouterProvider } from "react-router";
import { AuthProvider } from "./auth/auth.context.jsx";
import { router } from "./app.routes";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <AuthProvider>
       <Toaster position="top-right" />
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;