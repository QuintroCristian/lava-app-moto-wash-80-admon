import { useThemeSync } from "./hooks/useThemeSync";
import { MainRouter } from "./routers";
import { RouterProvider } from "react-router-dom";

function App() {
  useThemeSync()
  return <RouterProvider router={MainRouter()} />;
}

export default App;