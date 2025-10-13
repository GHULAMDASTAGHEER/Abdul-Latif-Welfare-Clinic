import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PatientTable from "../components/PatientTable";
import { clearAllPatients, deletePatient } from "../redux/slices/patientSlice";

export default function PatientList() {
  const patientData = useSelector((state) => state.patients);
  const [selectedDate, setSelectedDate] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("patientData==>>>", patientData);

  // Filter patients by selected date
  const filteredPatients = useMemo(() => {
    if (!selectedDate) {
      return patientData; // Show all patients if no date selected
    }
    return patientData.filter((patient) => patient.date === selectedDate);
  }, [patientData, selectedDate]);

  const handleClose = () => {
    navigate("/");
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleClearFilter = () => {
    setSelectedDate("");
  };

  const handleClearAllData = () => {
    if (window.confirm("Are you sure you want to delete all patient data? This action cannot be undone.")) {
      dispatch(clearAllPatients());
      setSelectedDate("");
    }
  };

  const handleDeletePatient = (serialNo) => {
    dispatch(deletePatient(serialNo));
  };

  return (
    <div style={{ padding: "clamp(10px, 3vw, 20px)" }}>
      {/* Date Filter Section */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "clamp(15px, 3vw, 20px)",
          borderRadius: "8px",
          marginBottom: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "15px",
          flexWrap: "wrap",
          gap: "10px",
        }}>
          <h3 style={{ 
            margin: 0, 
            color: "#333",
            fontSize: "clamp(1rem, 3vw, 1.3rem)",
          }}>
            Filter by Date
          </h3>
          {patientData.length > 0 && (
            <button
              onClick={handleClearAllData}
              style={{
                padding: "clamp(8px, 2vw, 10px) clamp(15px, 3vw, 20px)",
                fontSize: "clamp(0.85rem, 2vw, 1rem)",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                whiteSpace: "nowrap",
              }}
            >
              Clear All Data
            </button>
          )}
        </div>
        <div style={{ 
          display: "flex", 
          gap: "10px", 
          alignItems: "center",
          flexWrap: "wrap",
        }}>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            style={{
              padding: "clamp(8px, 2vw, 10px)",
              fontSize: "clamp(0.85rem, 2vw, 1rem)",
              borderRadius: "5px",
              border: "1px solid #ccc",
              outline: "none",
              cursor: "pointer",
              minWidth: "150px",
              flex: "1 1 auto",
              maxWidth: "300px",
            }}
          />
          {selectedDate && (
            <button
              onClick={handleClearFilter}
              style={{
                padding: "clamp(8px, 2vw, 10px) clamp(15px, 3vw, 20px)",
                fontSize: "clamp(0.85rem, 2vw, 1rem)",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Clear Filter
            </button>
          )}
          <span style={{ 
            marginLeft: "10px", 
            color: "#666",
            fontSize: "clamp(0.8rem, 2vw, 0.95rem)",
            flexBasis: "100%",
          }}>
            Showing {filteredPatients.length} of {patientData.length} patients
          </span>
        </div>
      </div>

      {/* Patient Table */}
      <PatientTable 
        patientData={filteredPatients} 
        onClose={handleClose}
        onDelete={handleDeletePatient}
      />
    </div>
  );
}

