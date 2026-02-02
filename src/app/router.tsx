import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
import { useAuth } from "@/app/AuthContext";
import { HomePage } from "@/features/room/pages/HomePage";
import { LoginPage } from "@/features/room/pages/LoginPage";
import { RoomPage } from "@/features/room/pages/RoomPage";

function RequireAuth() {
  const { email } = useAuth();
  if (!email) return <LoginPage />;
  return <Outlet />;
}

const router = createBrowserRouter([
  {
    element: <RequireAuth />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/room/:code", element: <RoomPage /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
