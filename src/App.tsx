import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import EmployeesPage from "./pages/Employees/EmployeesPage";
import CreateEmployeePage from "./pages/CreateEmployee/CreateEmployeePage";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<EmployeesPage />} />
          <Route path="/employees/new" element={<CreateEmployeePage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
