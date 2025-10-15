import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addPrescription } from "../redux/slices/prescriptionSlice";
import "../css/Prescription.css";

export default function Prescription() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const prescriptions = useSelector(state => state.prescription.prescriptions);
  const items = useSelector(state => state.inventory.items).filter(i => i.type === 'medicine');
  
  const [showForm, setShowForm] = useState(false);
  const [medicines, setMedicines] = useState([{
    medicine: "",
    morning: false,
    afternoon: false,
    evening: false,
    night: false,
    beforeMeal: true,
    duration: "5",
    otherDetails: ""
  }]);
  
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    age: "",
    gender: "male",
    address: "",
    phone: "",
    details: ""
  });

  const addMedicine = () => {
    setMedicines([...medicines, {
      medicine: "",
      morning: false,
      afternoon: false,
      evening: false,
      night: false,
      beforeMeal: true,
      duration: "5",
      otherDetails: ""
    }]);
  };

  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const updateMedicine = (index, field, value) => {
    setMedicines(medicines.map((m, i) => 
      i === index ? { ...m, [field]: value } : m
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const prescription = {
      id: Date.now(),
      prescriptionNo: `RX-${Date.now()}`,
      date: new Date().toISOString(),
      patient: patientInfo,
      medicines: medicines,
      doctor: "Dr. [Name]"
    };
    
    dispatch(addPrescription(prescription));
    alert("Prescription saved successfully!");
    
    setPatientInfo({ name: "", age: "", gender: "male", address: "", phone: "", details: "" });
    setMedicines([{
      medicine: "", morning: false, afternoon: false, evening: false, night: false,
      beforeMeal: true, duration: "5", otherDetails: ""
    }]);
    setShowForm(false);
  };

  const viewPrescription = (prescription) => {
    navigate(`/prescription-preview/${prescription.id}`);
  };

  return (
    <div className="prescription-container">
      <div className="page-header">
        <div>
          <h1>Prescription Management</h1>
          <p>Create and manage patient prescriptions</p>
        </div>
        <div className="header-actions">
          <button onClick={() => setShowForm(true)} className="btn-primary">New Prescription</button>
          <button onClick={() => navigate("/dashboard")} className="btn-secondary">Back to Dashboard</button>
        </div>
      </div>

      <div className="prescriptions-list">
        {prescriptions.map(prescription => (
          <div key={prescription.id} className="prescription-card">
            <div className="prescription-header">
              <div>
                <h3>{prescription.patient.name}</h3>
                <p>{prescription.patient.age} years, {prescription.patient.gender}</p>
              </div>
              <div className="prescription-no">{prescription.prescriptionNo}</div>
            </div>
            <div className="prescription-info">
              <p><strong>Phone:</strong> {prescription.patient.phone}</p>
              <p><strong>Date:</strong> {new Date(prescription.date).toLocaleDateString()}</p>
              <p><strong>Medicines:</strong> {prescription.medicines.length}</p>
            </div>
            <button onClick={() => viewPrescription(prescription)} className="btn-view">View Full Prescription</button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="prescription-modal" onClick={(e) => e.stopPropagation()}>
            <h2>New Prescription</h2>
            <form onSubmit={handleSubmit}>
              <div className="section">
                <h3>Patient Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Patient Name</label>
                    <input
                      type="text"
                      value={patientInfo.name}
                      onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="number"
                      value={patientInfo.age}
                      onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      value={patientInfo.gender}
                      onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      value={patientInfo.phone}
                      onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      value={patientInfo.address}
                      onChange={(e) => setPatientInfo({ ...patientInfo, address: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Details / Symptoms</label>
                  <textarea
                    value={patientInfo.details}
                    onChange={(e) => setPatientInfo({ ...patientInfo, details: e.target.value })}
                    rows="2"
                  />
                </div>
              </div>

              <div className="section">
                <div className="section-header">
                  <h3>Medicines</h3>
                  <button type="button" onClick={addMedicine} className="btn-add-med">+ Add Medicine</button>
                </div>
                {medicines.map((med, index) => (
                  <div key={index} className="medicine-entry">
                    <div className="medicine-header">
                      <span>Medicine {index + 1}</span>
                      {medicines.length > 1 && (
                        <button type="button" onClick={() => removeMedicine(index)} className="btn-remove-med">Remove</button>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Select Medicine</label>
                      <select
                        value={med.medicine}
                        onChange={(e) => updateMedicine(index, 'medicine', e.target.value)}
                        required
                      >
                        <option value="">Select medicine...</option>
                        {items.map(item => (
                          <option key={item.id} value={item.name}>{item.name} ({item.brand})</option>
                        ))}
                      </select>
                    </div>
                    <div className="timing-section">
                      <label>Timing:</label>
                      <div className="timing-checkboxes">
                        <label>
                          <input
                            type="checkbox"
                            checked={med.morning}
                            onChange={(e) => updateMedicine(index, 'morning', e.target.checked)}
                          />
                          Morning
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={med.afternoon}
                            onChange={(e) => updateMedicine(index, 'afternoon', e.target.checked)}
                          />
                          Afternoon
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={med.evening}
                            onChange={(e) => updateMedicine(index, 'evening', e.target.checked)}
                          />
                          Evening
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={med.night}
                            onChange={(e) => updateMedicine(index, 'night', e.target.checked)}
                          />
                          Night
                        </label>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>When to take</label>
                        <select
                          value={med.beforeMeal}
                          onChange={(e) => updateMedicine(index, 'beforeMeal', e.target.value === 'true')}
                        >
                          <option value="true">Before Meal</option>
                          <option value="false">After Meal</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Duration (days)</label>
                        <input
                          type="number"
                          value={med.duration}
                          onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Other Details</label>
                      <input
                        type="text"
                        value={med.otherDetails}
                        onChange={(e) => updateMedicine(index, 'otherDetails', e.target.value)}
                        placeholder="Additional instructions..."
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary">Save Prescription</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

