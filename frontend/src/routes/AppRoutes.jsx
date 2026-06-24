import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/Landing/LandingPage";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import Dashboard from "../pages/Dashboard/Dashboard";

import Groups from "../pages/Groups/Groups";
import GroupDetails from "../pages/Groups/GroupDetails";
import JoinViaLink from "../pages/Groups/JoinViaLink";

import Resources from "../pages/Resources/Resources";

import StudyRooms from "../pages/StudyRoom/StudyRooms";
import StudyRoom from "../pages/StudyRoom/StudyRoom";

import QuestArena from "../pages/QuestArena/QuestArena";
import Leaderboard from "../components/quiz/Leaderboard";

import Profile from "../pages/Profile/Profile";

import TutorMarketplace from "../pages/TutorMarketplace/TutorMarketplace";
import TutorDetails from "../pages/TutorMarketplace/TutorDetails";

import TutorRequest from "../pages/TutorRequest/TutorRequest";
import AdminDashboard from "../pages/Admin/AdminDashboard";

import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/layout/Layout";

const AppRoutes = () => {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* GROUPS */}
      <Route
        path="/groups"
        element={
          <ProtectedRoute>
            <Layout>
              <Groups />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/groups/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <GroupDetails />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/join/:inviteCode"
        element={
          <ProtectedRoute>
            <JoinViaLink />
          </ProtectedRoute>
        }
      />

      {/* RESOURCES */}
      <Route
        path="/resources"
        element={
          <ProtectedRoute>
            <Layout>
              <Resources />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* STUDY ROOMS */}
      <Route
        path="/study-rooms"
        element={
          <ProtectedRoute>
            <Layout>
              <StudyRooms />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/study-rooms/:roomId"
        element={
          <ProtectedRoute>
            <Layout>
              <StudyRoom />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* QUEST ARENA */}
      <Route
        path="/groups/:groupId/quest-arena"
        element={
          <ProtectedRoute>
            <Layout>
              <QuestArena />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Leaderboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* TUTOR MARKETPLACE */}
      <Route
        path="/tutors"
        element={
          <ProtectedRoute>
            <Layout>
              <TutorMarketplace />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tutors/:tutorId"
        element={
          <ProtectedRoute>
            <Layout>
              <TutorDetails />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* TUTOR REQUEST */}
      <Route
        path="/tutor-request"
        element={
          <ProtectedRoute>
            <Layout>
              <TutorRequest />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* ADMIN DASHBOARD */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* PROFILE */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white text-2xl font-bold">
            404 | Page Not Found
          </div>
        }
      />

    </Routes>
  );
};

export default AppRoutes;