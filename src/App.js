import "./App.css";
import { Outlet, Route, Routes } from "react-router-dom";
import Login from "./components/pages/Login";

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
        {/* <Route path="/" element={<Layout />}> */}
        <Route index element={<Login />} />
        {/* </Route> */}
      </Routes>
    </div>
  );
}
export default App;
