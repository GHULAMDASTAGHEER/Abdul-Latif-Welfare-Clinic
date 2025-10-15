import React, { useState } from "react";
import "../css/PatientTable.css";

const PatientTable = ({ patientData, onClose, onDelete }) => {
  console.log("patientData", patientData);
  const [showModal, setShowModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  const handleDeleteClick = (patient) => {
    setPatientToDelete(patient);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (patientToDelete && onDelete) {
      onDelete(patientToDelete.serialNo);
    }
    setShowModal(false);
    setPatientToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setPatientToDelete(null);
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">
          <span className="title-icon">📋</span>
          Patient Records
        </h2>
        {onClose && (
          <button 
            onClick={onClose} 
            className="btn btn-secondary close-btn"
          >
            <span>🏠</span>
            Back to Home
          </button>
        )}
      </div>

      {patientData && patientData.length > 0 ? (
        <table className="patient-table">
          <thead>
            <tr>
              <th>Serial No</th>
              <th>Token No</th>
              <th>Date</th>
              <th>Patient Name</th>
              <th>Doctor Name</th>
              <th>Fee (Rs)</th>
              <th>Free Fee Serial No</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {patientData.map((patient) => (
              <tr key={patient.serialNo}>
                <td data-label="Serial No">{patient.serialNo}</td>
                <td data-label="Token No">{patient.tokenNo}</td>
                <td data-label="Date">{patient.date}</td>
                <td data-label="Patient Name">{patient.patientName}</td>
                <td data-label="Doctor Name">{patient.doctorName || '-'}</td>
                <td data-label="Fee (Rs)">
                  {patient.isFree ? (
                    <span className="free-badge">🆓 FREE</span>
                  ) : (
                    <span className="fee-amount">₹{patient.fee || '0'}</span>
                  )}
                </td>
                <td data-label="Free Fee Serial No">
                  {patient.freeFeeSerialNo ? (
                    <span className="serial-badge">{patient.freeFeeSerialNo}</span>
                  ) : (
                    <span className="empty-field">-</span>
                  )}
                </td>
                <td data-label="Action">
                  <button
                    onClick={() => handleDeleteClick(patient)}
                    className="delete-btn"
                    title="Delete Patient"
                  >
                    <span>🗑️</span>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          color: '#666',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📭</div>
          <h3 style={{ color: '#333', marginBottom: '10px' }}>No Data Found</h3>
          <p style={{ fontSize: '16px' }}>There are no patient records to display.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            maxWidth: '500px',
            width: '100%',
          }}>
            <h3 style={{ marginTop: 0, color: '#333', marginBottom: '20px', fontSize: 'clamp(1.1rem, 3vw, 1.5rem)' }}>
              Confirm Delete
            </h3>
            <p style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', color: '#666', marginBottom: '10px' }}>
              Are you sure you want to delete this patient record?
            </p>
            {patientToDelete && (
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '15px',
                borderRadius: '5px',
                marginBottom: '20px',
              }}>
                <p style={{ margin: '5px 0', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>
                  <strong>Name:</strong> {patientToDelete.patientName}
                </p>
                <p style={{ margin: '5px 0', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>
                  <strong>Serial No:</strong> {patientToDelete.serialNo}
                </p>
                <p style={{ margin: '5px 0', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>
                  <strong>Date:</strong> {patientToDelete.date}
                </p>
              </div>
            )}
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={handleCancelDelete}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  flex: '1 1 auto',
                  minWidth: '100px',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  fontWeight: 'bold',
                  flex: '1 1 auto',
                  minWidth: '100px',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientTable;
