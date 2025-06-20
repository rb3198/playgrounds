import { createBrowserRouter, RouterProvider } from "react-router";
import { Layout } from "./Layout";
import { lazy, Suspense } from "react";

const LazyRdr2 = lazy(() => import("@playgrounds/rdr2_showcase/App.tsx"));

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "rdr2_showcase",
        element: (
          <Suspense>
            <LazyRdr2 />
          </Suspense>
        ),
      },
    ],
  },
]);
function App() {
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
