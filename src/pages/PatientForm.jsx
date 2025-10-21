import React, { useState, useEffect, useRef } from "react";
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

  // Get current time in 12-hour format with AM/PM
  const getCurrentTime12Hour = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    const displayHours = String(hours).padStart(2, '0');
    
    return `${displayHours}:${minutes}:${seconds} ${ampm}`;
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

  const getNextTokenNo = (slot) => {
    const tokenDateKey = slot === 'morning' ? 'lastMorningTokenDate' : 'lastEveningTokenDate';
    const tokenNoKey = slot === 'morning' ? 'lastMorningTokenNo' : 'lastEveningTokenNo';
    
    const lastTokenDate = localStorage.getItem(tokenDateKey);
    const lastToken = parseInt(localStorage.getItem(tokenNoKey) || '0');
    const today = getTodayDate();

    if (lastTokenDate !== today) {
      return 1;
    }
    
    return lastToken + 1;
  };

  const [doctorSlot, setDoctorSlot] = useState(
    localStorage.getItem('doctorSlot') || 'morning'
  );

  const initialSlot = localStorage.getItem('doctorSlot') || 'morning';
  
  const [morningToken, setMorningToken] = useState(getNextTokenNo('morning'));
  const [eveningToken, setEveningToken] = useState(getNextTokenNo('evening'));
  
  const [formData, setFormData] = useState({
    serialNo: getNextSerialNo(),
    tokenNo: getNextTokenNo(initialSlot),
    date: getTodayDate(),
    patientName: "",
    doctorName: "",
    fee: localStorage.getItem('fee') || "",
    freeFeeSerialNo: "",
    isFree: false,
  });

  useEffect(() => {
    // Check if date has changed and reset tokens
    const today = getTodayDate();
    const lastMorningDate = localStorage.getItem('lastMorningTokenDate');
    const lastEveningDate = localStorage.getItem('lastEveningTokenDate');
    
    if (lastMorningDate !== today) {
      setMorningToken(1);
      localStorage.setItem('lastMorningTokenNo', '0');
    } else {
      setMorningToken(getNextTokenNo('morning'));
    }
    
    if (lastEveningDate !== today) {
      setEveningToken(1);
      localStorage.setItem('lastEveningTokenNo', '0');
    } else {
      setEveningToken(getNextTokenNo('evening'));
    }
    
    const morningDoctor = localStorage.getItem('morningDoctor') || "";
    const eveningDoctor = localStorage.getItem('eveningDoctor') || "";
    
    const selectedDoctor = doctorSlot === 'morning' ? morningDoctor : eveningDoctor;
    const tokenNo = doctorSlot === 'morning' ? morningToken : eveningToken;
    
    setFormData(prev => ({ 
      ...prev, 
      doctorName: selectedDoctor,
      tokenNo: tokenNo
    }));
  }, [doctorSlot, morningToken, eveningToken]);

  const [showToast, setShowToast] = useState(false);
  const [printData, setPrintData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const patientNameRef = useRef(null);

  const printReceipt = (data) => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=300,height=400');
    
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt Print</title>
        <style>
          @page {
            size: A4;
          }
          @media print {
            body {
              margin: 0;
              padding: 0;
              width: 100%;
            }
          }
          body {
            font-family: 'Courier New', monospace;
            font-size: 13px;
            margin: 0;
            padding: 0;
            width: 100%;
            line-height: 1.0;
            text-align: center;
            color: #000000;
          }
          .receipt-content {
            white-space: pre-line;
            text-align: center;
            color: #000000;
          }
          .token-number {
            font-size: 20px;
            font-weight: bold;
            margin: 2px 0;
            color: #000000;
          }
          .clinic-name {
            font-size: 18px;
            font-weight: bold;
            margin: 1px 0;
            color: #000000;
          }
          .urdu-text {
            font-size: 15px;
            margin: 0;
            color: #000000;
          }
          .divider {
            margin: 1px 0;
            font-size: 12px;
            color: #000000;
          }
          .patient-info {
            text-align: left;
            margin: 2px 0;
            font-size: 12px;
            color: #000000;
          }
          .doctor-info {
            text-align: left;
            margin-top: 2px;
            font-size: 12px;
            color: #000000;
          }
        </style>
      </head>
      <body>
        <div class="receipt-content">
          <div class="urdu-text">براہِ کرم اپنی باری کا انتظار کریں</div>
          <div class="clinic-name">Abdul Lateef Welfare Clinic</div>
          <div class="divider">────────────────────────</div>
          <div class="token-number">Token # ${data.tokenNo}</div>
          <div class="patient-info">
            Patient Name: ${data.patientName}<br>
            Date: ${data.date}<br>
            Time: ${getCurrentTime12Hour()}<br>
            Fee Paid: Rs. ${data.feePaid}<br>
            Serial No: ${data.serialNo}<br>
            Doctor: ${data.doctorName}
          </div>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 500);
            }, 500);
          };
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Save fee to localStorage when changed
    if (name === 'fee') {
      localStorage.setItem('fee', value);
    }
    
    // Update slot token when main tokenNo is changed
    if (name === 'tokenNo') {
      const tokenValue = parseInt(value) || 1;
      if (doctorSlot === 'morning') {
        setMorningToken(tokenValue);
      } else {
        setEveningToken(tokenValue);
      }
    }
  };

  const handleDoctorSlotChange = (slot) => {
    setDoctorSlot(slot);
    localStorage.setItem('doctorSlot', slot);
  };

  const handleMorningTokenChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setMorningToken(value);
    if (doctorSlot === 'morning') {
      setFormData({ ...formData, tokenNo: value });
    }
  };

  const handleEveningTokenChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setEveningToken(value);
    if (doctorSlot === 'evening') {
      setFormData({ ...formData, tokenNo: value });
    }
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
    
    // Validate required fields
    if (!formData.patientName.trim()) {
      alert('Patient Name is required!');
      return;
    }
    
    if (!formData.doctorName.trim()) {
      alert('Doctor Name is required!');
      return;
    }
    
    if (!formData.isFree && (!formData.fee || formData.fee <= 0)) {
      alert('Fee Amount is required for paid patients!');
      return;
    }
    
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
    
    localStorage.setItem('lastSerialNo', formData.serialNo.toString());
    
    // Update the appropriate slot token
    if (doctorSlot === 'morning') {
      const newMorningToken = morningToken + 1;
      setMorningToken(newMorningToken);
      localStorage.setItem('lastMorningTokenNo', morningToken.toString());
      localStorage.setItem('lastMorningTokenDate', formData.date);
    } else {
      const newEveningToken = eveningToken + 1;
      setEveningToken(newEveningToken);
      localStorage.setItem('lastEveningTokenNo', eveningToken.toString());
      localStorage.setItem('lastEveningTokenDate', formData.date);
    }
    
    if (formData.isFree && formData.freeFeeSerialNo) {
      localStorage.setItem('lastFreeFeeSerialNo', formData.freeFeeSerialNo.toString());
    }
    
    // Print receipt
    printReceipt(dataToSave);
    
    const morningDoctor = localStorage.getItem('morningDoctor') || "";
    const eveningDoctor = localStorage.getItem('eveningDoctor') || "";
    const currentDoctor = doctorSlot === 'morning' ? morningDoctor : eveningDoctor;
    
    setFormData({
      serialNo: getNextSerialNo() + 1,
      tokenNo: doctorSlot === 'morning' ? morningToken + 1 : eveningToken + 1,
      date: getTodayDate(),
      patientName: "",
      doctorName: currentDoctor,
      fee: localStorage.getItem('fee') || "",
      freeFeeSerialNo: "",
      isFree: false,
    });
    
    // Show success toast
    setShowToast(true);
    
    // Auto hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
    
    // Focus on patient name field for next entry
    setTimeout(() => {
      if (patientNameRef.current) {
        patientNameRef.current.focus();
      }
    }, 100);
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
                    type="text"
                    name="tokenNo"
                    placeholder="Total Tokens"
                    value={`${morningToken + eveningToken}`}
                    readOnly
                    style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                    title="Total Tokens"
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
                    ref={patientNameRef}
                    required
                  />
                </div>
              </div>

              {/* Doctor Slot Selection */}
              <div className="form-row" style={{ marginTop: '15px' }}>
                <div className="form-group" style={{ width: '100%'  }}>
                  <label>Doctor Slot</label>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                    <div style={{ flex: 1 }}>
                      <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '10px' }}>
                        <input
                          type="radio"
                          name="doctorSlot"
                          value="morning"
                          checked={doctorSlot === 'morning'}
                          onChange={() => handleDoctorSlotChange('morning')}
                          style={{ marginRight: '8px' }}
                        />
                        <span>Morning Slot Token</span>
                      </label>
                      <input
                        type="number"
                        value={morningToken}
                        onChange={handleMorningTokenChange}
                        placeholder="Morning Token"
                        min="1"
                        readOnly
                        style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' ,width: '90%' }}
                      />
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '10px' }}>
                        <input
                          type="radio"
                          name="doctorSlot"
                          value="evening"
                          checked={doctorSlot === 'evening'}
                          onChange={() => handleDoctorSlotChange('evening')}
                          style={{ marginRight: '8px' }}
                        />
                        <span>Evening Slot Token</span>
                      </label>
                      <input
                        type="number"
                        value={eveningToken}
                        onChange={handleEveningTokenChange}
                        placeholder="Evening Token"
                        min="1"
                        readOnly
                        style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' ,width: '91%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Doctor Name */}
              <div className="form-row" style={{ marginTop: '20px' }}>
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

              {/* <button
                type="button"
                className="btn btn-preview"
                onClick={() => setShowPreview(true)}
              >
                <span>👁️</span>
                Show Preview
              </button> */}

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

      {/* Preview Modal */}
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

    </>
  );
}
