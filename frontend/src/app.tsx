import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Outlet,
} from "react-router-dom";
import Home from "./home";
import User from "./user";
import userImg from './media/no-profile-picture-15257_128.png';

// 1. Shared Layout Component with a Navigation Bar
function Layout() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <nav
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
          borderBottom: "1px solid #ccc",
          paddingBottom: "10px",
        }}
      >
        <Link to='/'>
          <h1>StockPile</h1>
        </Link>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link to='/login'>
            <img src={userImg}></img>Login
          </Link>
        </div>
      </nav>
      <main>
        {/* The Outlet component dynamically renders the active child route */}
        <Outlet />
      </main>
    </div>
  );
}

// 2. Individual Page Components

function NotFound() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🚫 404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to='/'>Return to Home</Link>
    </div>
  );
}

// 3. Define the Router and its 4 Main Routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Wraps children with navigation UI
    children: [
      {
        index: true, // Acts as the default view for the "/" path
        element: <Home />,
      },
      {
        path: "login",
        element: <User />,
      },
    ],
  },
  {
    path: "*", // Catch-all route for any undefined paths
    element: <NotFound />,
  },
]);

// 4. Main App Entry Point
export default function App() {
  return <RouterProvider router={router} />;
}
