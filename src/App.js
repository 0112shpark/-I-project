import "./App.css";
import { Outlet, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import MainPage from "./pages/Main";

const Layout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};
function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="main" element={<MainPage />} />
          <Route path = "search" element={< />} />
        </Route>
      </Routes>
    </div>
  );
}
export default App;
