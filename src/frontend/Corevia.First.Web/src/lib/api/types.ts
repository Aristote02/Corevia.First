// ============================================================================
// COREVIA FIRST — Data model & types
// ----------------------------------------------------------------------------
// These interfaces describe the data the app consumes. They mirror the original
// backend schema. The actual data access lives in `client.ts`, which currently
// returns mock data. Wire your own backend by implementing the functions there.
// ============================================================================

export type Lang = "fr" | "en";

export type UserRole = "admin" | "client";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone: string | null;
  country: string | null;
  is_super_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
}

// ---------------------------------------------------------------------------
// Applications (visa / orientation requests)
// ---------------------------------------------------------------------------

export interface Application {
  id: string;
  application_number: string;
  full_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  service: string | null;
  message: string;
  /** Client-facing coarse status. */
  status: string;
  /** Internal admin workflow status (see ADMIN_STATUSES). */
  admin_status: AdminStatus;
  admin_notes: string;
  created_at: string;
  updated_at: string;
  user_id: string | null;
}

export interface ApplicationHistoryEntry {
  id: string;
  application_id: string;
  old_status: string | null;
  new_status: string;
  notes: string | null;
  created_at: string;
  changed_by: string | null;
}

// ---------------------------------------------------------------------------
// Contact messages
// ---------------------------------------------------------------------------

export interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export interface Testimonial {
  id: string;
  /** Display name (taken from the submitter's profile). */
  student_name: string;
  country_from: string;
  destination_country: string;
  university: string;
  rating: number;
  testimonial_fr: string;
  testimonial_en: string;
  year: number;
  /** Visible publicly once an admin approves it. */
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  user_id: string | null;
}

// ---------------------------------------------------------------------------
// Admin status workflow
// ---------------------------------------------------------------------------

export type AdminStatus =
  | "nouveau"
  | "pas_de_reponse"
  | "attente_documents"
  | "documents_envoyes"
  | "attente_universite"
  | "invitation"
  | "preparation_voyage"
  | "arrive_finalise"
  | "en_cours"
  | "cloture";

export const ADMIN_STATUSES: AdminStatus[] = [
  "nouveau",
  "pas_de_reponse",
  "attente_documents",
  "documents_envoyes",
  "attente_universite",
  "invitation",
  "preparation_voyage",
  "arrive_finalise",
];

export const ADMIN_STATUS_COLORS: Record<string, string> = {
  nouveau: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  pas_de_reponse: "bg-zinc-500/20 text-zinc-300 border-zinc-500/40",
  attente_documents: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  documents_envoyes: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  attente_universite: "bg-violet-500/20 text-violet-300 border-violet-500/40",
  invitation: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
  preparation_voyage: "bg-teal-500/20 text-teal-300 border-teal-500/40",
  arrive_finalise: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  en_cours: "bg-sky-600/20 text-sky-300 border-sky-600/40",
  cloture: "bg-zinc-700/30 text-zinc-300 border-zinc-600/40",
};

/** Allowed forward/backward transitions between admin statuses. */
export const ALLOWED_TRANSITIONS: Record<string, AdminStatus[]> = {
  nouveau: ["pas_de_reponse", "attente_documents"],
  pas_de_reponse: ["attente_documents", "nouveau"],
  attente_documents: ["documents_envoyes", "pas_de_reponse"],
  documents_envoyes: ["attente_universite"],
  attente_universite: ["invitation", "attente_documents"],
  invitation: ["preparation_voyage"],
  preparation_voyage: ["arrive_finalise"],
  arrive_finalise: ["preparation_voyage"],
};

/** Maps an admin status to the coarse client-facing status group. */
export function coarseStatus(admin: AdminStatus): "nouveau" | "en_cours" | "cloture" {
  if (admin === "nouveau") return "nouveau";
  if (admin === "arrive_finalise" || admin === "cloture") return "cloture";
  return "en_cours";
}

/** Coarse status filter used by the admin dashboard. */
export type FilterKey = "all" | "nouveau" | "en_cours" | "cloture";