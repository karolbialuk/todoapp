import React, { ReactNode } from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { Login, Register, Home, InfoPage, NewTask } from "./pages";
import { Sidebar, Navbar } from "./components";
import { CalendarProvider } from "./lib/datecontext.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <div className="app">
        <Sidebar />
        <div className="main-container">
          <Navbar />
          <Outlet />
        </div>
      </div>
    );
  };

  const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    if (!localStorage.getItem("user")) {
      return <Navigate to="/login" />;
    }

    return <>{children}</>;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <QueryClientProvider client={queryClient}>
            <Layout />
          </QueryClientProvider>
        </ProtectedRoute>
      ),
      children: [
        { path: "/", element: <Home /> },
        { path: "/newtask", element: <NewTask /> },
        { path: "/edittask/:id", element: <NewTask /> },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/informations",
      element: <InfoPage />,
    },
  ]);

  return (
    <>
      <CalendarProvider>
        <RouterProvider router={router} />
      </CalendarProvider>
    </>
  );
}

export default App;
