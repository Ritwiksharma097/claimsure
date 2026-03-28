import { clearToken, getToken, isTokenExpired } from "@/lib/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getAuthHeader(): Record<string, string> {
  const token = getToken();
  if (!token) return {};
  if (isTokenExpired(token)) {
    clearToken();
    return {};
  }
  return { Authorization: `Bearer ${token}` };
}

function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

export type Scheme = {
  id: number;
  scheme: string;
  type: string;
  coverage: string;
  data_status: string;
};

export type MasterRecord = {
  id: number;
  scheme: string;
  record_type: string;
  specialty?: string | null;
  package_code?: string | null;
  package_name?: string | null;
  procedure_code?: string | null;
  procedure_name?: string | null;
  rate_primary?: string | number | null;
  rate_secondary?: string | number | null;
  rate_tertiary?: string | number | null;
  notes?: string | null;
  los?: string | null;
  source?: string | null;
};

export type ChecklistResult = {
  case_id?: number | null;
  best_match: {
    id: number;
    scheme: string;
    record_type: string;
    specialty?: string | null;
    package_code?: string | null;
    package_name?: string | null;
    procedure_name?: string | null;
  } | null;
  readiness_score: number;
  mandatory_total: number;
  mandatory_checked: number;
  checklist: Array<{
    stage?: string | null;
    document_proof: string;
    status?: string | null;
    operational_note?: string | null;
    matched_from: string;
    checked: boolean;
  }>;
};

export type ClaimDeskCase = {
  id: number;
  patient_id?: string | null;
  scheme: string;
  search?: string | null;
  checked_documents: string[];
  readiness_score: number;
  mandatory_total: number;
  mandatory_checked: number;
};

export type Patient = {
  id: number;
  patient_id: string;
  full_name: string;
  mobile: string;
  aadhaar_last4?: string | null;
  dob?: string | null;
  gender?: string | null;
  city?: string | null;
  scheme: string;
  visit_count: number;
  last_visit_date?: string | null;
  agent_name?: string | null;
  govt_id_type?: string | null;
  govt_id_number?: string | null;
  jan_aadhaar?: string | null;
};

export type Preauth = {
  id: number;
  patient_id: string;
  diagnosis?: string | null;
  test_name?: string | null;
  hospital_name?: string | null;
  doctor_name?: string | null;
  preauth_status: string;
  preauth_amount?: string | number | null;
  preauth_ref_no?: string | null;
  created_at?: string | null;
};

export type AdminUpdateSource = {
  id: number;
  scheme: string;
  category?: string | null;
  source_name: string;
  update_type?: string | null;
  frequency?: string | null;
  status?: string | null;
  notes?: string | null;
};

export type ChangeLogItem = {
  id: number;
  scheme: string;
  summary?: string | null;
  effective_date?: string | null;
  source_ref?: string | null;
  record_count: number;
  created_by?: string | null;
};

export type PatientFile = {
  id: number;
  patient_id: string;
  original_name: string;
  content_type?: string | null;
  size_bytes: number;
  category?: string | null;
  uploaded_by?: string | null;
};

