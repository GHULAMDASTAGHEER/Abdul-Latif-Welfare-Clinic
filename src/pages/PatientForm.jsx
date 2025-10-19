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
    const morningDoctor = localStorage.getItem('morningDoctor') || "";
    const eveningDoctor = localStorage.getItem('eveningDoctor') || "";
    
    const selectedDoctor = doctorSlot === 'morning' ? morningDoctor : eveningDoctor;
    const tokenNo = getNextTokenNo(doctorSlot);
    
    setFormData(prev => ({ 
      ...prev, 
      doctorName: selectedDoctor,
      tokenNo: tokenNo
    }));
  }, [doctorSlot]);

  const [showToast, setShowToast] = useState(false);
  const [printData, setPrintData] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const printReceipt = (data) => {
    const receiptContent = `
      براہِ کرم اپنی باری کا انتظار کریں
      Abdul Lateef Welfare Clinic
      ────────────────────────
      
      Token # ${data.tokenNo}
      
      Patient Name: ${data.patientName}
      Date / Time: ${data.printedAt}
      Fee Paid: Rs. ${data.feePaid}
      Serial No: ${data.serialNo}
      
      ────────────────────────
      Doctor: ${data.doctorName}
    `;
    
    // Create a hidden iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    iframe.style.width = '80mm';
    iframe.style.height = 'auto';
    
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          @page { size: 80mm auto; margin: 0; }
          body { 
            font-family: monospace; 
            font-size: 12px; 
            margin: 0; 
            padding: 5px;
            white-space: pre-line;
            text-align: center;
          }
        </style>
      </head>
      <body>${receiptContent}</body>
      </html>
    `);
    iframeDoc.close();
    
    setTimeout(() => {
      iframe.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 100);
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
    
    const tokenDateKey = doctorSlot === 'morning' ? 'lastMorningTokenDate' : 'lastEveningTokenDate';
    const tokenNoKey = doctorSlot === 'morning' ? 'lastMorningTokenNo' : 'lastEveningTokenNo';
    
    localStorage.setItem(tokenNoKey, formData.tokenNo.toString());
    localStorage.setItem(tokenDateKey, formData.date);
    
    if (formData.isFree && formData.freeFeeSerialNo) {
      localStorage.setItem('lastFreeFeeSerialNo', formData.freeFeeSerialNo.toString());
    }
    
    // Print receipt
    printReceipt(dataToSave);
    
    const morningDoctor = localStorage.getItem('morningDoctor') || "";
    const eveningDoctor = localStorage.getItem('eveningDoctor') || "";
    const currentDoctor = doctorSlot === 'morning' ? morningDoctor : eveningDoctor;
    
    const currentDate = formData.date;
    const nextTokenNo = currentDate === getTodayDate() 
      ? parseInt(formData.tokenNo) + 1 
      : getNextTokenNo(doctorSlot);
    
    setFormData({
      serialNo: getNextSerialNo() + 1,
      tokenNo: nextTokenNo,
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

    </>
  );
}
