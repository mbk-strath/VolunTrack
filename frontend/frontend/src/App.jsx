import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/main/LandingPage";
import Login from "./pages/main/Login";
import Signup from "./pages/main/Signup";
import TwoFactorPage from "./pages/main/TwoFactorPage";
import DashboardLayoutVol from "../layouts/DashboardLayoutVol";
import PublicLayout from "../layouts/PublicLayout";
import HomePage from "./pages/volunteer/HomePage";
import SettingsVolPage from "./pages/volunteer/SettingsVolPage";
import ProfilePage from "./pages/volunteer/ProfilePage";
import AccountPage from "./pages/volunteer/AccountPage";
import HistoryPage from "./pages/volunteer/HistoryPage";

function App() {
  return (
    <div className="main">
      <Router>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/two-factor" element={<TwoFactorPage />} />
          </Route>
          <Route path="/dashboard" element={<DashboardLayoutVol />}>
            <Route index element={<HomePage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="settings" element={<SettingsVolPage />}>
              <Route index element={<ProfilePage />} />
              <Route path="account" element={<AccountPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
