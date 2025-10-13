import React, { useState } from "react";
import "../css/patientForm.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPatient } from "../redux/slices/patientSlice";

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

  const [formData, setFormData] = useState({
    serialNo: "",
    tokenNo: "",
    date: getTodayDate(), // Set default to today's date
    patientName: "",
    doctorName: localStorage.getItem('doctorName') || "", // Preserve doctor name
    fee: localStorage.getItem('fee') || "", // Preserve fee
    freeFee: "",
    freeFeeSerialNo: "",
    isFree: false,
  });

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
    
    // Save doctor name and fee to localStorage when changed
    if (name === 'doctorName') {
      localStorage.setItem('doctorName', value);
    }
    if (name === 'fee') {
      localStorage.setItem('fee', value);
    }
  };

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setFormData({ 
      ...formData, 
      isFree: isChecked,
      fee: isChecked ? "" : formData.fee,
      freeFee: isChecked ? formData.freeFee : "",
      freeFeeSerialNo: isChecked ? formData.freeFeeSerialNo : "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save the current form data for printing
    const dataToSave = { 
      ...formData,
      printedAt: getNowDateTime(),
      feePaid: formData.isFree ? (formData.freeFee || 0) : formData.fee,
    };
    
    dispatch(createPatient(dataToSave));
    
    // Print receipt
    printReceipt(dataToSave);
    
    setFormData({
      serialNo: "",
      tokenNo: "",
      date: getTodayDate(), // Reset to today's date after save
      patientName: "",
      doctorName: localStorage.getItem('doctorName') || "", // Keep doctor name
      fee: localStorage.getItem('fee') || "", // Keep fee
      freeFee: "",
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
                  <label>Serial Number</label>
                  <input
                    type="text"
                    name="serialNo"
                    placeholder="Enter serial number"
                    value={formData.serialNo}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Token No</label>
                  <input
                    type="text"
                    name="tokenNo"
                    placeholder="Enter token no"
                    value={formData.tokenNo}
                    onChange={handleChange}
                    required
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
                <div className="form-group">
                  <label>Doctor Name</label>
                  <input
                    type="text"
                    name="doctorName"
                    placeholder="Enter doctor name"
                    value={formData.doctorName}
                    onChange={handleChange}
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

                {/* Free Fee Fields - Show only when free */}
                {formData.isFree && (
                  <>
                    <div className="form-group">
                      <label>Free Fee Serial No</label>
                      <input
                        type="text"
                        name="freeFeeSerialNo"
                        placeholder="Enter free fee serial no"
                        value={formData.freeFeeSerialNo}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Free Fee Amount (Optional)</label>
                      <input
                        type="number"
                        name="freeFee"
                        placeholder="Enter free fee amount"
                        value={formData.freeFee}
                        onChange={handleChange}
                      />
                    </div>
                  </>
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
                  <span className="receipt-value">Rs. {formData.isFree ? (formData.freeFee || 0) : (formData.fee || 0)}</span>
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
