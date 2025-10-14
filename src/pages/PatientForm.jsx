import React, { useState, useEffect } from "react";
import "../css/patientForm.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPatient } from "../redux/slices/patientSlice";
import { addPatient } from "../storage/patientsStorage";

export default function PatientForm() {
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get current date-time in DD-MM-YYYY HH:mm:ss format
  const getNowDateTime = () => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`;
  };

  // Get next serial number
  const getNextSerialNo = () => {
    const lastSerial = parseInt(localStorage.getItem('lastSerialNo') || '0');
    return lastSerial + 1;
  };

  // Get next free fee serial number
  const getNextFreeFeeSerialNo = () => {
    const lastFreeSerial = parseInt(localStorage.getItem('lastFreeFeeSerialNo') || '0');
    return lastFreeSerial + 1;
  };

  // Get next token number (resets after 24 hours)
  const getNextTokenNo = () => {
    const lastTokenDate = localStorage.getItem('lastTokenDate');
    const lastToken = parseInt(localStorage.getItem('lastTokenNo') || '0');
    const today = getTodayDate();

    // If date has changed (24 hours passed), reset token to 1
    if (lastTokenDate !== today) {
      return 1;
    }
    
    // Otherwise increment
    return lastToken + 1;
  };

  const [doctorSlot, setDoctorSlot] = useState(
    localStorage.getItem('doctorSlot') || 'morning'
  );

  const [formData, setFormData] = useState({
    serialNo: getNextSerialNo(),
    tokenNo: getNextTokenNo(),
    date: getTodayDate(), // Set default to today's date
    patientName: "",
    doctorName: "", // Will be set based on slot selection
    fee: localStorage.getItem('fee') || "", // Preserve fee
    freeFeeSerialNo: "",
    isFree: false,
  });

  // Update doctor name based on slot selection
  useEffect(() => {
    const morningDoctor = localStorage.getItem('morningDoctor') || "";
    const eveningDoctor = localStorage.getItem('eveningDoctor') || "";
    
    const selectedDoctor = doctorSlot === 'morning' ? morningDoctor : eveningDoctor;
    setFormData(prev => ({ ...prev, doctorName: selectedDoctor }));
  }, [doctorSlot]);

  const [showToast, setShowToast] = useState(false);
  const [printData, setPrintData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Print receipt function
  const printReceipt = (data) => {
    setPrintData(data);
    setTimeout(() => {
      window.print();
      setPrintData(null);
    }, 100);
  };

  // Preview receipt function
  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Save fee to localStorage when changed
    if (name === 'fee') {
      localStorage.setItem('fee', value);
    }
  };

  const handleDoctorSlotChange = (slot) => {
    setDoctorSlot(slot);
    localStorage.setItem('doctorSlot', slot);
  };

  const handleDoctorNameChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, doctorName: value });
    
    // Save to the appropriate slot in localStorage
    if (doctorSlot === 'morning') {
      localStorage.setItem('morningDoctor', value);
    } else {
      localStorage.setItem('eveningDoctor', value);
    }
  };

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setFormData({ 
      ...formData, 
      isFree: isChecked,
      fee: isChecked ? "" : (localStorage.getItem('fee') || ""),
      freeFeeSerialNo: isChecked ? getNextFreeFeeSerialNo() : "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save the current form data for printing
    const dataToSave = { 
      ...formData,
      printedAt: getNowDateTime(),
      feePaid: formData.isFree ? 0 : formData.fee,
    };
    
    // Save to localForage (IndexedDB) only
    addPatient(dataToSave);
    
    // Optionally still mirror to Redux for immediate UI (commented to keep Redux light)
    // dispatch(createPatient(dataToSave));
    
    // Update serial numbers and token in localStorage
    localStorage.setItem('lastSerialNo', formData.serialNo.toString());
    localStorage.setItem('lastTokenNo', formData.tokenNo.toString());
    localStorage.setItem('lastTokenDate', formData.date);
    
    if (formData.isFree && formData.freeFeeSerialNo) {
      localStorage.setItem('lastFreeFeeSerialNo', formData.freeFeeSerialNo.toString());
    }
    
    // Print receipt
    printReceipt(dataToSave);
    
    // Get the doctor name for the current slot
    const morningDoctor = localStorage.getItem('morningDoctor') || "";
    const eveningDoctor = localStorage.getItem('eveningDoctor') || "";
    const currentDoctor = doctorSlot === 'morning' ? morningDoctor : eveningDoctor;
    
    // Calculate next token number
    const currentDate = formData.date;
    const nextTokenNo = currentDate === getTodayDate() 
      ? parseInt(formData.tokenNo) + 1 
      : 1;
    
    setFormData({
      serialNo: getNextSerialNo() + 1, // Next serial number
      tokenNo: nextTokenNo, // Next token number
      date: getTodayDate(), // Reset to today's date after save
      patientName: "",
      doctorName: currentDoctor, // Keep doctor name based on slot
      fee: localStorage.getItem('fee') || "", // Keep fee
      freeFeeSerialNo: "",
      isFree: false,
    });
    
    // Show success toast
    setShowToast(true);
    
    // Auto hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <>
      <div className="form-container">
        <div className="form-card">
          <h2 className="form-title">Abdul Latif Welfare Clinic</h2>

          <form onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <div className="form-section">
              <h3 className="section-title">Basic Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Serial Number (Auto)</label>
                  <input
                    type="text"
                    name="serialNo"
                    placeholder="Auto-generated"
                    value={formData.serialNo}
                    readOnly
                    style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                  />
                </div>
                <div className="form-group">
                  <label>Token No (Auto)</label>
                  <input
                    type="number"
                    name="tokenNo"
                    placeholder="Auto-generated"
                    value={formData.tokenNo}
                    onChange={handleChange}
                    required
                    style={{ backgroundColor: '#f9f9f9' }}
                    title="Auto-generated token number (can be edited manually)"
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Patient & Doctor Information Section */}
            <div className="form-section">
              <h3 className="section-title">Patient & Doctor Details</h3>
              
              {/* Patient Name */}
              <div className="form-row">
                <div className="form-group">
                  <label>Patient Name</label>
                  <input
                    type="text"
                    name="patientName"
                    placeholder="Enter patient name"
                    value={formData.patientName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Doctor Slot Selection */}
              <div className="form-row" style={{ marginTop: '15px' }}>
                <div className="form-group" style={{ width: '100%' }}>
                  <label>Doctor Slot</label>
                  <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                    <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="doctorSlot"
                        value="morning"
                        checked={doctorSlot === 'morning'}
                        onChange={() => handleDoctorSlotChange('morning')}
                        style={{ marginRight: '8px' }}
                      />
                      <span>Morning Slot</span>
                    </label>
                    <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="doctorSlot"
                        value="evening"
                        checked={doctorSlot === 'evening'}
                        onChange={() => handleDoctorSlotChange('evening')}
                        style={{ marginRight: '8px' }}
                      />
                      <span>Evening Slot</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Doctor Name */}
              <div className="form-row">
                <div className="form-group">
                  <label>Doctor Name ({doctorSlot === 'morning' ? 'Morning' : 'Evening'})</label>
                  <input
                    type="text"
                    name="doctorName"
                    placeholder={`Enter ${doctorSlot} doctor name`}
                    value={formData.doctorName}
                    onChange={handleDoctorNameChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Fee Information Section */}
            <div className="form-section">
              <h3 className="section-title">Fee Information</h3>
              
              {/* Free Patient Checkbox */}
              <div className="checkbox-container">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isFree"
                    checked={formData.isFree}
                    onChange={handleCheckboxChange}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">Free Patient (No Fee Required)</span>
                </label>
              </div>

              {/* Fee Fields */}
              <div className="form-row">
                {/* Regular Fee - Show only when NOT free */}
                {!formData.isFree && (
                  <div className="form-group">
                    <label>Fee Amount</label>
                    <input
                      type="number"
                      name="fee"
                      placeholder="Enter fee amount"
                      value={formData.fee}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                {/* Free Fee Serial No - Show only when free */}
                {formData.isFree && (
                  <div className="form-group">
                    <label>Free Fee Serial No (Auto)</label>
                    <input
                      type="text"
                      name="freeFeeSerialNo"
                      placeholder="Auto-generated"
                      value={formData.freeFeeSerialNo}
                      readOnly
                      style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="button-group">
              <button type="submit" className="btn btn-primary">
                <span>💾</span>
                Save Patient
              </button>

              <button
                type="button"
                className="btn btn-preview"
                onClick={handlePreview}
              >
                <span>👁️</span>
                Preview Receipt
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/patient-list")}
              >
                <span>📋</span>
                View Patient Lists
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="toast-container">
          <div className="toast toast-success">
            <div className="toast-icon">
              <span>✅</span>
            </div>
            <div className="toast-content">
              <h4>Patient Saved Successfully!</h4>
              <p>Patient record has been added to the system.</p>
            </div>
            <button 
              className="toast-close"
              onClick={() => setShowToast(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Preview Receipt Modal */}
      {showPreview && (
        <div className="preview-overlay" onClick={() => setShowPreview(false)}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="preview-close"
              onClick={() => setShowPreview(false)}
            >
              ✕
            </button>
            
            <div className="preview-receipt">
              <div className="receipt-header">
                <p className="receipt-urdu">براہِ کرم اپنی باری کا انتظار کریں</p>
                <h2>Abdul Lateef Welfare Clinic</h2>
                <div className="receipt-divider">────────────────────────</div>
              </div>

              <div className="token-display">
                <div className="token-label">Token #</div>
                <div className="token-number">{formData.tokenNo || '—'}</div>
              </div>

              <div className="receipt-body">
                <div className="receipt-row">
                  <span className="receipt-label">Patient Name</span>
                  <span className="receipt-value">{formData.patientName || 'N/A'}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Date / Time</span>
                  <span className="receipt-value">{getNowDateTime()}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Fee Paid</span>
                  <span className="receipt-value">Rs. {formData.isFree ? 0 : (formData.fee || 0)}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Serial No</span>
                  <span className="receipt-value">{formData.serialNo || 'N/A'}</span>
                </div>
              </div>

              <div className="receipt-footer">
                <div className="receipt-divider">────────────────────────</div>
                <p className="receipt-note">Doctor: {formData.doctorName || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Receipt - Hidden on screen, visible only when printing */}
      {printData && (
        <div className="print-receipt">
          <div className="receipt-header">
            <p className="receipt-urdu">براہِ کرم اپنی باری کا انتظار کریں</p>
            <h2>Abdul Lateef Welfare Clinic</h2>
            <div className="receipt-divider">────────────────────────</div>
          </div>

          <div className="token-display">
            <div className="token-label">Token #</div>
            <div className="token-number">{printData.tokenNo}</div>
          </div>

          <div className="receipt-body">
            <div className="receipt-row">
              <span className="receipt-label">Patient Name</span>
              <span className="receipt-value">{printData.patientName}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Date / Time</span>
              <span className="receipt-value">{printData.printedAt}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Fee Paid</span>
              <span className="receipt-value">Rs. {printData.feePaid}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Serial No</span>
              <span className="receipt-value">{printData.serialNo}</span>
            </div>
          </div>

          <div className="receipt-footer">
            <div className="receipt-divider">────────────────────────</div>
            <p className="receipt-note">Doctor: {printData.doctorName}</p>
          </div>
        </div>
      )}
    </>
  );
}
