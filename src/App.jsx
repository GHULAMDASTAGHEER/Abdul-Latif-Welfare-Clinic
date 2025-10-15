import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PatientForm from "./pages/PatientForm";
import PatientList from "./pages/PatientList";
import Inventory from "./pages/Inventory";
import POS from "./pages/POS";
import Prescription from "./pages/Prescription";
import PrescriptionPreview from "./pages/PrescriptionPreview";
import SalesReports from "./pages/SalesReports";
import PurchaseReports from "./pages/PurchaseReports";
import SaleReturns from "./pages/SaleReturns";
import PurchaseReturns from "./pages/PurchaseReturns";
import CashHistory from "./pages/CashHistory";
import Maintenance from "./pages/Maintenance";
import PrinterSetup from "./pages/PrinterSetup";
import UserManagement from "./pages/UserManagement";

function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/" />;
}

function App() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/patient-form" element={<ProtectedRoute><PatientForm /></ProtectedRoute>} />
        <Route path="/patient-list" element={<ProtectedRoute><PatientList /></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
        <Route path="/pos" element={<ProtectedRoute><POS /></ProtectedRoute>} />
        <Route path="/prescription" element={<ProtectedRoute><Prescription /></ProtectedRoute>} />
        <Route path="/prescription-preview/:id" element={<ProtectedRoute><PrescriptionPreview /></ProtectedRoute>} />
        <Route path="/sales-reports" element={<ProtectedRoute><SalesReports /></ProtectedRoute>} />
        <Route path="/purchase-reports" element={<ProtectedRoute><PurchaseReports /></ProtectedRoute>} />
        <Route path="/sale-returns" element={<ProtectedRoute><SaleReturns /></ProtectedRoute>} />
        <Route path="/purchase-returns" element={<ProtectedRoute><PurchaseReturns /></ProtectedRoute>} />
        <Route path="/cash-history" element={<ProtectedRoute><CashHistory /></ProtectedRoute>} />
        <Route path="/maintenance" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />
        <Route path="/printer-setup" element={<ProtectedRoute><PrinterSetup /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
