import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./routes/homePage/homePage";
import ListPage from "./routes/listPage/listPage";
import { Layout } from "./routes/layout/layout";
import SinglePage from "./routes/singlePage/singlePage";
import ProfilePage from "./routes/profilePage/profilePage";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";
import NewPostPage from "./routes/newPostPage/newPostPage";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { listPageLoader, profilePageLoader, singlePageLoader } from "./lib/loaders";
import About from "./routes/about/About"; 

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/list",
          element: <ListPage />,
          loader: listPageLoader,
          errorElement: <ErrorBoundary />
        },
        {
          path: "/:id",
          element: <SinglePage />,
          loader: singlePageLoader,
          errorElement: <ErrorBoundary />
        },
        {
          path: "/about", 
          element: <About />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
      ],
    },
    {
      path: "/",
      element: <RequireAuth />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: "profile",
          element: <ProfilePage />,
          loader: profilePageLoader,
          errorElement: <ErrorBoundary />
        },
        {
          path: "profile/update",
          element: <ProfileUpdatePage />,
          errorElement: <ErrorBoundary />
        },
        {
          path: "add",
          element: <NewPostPage />,
          errorElement: <ErrorBoundary />
        },
      ],
    },
    {
      path: "*",
      element: <ErrorBoundary />
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