export async function fetchSchemes() {
  const res = await fetch(buildUrl("/schemes"), {
    cache: "no-store",
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new ApiError("Failed to fetch schemes", res.status);
  return (await res.json()) as Scheme[];
}

export async function fetchMasterRecords(params: {
  scheme?: string;
  recordType?: string;
  specialty?: string;
  q?: string;
  limit?: number;
  offset?: number;
}) {
  const res = await fetch(
    buildUrl("/masters/records", {
      scheme: params.scheme,
      recordType: params.recordType,
      specialty: params.specialty,
      q: params.q,
      limit: params.limit || 100,
      offset: params.offset || 0,
    }),
    { cache: "no-store", headers: { ...getAuthHeader() } }
  );
  if (!res.ok) throw new ApiError("Failed to fetch records", res.status);
  return (await res.json()) as { items: MasterRecord[]; total: number };
}

export async function fetchClaimChecklist(payload: {
  scheme: string;
  search?: string;
  patient_id?: string;
  case_id?: number;
  checked_documents?: string[];
}) {
  const res = await fetch(buildUrl("/claimdesk/checklist"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) throw new ApiError("Failed to fetch checklist", res.status);
  return (await res.json()) as ChecklistResult;
}

export async function fetchClaimDeskCase(params: {
  patientId: string;
  scheme: string;
  search?: string;
}) {
  const res = await fetch(
    buildUrl("/claimdesk/case", {
      patientId: params.patientId,
      scheme: params.scheme,
      search: params.search || "",
    }),
    { cache: "no-store", headers: { ...getAuthHeader() } }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new ApiError("Failed to fetch claim desk case", res.status);
  return (await res.json()) as ClaimDeskCase | null;
}

export async function login(username: string, password: string) {
  const body = new URLSearchParams();
  body.set("username", username);
  body.set("password", password);
  const res = await fetch(buildUrl("/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  if (!res.ok) throw new ApiError("Invalid login", res.status);
  return (await res.json()) as { access_token: string; token_type: string };
}

export async function fetchPatients(params?: { q?: string; scheme?: string; limit?: number; offset?: number }) {
  const res = await fetch(
    buildUrl("/patients", {
      q: params?.q,
      scheme: params?.scheme,
      limit: params?.limit || 100,
      offset: params?.offset || 0,
    }),
    { cache: "no-store", headers: { ...getAuthHeader() } }
  );
  if (!res.ok) throw new ApiError("Failed to fetch patients", res.status);
  return (await res.json()) as Patient[];
}

export async function createPatient(payload: {
  full_name: string;
  mobile: string;
  scheme: string;
  aadhaar_last4?: string;
  dob?: string;
  gender?: string;
  city?: string;
  agent_name?: string;
  govt_id_type?: string;
  govt_id_number?: string;
  jan_aadhaar?: string;
  visit_date?: string;
  notes?: string;
}) {
  const res = await fetch(buildUrl("/patients"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) throw new ApiError("Failed to save patient", res.status);
  return (await res.json()) as Patient;
}

export async function updatePatient(
  patientId: string,
  payload: {
    full_name?: string;
    mobile?: string;
    scheme?: string;
    aadhaar_last4?: string;
    dob?: string;
    gender?: string;
    city?: string;
    agent_name?: string;
    govt_id_type?: string;
    govt_id_number?: string;
    jan_aadhaar?: string;
    notes?: string;
  }
) {
  const res = await fetch(buildUrl(`/patients/${patientId}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) throw new ApiError("Failed to update patient", res.status);
  return (await res.json()) as Patient;
}

export async function fetchPreauths(params?: { patient_id?: string; preauthStatus?: string; limit?: number; offset?: number }) {
  const res = await fetch(
    buildUrl("/preauths", {
      patient_id: params?.patient_id,
      preauthStatus: params?.preauthStatus,
      limit: params?.limit || 100,
      offset: params?.offset || 0,
    }),
    { cache: "no-store", headers: { ...getAuthHeader() } }
  );
  if (!res.ok) throw new ApiError("Failed to fetch preauths", res.status);
  return (await res.json()) as Preauth[];
}

export async function createPreauth(payload: {
  patient_id: string;
  diagnosis?: string;
  test_name?: string;
  hospital_name?: string;
  doctor_name?: string;
  preauth_status?: string;
  preauth_amount?: number;
  preauth_date?: string;
  preauth_ref_no?: string;
  insurer_name?: string;
  tpa_company?: string;
  policy_type?: string;
  bill_amount?: number;
  claim_amount?: number;
  notes?: string;
}) {
  const res = await fetch(buildUrl("/preauths"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) throw new ApiError("Failed to create preauth", res.status);
  return (await res.json()) as Preauth;
}

export async function updatePreauth(
  preauthId: number,
  payload: {
    diagnosis?: string;
    test_name?: string;
    hospital_name?: string;
    doctor_name?: string;
    preauth_status?: string;
    preauth_amount?: number;
    preauth_date?: string;
    preauth_ref_no?: string;
    insurer_name?: string;
    tpa_company?: string;
    policy_type?: string;
    bill_amount?: number;
    claim_amount?: number;
    notes?: string;
  }
) {
  const res = await fetch(buildUrl(`/preauths/${preauthId}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) throw new ApiError("Failed to update preauth", res.status);
  return (await res.json()) as Preauth;
}

export async function fetchAdminSources() {
  const res = await fetch(buildUrl("/admin/updates/sources"), {
    cache: "no-store",
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new ApiError("Failed to fetch admin sources", res.status);
  return (await res.json()) as AdminUpdateSource[];
}

export async function createAdminSource(payload: {
  scheme: string;
  category?: string;
  source_name: string;
  update_type?: string;
  frequency?: string;
  status?: string;
  notes?: string;
}) {
  const res = await fetch(buildUrl("/admin/updates/sources"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) throw new ApiError("Failed to create source", res.status);
  return (await res.json()) as AdminUpdateSource;
}

export async function fetchChangeLog() {
  const res = await fetch(buildUrl("/admin/updates/changelog"), {
    cache: "no-store",
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new ApiError("Failed to fetch changelog", res.status);
  return (await res.json()) as ChangeLogItem[];
}

export async function publishAdminUpdate(payload: {
  scheme: string;
  summary?: string;
  effective_date?: string;
  source_ref?: string;
  records: Array<Record<string, unknown>>;
}) {
  const res = await fetch(buildUrl("/admin/updates/publish"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) throw new ApiError("Failed to publish update", res.status);
  return (await res.json()) as ChangeLogItem;
}

export async function previewAdminUpdate(payload: {
  scheme: string;
  summary?: string;
  effective_date?: string;
  source_ref?: string;
  records: Array<Record<string, unknown>>;
}) {
  const res = await fetch(buildUrl("/admin/updates/preview"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) throw new ApiError("Failed to preview update", res.status);
  return (await res.json()) as {
    ok: boolean;
    count: number;
    schemes: string[];
    sample: Array<Record<string, unknown>>;
    replace_count: number;
    insert_count: number;
    message?: string | null;
  };
}

export async function fetchPatientFiles(patientId: string) {
  const res = await fetch(buildUrl(`/patients/${patientId}/files`), {
    cache: "no-store",
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new ApiError("Failed to fetch patient files", res.status);
  return (await res.json()) as PatientFile[];
}

export async function uploadPatientFiles(patientId: string, files: File[], category = "Case Document") {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  const res = await fetch(buildUrl(`/patients/${patientId}/files`, { category }), {
    method: "POST",
    headers: { ...getAuthHeader() },
    body: form,
  });
  if (!res.ok) throw new ApiError("Failed to upload patient files", res.status);
  return (await res.json()) as PatientFile[];
}

export async function deletePatientFile(patientId: string, fileId: number) {
  const res = await fetch(buildUrl(`/patients/${patientId}/files/${fileId}`), {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new ApiError("Failed to delete file", res.status);
}
