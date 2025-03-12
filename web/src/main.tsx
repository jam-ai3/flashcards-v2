import "./index.css";
import { JSX } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/auth/login/login.tsx";
import Register from "./pages/auth/register/register.tsx";
import AuthProvider, {
  AuthRoute,
  ProtectedRoute,
} from "./contexts/auth-provider.tsx";
import Home from "./pages/home/home.tsx";
import Product from "./pages/product/product.tsx";
// import ForgotPassword from "./pages/auth/forgot-password/forgot-password.tsx";
// import RequestReset from "./pages/auth/request-reset/request-reset.tsx";

type Route = {
  path: string;
  element: JSX.Element;
  isProtected: boolean;
};

const routes: Route[] = [
  {
    path: "/login",
    element: <Login />,
    isProtected: false,
  },
  {
    path: "/register",
    element: <Register />,
    isProtected: false,
  },
  // {
  //   path: "/forgot-password/:id",
  //   element: <ForgotPassword />,
  //   isProtected: false,
  // },
  // {
  //   path: "request-reset-password",
  //   element: <RequestReset />,
  //   isProtected: false,
  // },
  {
    path: "/",
    element: <Home />,
    isProtected: true,
  },
  {
    path: "/product",
    element: <Product />,
    isProtected: true,
  },
];

const router = createBrowserRouter(
  routes.map((route) => {
    let element;
    if (route.isProtected === true) {
      element = (
        <ProtectedRoute>
          {route.element}
          <div className="title">
            <p>Flashcard Generator</p>
          </div>
        </ProtectedRoute>
      );
    } else if (route.isProtected === false) {
      element = (
        <AuthRoute>
          {route.element}
          <div className="title">
            <p>Flashcard Generator</p>
          </div>
        </AuthRoute>
      );
    } else {
      element = (
        <>
          {route.element}
          <div className="title">
            <p>Flashcard Generator</p>
          </div>
        </>
      );
    }
    return {
      path: route.path,
      element,
    };
  })
);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
