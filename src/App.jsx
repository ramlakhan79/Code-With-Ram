import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import PageStructure from "./components/PageStructure";
import Home from "./pages/Home";
import About from "./pages/About";
import Resume from "./pages/Resume";
import Services from "./pages/Services";
import Blogs from "./pages/Blogs";
import BlogDetails from "./components/BlogDetails";
import Coding from "./pages/Coding";
import ErrorPage from "./pages/404";
import ThankYou from "./pages/ThankYou";

// import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";
import AdminArticles from "./pages/AdminArticles";

import Profile from "./pages/Profile";

import ContributorDashboard from "./pages/ContributorDashboard";
import ContributorArticles from "./pages/ContributorArticles";

import CreateArticle from "./pages/CreateArticle";
import EditArticle from "./pages/EditArticle";

import Register from "./pages/Register";
import Login from "./pages/Login";

import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

import GitHubCallback from "./components/GitHubCallback";


function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    if (user.role === "contributor") {
      return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  // Dark Mode is default
  const intialTheme = () => {
    const userPref = localStorage.getItem("darkmode");
    const systemPref = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    //return true for dark mode, false for light mode
    return userPref === "dark" || (!userPref && systemPref);
  };

  const [isDarkMode, setIsDarkMode] = useState(intialTheme());

  const toggleDarkMode = () => {
    localStorage.setItem("darkmode", !isDarkMode ? "dark" : "light");
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <PageStructure
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      ),
      errorElement: (
        <PageStructure isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
          <ErrorPage isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        </PageStructure>
      ),
      children: [
        {
          index: true,
          element: <Home />,
        },
        // {
        //   path: "about",
        //   element: <About />,
        // },
        // {
        //   path: "resume",
        //   element: <Resume />,
        // },
        // {
        //   path: "services",
        //   element: <Services />,
        // },
        {
          path: "blogs",
          element: <Blogs />,
        },
        {
          path: "blogs/:id",
          element: <BlogDetails />,
        },
        // {
        //   path: "coding",
        //   element: <Coding />,
        // },
        
        // Authentication
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },

        {
          path: "reset-password/:token",       
          element: <ResetPassword/>,
        },
        {
          path: "verify-email/:token",
          element: <VerifyEmail />,
        },      
        {
          path: "github/callback",
          element: <GitHubCallback/>,
        },   
        // =========================
        // ADMIN ROUTES
        // =========================

        {
          path: "admin",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          ),
        },

        {
          path: "admin/users",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <Users />
            </ProtectedRoute>
          ),
        },

        {
          path: "admin/users/create",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <CreateUser />
            </ProtectedRoute>
          ),
        },

        {
          path: "admin/users/edit/:id",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <EditUser />
            </ProtectedRoute>
          ),
        },

        {
          path: "admin/articles",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminArticles />
            </ProtectedRoute>
          ),
        },

        // =========================
        // CONTRIBUTOR ROUTES
        // =========================

        {
          path: "dashboard",
          element: (
            <ProtectedRoute allowedRoles={["contributor"]}>
              <ContributorDashboard />
            </ProtectedRoute>
          ),
        },

        {
          path: "dashboard/articles",
          element: (
            <ProtectedRoute allowedRoles={["contributor"]}>
              <ContributorArticles />
            </ProtectedRoute>
          ),
        },

        {
          path: "dashboard/articles/create",
          element: (
            <ProtectedRoute allowedRoles={["contributor", "admin"]}>
              <CreateArticle />
            </ProtectedRoute>
          ),
        },

        {
          path: "dashboard/articles/edit/:id",
          element: (
            <ProtectedRoute allowedRoles={["contributor", "admin"]}>
              <EditArticle />
            </ProtectedRoute>
          ),
        },
      
        {
          path: "/profile",
          element: (
            <ProtectedRoute
              allowedRoles={["admin", "contributor", "viewer"]}
            >
              <Profile />
            </ProtectedRoute>
          ),
        },
        
        {
          path: "thank-you",
          element: <ThankYou isDarkMode={isDarkMode} />,
        },
        {
          // This is needed to avoid getting error when toggling light and dark mode within 404 page
          path: "*",
          element: (
            <ErrorPage
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
            />
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
