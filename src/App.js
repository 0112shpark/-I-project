import "./App.css";
import { Outlet, Route, Routes } from "react-router-dom";
import Login from "./components/pages/Login";
import MainPage from "./components/pages/Main";

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
        </Route>
      </Routes>
    </div>
  );
}
export default App;
