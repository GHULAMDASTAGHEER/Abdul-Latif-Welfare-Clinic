import React, { useState, useMemo } from "react";
import "../css/PatientList.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPatientsByDate, getRecentPatients, clearAllPatientsLF, deletePatientBySerial, exportAllData, importAllData } from "../storage/patientsStorage";
import PatientTable from "../components/PatientTable";
import { clearAllPatients, deletePatient } from "../redux/slices/patientSlice";

export default function PatientList() {
  const patientData = useSelector((state) => state.patients); // legacy (not used for loading)
  const [selectedDate, setSelectedDate] = useState("");
  const [recentLimit, setRecentLimit] = useState(200);
  const [searchQuery, setSearchQuery] = useState("");
  const [list, setList] = useState([]);
  const [showDataModal, setShowDataModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("patientData==>>>", patientData);

  // Load from localForage
  React.useEffect(() => {
    (async () => {
      if (selectedDate) {
        const rows = await getPatientsByDate(selectedDate);
        setList(rows);
      } else {
        const recent = await getRecentPatients(recentLimit);
        setList(recent);
      }
    })();
  }, [selectedDate, recentLimit]);

  const filteredPatients = useMemo(() => {
    if (!searchQuery) return list;
    const q = searchQuery.trim().toLowerCase();
    return list.filter((p) => {
      const name = String(p.patientName || "").toLowerCase();
      const serial = String(p.serialNo || "").toLowerCase();
      return name.includes(q) || serial.includes(q);
    });
  }, [list, searchQuery]);

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
      clearAllPatientsLF();
      setSelectedDate("");
      setList([]);
    }
  };

  // Export helpers
  // const downloadFile = (filename, mime, text) => {
  //   const blob = new Blob([text], { type: mime });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = filename;
  //   document.body.appendChild(a);
  //   a.click();
  //   a.remove();
  //   URL.revokeObjectURL(url);
  // };

  // const exportJSON = () => {
  //   const pretty = JSON.stringify(patientData, null, 2);
  //   downloadFile(`patients_${Date.now()}.json`, 'application/json', pretty);
  // };

  // const exportCSV = () => {
  //   const cols = [
  //     'serialNo','tokenNo','date','patientName','doctorName','fee','isFree','freeFeeSerialNo','freeFee'
  //   ];
  //   const header = cols.join(',');
  //   const rows = patientData.map(p => (
  //     cols.map(k => {
  //       const v = p[k] ?? '';
  //       const s = String(v).replace(/"/g, '""');
  //       return `"${s}"`;
  //     }).join(',')
  //   ));
  //   const csv = [header, ...rows].join('\n');
  //   downloadFile(`patients_${Date.now()}.csv`, 'text/csv;charset=utf-8', csv);
  // };

  // View Data helpers (show currently loaded list)
  const prettyJSON = useMemo(() => JSON.stringify(list, null, 2), [list]);
  const copyJSON = async () => {
    try {
      await navigator.clipboard.writeText(prettyJSON);
      alert('Copied to clipboard');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePatient = async (serialNo) => {
    // Find the patient to get their date
    const patient = list.find(p => p.serialNo === serialNo);
    if (!patient) return;
    
    // Delete using the patient's actual date
    await deletePatientBySerial(serialNo, patient.date);
    
    // Reload the list based on current filter
    if (selectedDate) {
      const rows = await getPatientsByDate(selectedDate);
      setList(rows);
    } else {
      const recent = await getRecentPatients(recentLimit);
      setList(recent);
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportAllData();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clinic-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('Data exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed: ' + error.message);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await importAllData(data);
      
      if (selectedDate) {
        const rows = await getPatientsByDate(selectedDate);
        setList(rows);
      } else {
        const recent = await getRecentPatients(recentLimit);
        setList(recent);
      }
      
      alert('Data imported successfully!');
      e.target.value = '';
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed: ' + error.message);
      e.target.value = '';
    }
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
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={handleExport}
              style={{
                padding: "clamp(8px, 2vw, 10px) clamp(15px, 3vw, 20px)",
                fontSize: "clamp(0.85rem, 2vw, 1rem)",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                whiteSpace: "nowrap",
              }}
            >
              📥 Export Backup
            </button>
            
            <label
              style={{
                padding: "clamp(8px, 2vw, 10px) clamp(15px, 3vw, 20px)",
                fontSize: "clamp(0.85rem, 2vw, 1rem)",
                backgroundColor: "#0ea5e9",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                whiteSpace: "nowrap",
                display: "inline-block",
              }}
            >
              📤 Import Backup
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                style={{ display: 'none' }}
              />
            </label>
            
            {list.length > 0 && (
              <>
                {/* <button
                  onClick={() => setShowDataModal(true)}
                  style={{
                    padding: "clamp(8px, 2vw, 10px) clamp(15px, 3vw, 20px)",
                    fontSize: "clamp(0.85rem, 2vw, 1rem)",
                    backgroundColor: "#64748b",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                  }}
                >
                  View Data
                </button> */}
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
              </>
            )}
          </div>
        </div>
        <div className="filter-bar" style={{ 
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

          {/* Recent-limit selector removed per request */}

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or serial no"
            style={{
              padding: "clamp(8px, 2vw, 10px)",
              fontSize: "clamp(0.85rem, 2vw, 1rem)",
              borderRadius: "5px",
              border: "1px solid #ccc",
              outline: "none",
              flex: "1 1 260px",
              minWidth: 200,
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
            Showing {filteredPatients.length} {selectedDate ? 'records for date' : 'recent records'}
          </span>
        </div>
      </div>

      {/* Patient Table */}
      <PatientTable 
        patientData={filteredPatients} 
        onClose={handleClose}
        onDelete={handleDeletePatient}
      />

      {/* Data Modal */}
      {showDataModal && (
        <div 
          onClick={() => setShowDataModal(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 10, width: 'min(900px, 92vw)',
              maxHeight: '85vh', display: 'flex', flexDirection: 'column'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
              <strong>Stored Patients ({list.length})</strong>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={copyJSON} style={{ padding: '6px 10px', background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Copy JSON</button>
                <button onClick={() => setShowDataModal(false)} style={{ padding: '6px 10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Close</button>
              </div>
            </div>
            <pre style={{ margin: 0, padding: 16, overflow: 'auto', fontSize: 12, lineHeight: 1.4 }}>
{prettyJSON}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

