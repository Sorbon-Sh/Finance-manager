import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       {
//         path: "",
//         element: <Transactions />,
//       },

//       {
//         path: "analytic",
//         element: <Analytic />,
//       },
//       {
//         path: "finplans",
//         element: <FinPlans />,
//       },
//       {
//         path: "deposits",
//         element: <Deposits />,
//       },
//     ],
//   },
//   {
//     path: "*",
//     element: <div className="text-center">NO Page Found</div>,
//   },
// ]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
