import "./App.css";
import { Outlet, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import MainPage from "./pages/Main";
import Chatbot from "./pages/Chat";
import MyPage from "./pages/MyPage";
import About from "./pages/About";
import SearchPage from "./pages/Search";
import DetailsPage from "./pages/Details";

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
          <Route path="chat/:contentid/:contenttypeid" element={<Chatbot />} />
          <Route path="myPage" element={<MyPage />} />
          <Route path="about" element={<About />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="/details/:contentid/:contenttypeid" element={<DetailsPage />} />
        </Route>
      </Routes>
    </div>
  );
}
export default App;
