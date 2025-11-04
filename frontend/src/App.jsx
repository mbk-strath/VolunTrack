import "./App.css";
import React from "react";

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
import MessagesPage from "./pages/volunteer/MessagesPage";
import HistoryPage from "./pages/volunteer/HistoryPage";
import ForgotPassword from "./pages/main/ForgotPassword";
import ResetPassword from "./pages/main/ResetPassword";
import ViewOpportunityPage from "./pages/volunteer/ViewOpportunityPage";
import ApplicationHistoryPage from "./pages/volunteer/ApplicationHistoryPage";
import DashboardLayoutAdmin from "../layouts/DashboardLayoutAdmin";
import AdminOrganisations from "./pages/admin/AdminOrganisations";
import AdminReports from "./pages/admin/AdminReports";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminHome from "./pages/admin/AdminHome";
import VerifyUser from "./components/main/VerifyUser";

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
            <Route path="/verify/:id" element={<VerifyUser />} />

            <Route path="/password-reset" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          <Route path="/dashboard/volunteer" element={<DashboardLayoutVol />}>
            <Route index element={<HomePage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="applications" element={<ApplicationHistoryPage />} />
            <Route path="opportunities" element={<ViewOpportunityPage />} />
            <Route path="settings" element={<SettingsVolPage />}>
              <Route index element={<ProfilePage />} />
              <Route path="account" element={<AccountPage />} />
            </Route>
          </Route>
          <Route path="/dashboard/admin" element={<DashboardLayoutAdmin />}>
            <Route index element={<AdminHome />} />
<<<<<<< Updated upstream
=======
            <Route path="home" element={<AdminHome />} />
            <Route path="users" element={<AdminUsers />} />
>>>>>>> Stashed changes
            <Route path="organisations" element={<AdminOrganisations />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="events" element={<AdminEvents />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
