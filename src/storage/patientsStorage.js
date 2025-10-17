import localForage from "localforage";

const DATES_INDEX_KEY = "patients:dates-index"; // stores array of date strings

// Ensure store is ready
localForage.config({ name: "welfare-clinic", storeName: "patients-store" });

const getDateKey = (date) => `patients:${date}`;

export async function addPatient(record) {
  const dateKey = getDateKey(record.date);
  const existing = (await localForage.getItem(dateKey)) || [];
  existing.push(record);
  await localForage.setItem(dateKey, existing);

  const dates = (await localForage.getItem(DATES_INDEX_KEY)) || [];
  if (!dates.includes(record.date)) {
    dates.push(record.date);
    await localForage.setItem(DATES_INDEX_KEY, dates);
  }
}

export async function getPatientsByDate(date) {
  if (!date) return [];
  return (await localForage.getItem(getDateKey(date))) || [];
}

export async function getRecentPatients(limit = 100) {
  const dates = (await localForage.getItem(DATES_INDEX_KEY)) || [];
  const sortedDates = [...dates].sort((a, b) => (a < b ? 1 : -1));
  const out = [];
  for (const d of sortedDates) {
    const list = (await localForage.getItem(getDateKey(d))) || [];
    for (const r of list) {
      out.push(r);
      if (out.length >= limit) return out;
    }
  }
  return out;
}

export async function deletePatientBySerial(serialNo, date) {
  // If date is provided, delete from that specific date
  if (date) {
    const key = getDateKey(date);
    const list = (await localForage.getItem(key)) || [];
    const filtered = list.filter((p) => p.serialNo !== serialNo);
    await localForage.setItem(key, filtered);
    return;
  }
  
  // If no date provided, search through all dates to find and delete the patient
  const dates = (await localForage.getItem(DATES_INDEX_KEY)) || [];
  for (const d of dates) {
    const key = getDateKey(d);
    const list = (await localForage.getItem(key)) || [];
    const patient = list.find((p) => p.serialNo === serialNo);
    
    if (patient) {
      // Found the patient, delete it
      const filtered = list.filter((p) => p.serialNo !== serialNo);
      await localForage.setItem(key, filtered);
      return;
    }
  }
}

export async function clearAllPatientsLF() {
  const dates = (await localForage.getItem(DATES_INDEX_KEY)) || [];
  for (const d of dates) {
    await localForage.removeItem(getDateKey(d));
  }
  await localForage.removeItem(DATES_INDEX_KEY);
}

export async function getStorageEstimate() {
  if (navigator.storage && navigator.storage.estimate) {
    return await navigator.storage.estimate();
  }
  return { usage: null, quota: null };
}

export async function exportAllData() {
  const dates = (await localForage.getItem(DATES_INDEX_KEY)) || [];
  const allData = {};
  
  for (const date of dates) {
    const patients = await localForage.getItem(getDateKey(date));
    if (patients && patients.length > 0) {
      allData[date] = patients;
    }
  }
  
  return {
    exportDate: new Date().toISOString(),
    datesIndex: dates,
    patients: allData
  };
}

export async function importAllData(importData) {
  if (!importData || !importData.patients) {
    throw new Error("Invalid import data");
  }
  
  await clearAllPatientsLF();
  
  const dates = importData.datesIndex || Object.keys(importData.patients);
  
  for (const date of dates) {
    const patients = importData.patients[date];
    if (patients && Array.isArray(patients)) {
      await localForage.setItem(getDateKey(date), patients);
    }
  }
  
  await localForage.setItem(DATES_INDEX_KEY, dates);
  
  if (importData.patients && Object.keys(importData.patients).length > 0) {
    const allPatients = Object.values(importData.patients).flat();
    const maxSerial = Math.max(...allPatients.map(p => p.serialNo || 0));
    const maxFreeFeeSerial = Math.max(...allPatients.filter(p => p.freeFeeSerialNo).map(p => p.freeFeeSerialNo || 0));
    
    if (maxSerial > 0) {
      localStorage.setItem('lastSerialNo', maxSerial.toString());
    }
    if (maxFreeFeeSerial > 0) {
      localStorage.setItem('lastFreeFeeSerialNo', maxFreeFeeSerial.toString());
    }
  }
}


