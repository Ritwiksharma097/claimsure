const STORAGE_KEY = "claimsure_patient_token";
const PATIENT_ID_KEY = "claimsure_patient_id";
const PATIENT_NAME_KEY = "claimsure_patient_name";

export function getPatientToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function setPatientSession(token: string, patientId: string, fullName: string): void {
  localStorage.setItem(STORAGE_KEY, token);
  localStorage.setItem(PATIENT_ID_KEY, patientId);
  localStorage.setItem(PATIENT_NAME_KEY, fullName);
}

export function clearPatientSession(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(PATIENT_ID_KEY);
  localStorage.removeItem(PATIENT_NAME_KEY);
}

export function getPatientId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PATIENT_ID_KEY);
}

export function getPatientName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PATIENT_NAME_KEY);
}

export function hasValidPatientToken(): boolean {
  const token = getPatientToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function getPatientAuthHeader(): Record<string, string> {
  const token = getPatientToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
