import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../css/PrescriptionPreview.css";

export default function PrescriptionPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const prescription = useSelector(state => 
    state.prescription.prescriptions.find(p => p.id === parseInt(id))
  );

  if (!prescription) {
    return (
      <div className="error-container">
        <h2>Prescription not found</h2>
        <button onClick={() => navigate("/prescription")} className="btn-back">Back to Prescriptions</button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="preview-container">
      <div className="preview-actions no-print">
        <button onClick={handlePrint} className="btn-print">Print Prescription</button>
        <button onClick={() => navigate("/prescription")} className="btn-back">Back</button>
      </div>

      <div className="prescription-preview">
        <div className="clinic-header">
          <h1>Abdul Latif Welfare Clinic</h1>
          <p>Hospital Management System</p>
          <div className="prescription-number">Prescription No: {prescription.prescriptionNo}</div>
        </div>

        <div className="patient-section">
          <h2>Patient Information</h2>
          <div className="patient-grid">
            <div className="info-item">
              <span className="label">Name:</span>
              <span className="value">{prescription.patient.name}</span>
            </div>
            <div className="info-item">
              <span className="label">Age:</span>
              <span className="value">{prescription.patient.age} years</span>
            </div>
            <div className="info-item">
              <span className="label">Gender:</span>
              <span className="value">{prescription.patient.gender}</span>
            </div>
            <div className="info-item">
              <span className="label">Phone:</span>
              <span className="value">{prescription.patient.phone}</span>
            </div>
            <div className="info-item full-width">
              <span className="label">Address:</span>
              <span className="value">{prescription.patient.address}</span>
            </div>
            {prescription.patient.details && (
              <div className="info-item full-width">
                <span className="label">Details:</span>
                <span className="value">{prescription.patient.details}</span>
              </div>
            )}
            <div className="info-item">
              <span className="label">Date:</span>
              <span className="value">{new Date(prescription.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="medicines-section">
          <h2>Prescribed Medicines</h2>
          {prescription.medicines.map((med, index) => (
            <div key={index} className="medicine-card">
              <div className="medicine-number">{index + 1}</div>
              <div className="medicine-details">
                <h3>{med.medicine}</h3>
                
                <div className="dosage-info">
                  <div className="dosage-label">Dosage Schedule:</div>
                  <div className="dosage-times">
                    {med.morning && <span className="time-badge">Morning</span>}
                    {med.afternoon && <span className="time-badge">Afternoon</span>}
                    {med.evening && <span className="time-badge">Evening</span>}
                    {med.night && <span className="time-badge">Night</span>}
                  </div>
                </div>

                <div className="medicine-instructions">
                  <div className="instruction-item">
                    <strong>When:</strong> {med.beforeMeal ? 'Before Meal' : 'After Meal'}
                  </div>
                  <div className="instruction-item">
                    <strong>Duration:</strong> {med.duration} days
                  </div>
                  {med.otherDetails && (
                    <div className="instruction-item">
                      <strong>Note:</strong> {med.otherDetails}
                    </div>
                  )}
                </div>

                <div className="usage-guide">
                  <h4>How to Use:</h4>
                  <p>
                    Take this medicine {med.beforeMeal ? 'before' : 'after'} meal{' '}
                    {[
                      med.morning && 'in the morning',
                      med.afternoon && 'in the afternoon',
                      med.evening && 'in the evening',
                      med.night && 'at night'
                    ].filter(Boolean).join(', ')}.
                    Continue for {med.duration} days as prescribed.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="important-notes">
          <h3>Important Instructions</h3>
          <ul>
            <li>Take medicines as prescribed by the doctor</li>
            <li>Complete the full course even if you feel better</li>
            <li>Contact the clinic if you experience any adverse effects</li>
            <li>Store medicines in a cool, dry place away from children</li>
          </ul>
        </div>

        <div className="doctor-signature">
          <div className="signature-line"></div>
          <p>Doctor's Signature</p>
          <p>{prescription.doctor}</p>
        </div>
      </div>
    </div>
  );
}

