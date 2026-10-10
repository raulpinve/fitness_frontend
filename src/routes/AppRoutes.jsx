import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../features/auth/LoginPage";
import ExercisesPage from "../features/exercises/ExercisesPage";
import ProgramsPage from "../features/programs/ProgramsPage";
import ProgramDetailPage from "../features/programs/ProgramDetailPage";
import ProfilePage from "../features/profile/ProfilePage";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Todo lo de aquí dentro requiere sesión */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/programas" replace />} />
          <Route path="/ejercicios" element={<ExercisesPage />} />
          <Route path="/programas" element={<ProgramsPage />} />
          <Route path="/programas/:programId" element={<ProgramDetailPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
