import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home.tsx";
import { ClerkProvider, RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import {
  AdminPanel,
  Dashboard,
  Loading,
  SignInPage,
  SignUpPage,
} from "./components/index.ts";
import { SupabaseProvider } from "./components/providers/SupabaseProvider.tsx";
import { AdminChatWidget } from "./components";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

declare global {
  interface Window {
    tronWeb?: any;
    tronLink?: any;
  }
}

function ProtectedDashboard() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <Loading />;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return <Dashboard />;
}

function ProtectedChatBox() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <Loading />;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return <AdminChatWidget />;
}

function ProtectedAdmin() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const ADMIN_USER_IDS = [`${import.meta.env.VITE_ADMIN_ID}`];

  if (!isLoaded) return <Loading />;
  if (!isSignedIn) return <RedirectToSignIn />;
  if (!userId || !ADMIN_USER_IDS.includes(userId)) {
    return (
      <div className="p-8 text-center text-red-600">
        Access Denied: Admins Only
      </div>
    );
  }

  return <AdminPanel />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "sign-in", element: <SignInPage /> },
      { path: "sign-up", element: <SignUpPage /> },
      {
        path: "user/dashboard",
        element: <ProtectedDashboard />,
      },
      {
        path: "user",
        element: <ProtectedDashboard />,
      },
      {
        path: "dashboard",
        element: <ProtectedDashboard />,
      },
      {
        path: "admin/adminPanel",
        element: <ProtectedAdmin />,
      },
      {
        path: "user/chat",
        element: <ProtectedChatBox />,
      },
    ],
  },
  { path: "*", element: <div>404 - Page Not Found</div> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <SupabaseProvider>
        <RouterProvider router={router} />
      </SupabaseProvider>
    </ClerkProvider>
  </StrictMode>
);
