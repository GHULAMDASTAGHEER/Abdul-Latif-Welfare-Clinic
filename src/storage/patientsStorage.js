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
  if (!date) return; // require date for fast lookup
  const key = getDateKey(date);
  const list = (await localForage.getItem(key)) || [];
  const filtered = list.filter((p) => p.serialNo !== serialNo);
  await localForage.setItem(key, filtered);
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


