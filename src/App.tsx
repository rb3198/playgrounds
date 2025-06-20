import { createBrowserRouter, RouterProvider } from "react-router";
import { Layout } from "./Layout";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "rdr2_showcase",
        element: null,
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
