import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PatientForm from "./pages/PatientForm";
import PatientList from "./pages/PatientList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PatientForm />} />
        <Route path="/patient-list" element={<PatientList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
