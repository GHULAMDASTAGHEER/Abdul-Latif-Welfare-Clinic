import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/PrinterSetup.css";

export default function PrinterSetup() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    paperSize: localStorage.getItem('paperSize') || 'A4',
    orientation: localStorage.getItem('orientation') || 'portrait',
    margins: localStorage.getItem('margins') || 'default',
    fontSize: localStorage.getItem('fontSize') || 'medium',
    includeHeader: localStorage.getItem('includeHeader') !== 'false',
    includeFooter: localStorage.getItem('includeFooter') !== 'false',
    clinicName: localStorage.getItem('clinicName') || 'Abdul Latif Welfare Clinic',
    clinicAddress: localStorage.getItem('clinicAddress') || '',
    clinicPhone: localStorage.getItem('clinicPhone') || '',
  });

  const handleSave = () => {
    Object.keys(settings).forEach(key => {
      localStorage.setItem(key, settings[key]);
    });
    alert('Printer settings saved successfully!');
  };

  const handleTestPrint = () => {
    window.print();
  };

  return (
    <div className="printer-setup-container">
      <div className="page-header">
        <div>
          <h1>Printer Setup</h1>
          <p>Configure print settings and preferences</p>
        </div>
        <button onClick={() => navigate("/dashboard")} className="btn-secondary">Back to Dashboard</button>
      </div>

      <div className="settings-container">
        <div className="settings-section">
          <h3>Clinic Information</h3>
          <div className="form-group">
            <label>Clinic Name</label>
            <input
              type="text"
              value={settings.clinicName}
              onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Clinic Address</label>
            <input
              type="text"
              value={settings.clinicAddress}
              onChange={(e) => setSettings({ ...settings, clinicAddress: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Clinic Phone</label>
            <input
              type="text"
              value={settings.clinicPhone}
              onChange={(e) => setSettings({ ...settings, clinicPhone: e.target.value })}
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>Print Settings</h3>
          <div className="form-group">
            <label>Paper Size</label>
            <select
              value={settings.paperSize}
              onChange={(e) => setSettings({ ...settings, paperSize: e.target.value })}
            >
              <option value="A4">A4 (210 x 297 mm)</option>
              <option value="Letter">Letter (8.5 x 11 in)</option>
              <option value="Thermal">Thermal Receipt (80mm)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Orientation</label>
            <select
              value={settings.orientation}
              onChange={(e) => setSettings({ ...settings, orientation: e.target.value })}
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
          <div className="form-group">
            <label>Margins</label>
            <select
              value={settings.margins}
              onChange={(e) => setSettings({ ...settings, margins: e.target.value })}
            >
              <option value="default">Default</option>
              <option value="narrow">Narrow</option>
              <option value="wide">Wide</option>
              <option value="none">None</option>
            </select>
          </div>
          <div className="form-group">
            <label>Font Size</label>
            <select
              value={settings.fontSize}
              onChange={(e) => setSettings({ ...settings, fontSize: e.target.value })}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h3>Print Elements</h3>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={settings.includeHeader}
                onChange={(e) => setSettings({ ...settings, includeHeader: e.target.checked })}
              />
              Include Header
            </label>
          </div>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={settings.includeFooter}
                onChange={(e) => setSettings({ ...settings, includeFooter: e.target.checked })}
              />
              Include Footer
            </label>
          </div>
        </div>

        <div className="preview-section">
          <h3>Print Preview</h3>
          <div className="preview-box">
            <div className="preview-content">
              {settings.includeHeader && (
                <div className="preview-header">
                  <h2>{settings.clinicName}</h2>
                  <p>{settings.clinicAddress}</p>
                  <p>{settings.clinicPhone}</p>
                </div>
              )}
              <div className="preview-body" style={{ fontSize: settings.fontSize === 'small' ? '12px' : settings.fontSize === 'large' ? '16px' : '14px' }}>
                <h3>Sample Invoice</h3>
                <p><strong>Invoice No:</strong> INV-123456</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Customer:</strong> Sample Customer</p>
                <div className="preview-table">
                  <div><strong>Item</strong></div>
                  <div><strong>Qty</strong></div>
                  <div><strong>Price</strong></div>
                  <div>Medicine A</div>
                  <div>2</div>
                  <div>Rs. 100</div>
                  <div>Medicine B</div>
                  <div>1</div>
                  <div>Rs. 50</div>
                </div>
                <p><strong>Total: Rs. 150</strong></p>
              </div>
              {settings.includeFooter && (
                <div className="preview-footer">
                  <p>Thank you for your visit!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="actions-section">
          <button onClick={handleSave} className="btn-primary">Save Settings</button>
          <button onClick={handleTestPrint} className="btn-test">Test Print</button>
        </div>
      </div>
    </div>
  );
}

