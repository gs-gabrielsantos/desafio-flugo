import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { ProtectedRoute } from "./auth/ProtectedRoute";

import LoginPage from "./pages/Login/LoginPage";
import EmployeesPage from "./pages/Employees/EmployeesPage";
import EmployeeForm from "./pages/Employees/EmployeeForm";
import AppLayout from "./components/layout/AppLayout";
import DepartmentsPage from "./pages/Departments/DepartmentsPage";
import DepartmentFormPage from "./pages/Departments/DepartmentsForm";
import NotFoundPage from "./pages/NotFound/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <EmployeesPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/employees/new"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <EmployeeForm />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/employees/:id/edit"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <EmployeeForm />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/departments"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DepartmentsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/departments/new"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DepartmentFormPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/departments/:id/edit"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DepartmentFormPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/employees" replace />} />
          <Route path="/" element={<Navigate to="/employees" replace />} />

          <Route
            path="*"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <NotFoundPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
