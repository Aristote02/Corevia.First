import {
  type Application,
  type ApplicationHistoryEntry,
  type AuthUser,
  type ContactMessage,
  type Testimonial,
  type UserProfile,
  type AdminStatus,
} from "./types";
import { getAuthMode, isCustomAuthEnabled, isSupabaseAuthEnabled } from "../auth-config";
import {
  getSupabaseAccessToken,
  resetPasswordWithSupabase,
  updatePasswordWithSupabase,
} from "../supabase";
import { apiFetch, clearTokens, getAccessToken, getRefreshToken, setTokens } from "./http";

interface AuthResponse {
  access_token: string;
  access_expires_at_utc: string;
  refresh_token: string;
  refresh_expires_at_utc: string;
  profile: UserProfileDto;
}

interface UserProfileDto {
  id: string;
  email: string;
  full_name: string;
  role: UserProfile["role"];
  phone: string | null;
  country: string | null;
  is_super_admin: boolean;
  created_at: string;
  updated_at: string;
}

interface ApplicationDto {
  id: string;
  application_number: string;
  full_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  service: string | null;
  message: string;
  status: string;
  admin_status: AdminStatus;
  admin_notes: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

interface ApplicationHistoryDto {
  id: string;
  old_status: string | null;
  new_status: string;
  notes: string | null;
  created_at: string;
  changed_by: string | null;
}

interface ContactDto {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  message: string;
  status: string;
  created_at: string;
}

interface TestimonialDto {
  id: string;
  student_name: string;
  country_from: string;
  destination_country: string;
  university: string;
  rating: number;
  testimonial_fr: string;
  testimonial_en: string;
  photo_url: string;
  year: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

interface AdminUserDto extends UserProfileDto {
  applications_count: number;
}

interface PagedResponse<T> {
  items: T[];
  page: number;
  page_size: number;
  total_count: number;
}

function mapProfile(dto: UserProfileDto): UserProfile {
  return {
    id: dto.id,
    email: dto.email,
    full_name: dto.full_name,
    role: dto.role,
    phone: dto.phone,
    country: dto.country,
    is_super_admin: dto.is_super_admin,
    created_at: dto.created_at,
    updated_at: dto.updated_at,
  };
}

function mapApplication(dto: ApplicationDto): Application {
  return {
    id: dto.id,
    application_number: dto.application_number,
    full_name: dto.full_name,
    email: dto.email,
    phone: dto.phone,
    country: dto.country,
    service: dto.service,
    message: dto.message,
    status: dto.status,
    admin_status: dto.admin_status,
    admin_notes: dto.admin_notes,
    created_at: dto.created_at,
    updated_at: dto.updated_at,
    user_id: dto.user_id,
  };
}

function mapContact(dto: ContactDto): ContactMessage {
  return {
    id: dto.id,
    full_name: dto.name,
    email: dto.email,
    phone: dto.phone,
    subject: null,
    message: dto.message,
    is_read: dto.status !== "nouveau",
    created_at: dto.created_at,
  };
}

function mapTestimonial(dto: TestimonialDto): Testimonial {
  return {
    id: dto.id,
    student_name: dto.student_name,
    country_from: dto.country_from,
    destination_country: dto.destination_country,
    university: dto.university,
    rating: dto.rating,
    testimonial_fr: dto.testimonial_fr,
    testimonial_en: dto.testimonial_en,
    year: dto.year,
    is_active: dto.is_active,
    is_featured: dto.is_featured,
    created_at: dto.created_at,
    user_id: null,
  };
}

function mapAdminUser(dto: AdminUserDto): UserProfile {
  return mapProfile(dto);
}

function authResultFromResponse(data: AuthResponse, error: string | null = null) {
  if (error) {
    return { user: null, profile: null, error };
  }
  setTokens(data.access_token, data.refresh_token);
  const profile = mapProfile(data.profile);
  return {
    user: { id: profile.id, email: profile.email } satisfies AuthUser,
    profile,
    error: null,
  };
}

export interface AuthResult {
  user: AuthUser | null;
  profile: UserProfile | null;
  error: string | null;
  /** Supabase sign-up when email confirmation is required before a session exists. */
  needsEmailConfirmation?: boolean;
}

export async function getCurrentProfile(): Promise<UserProfile | null> {
  if (!getAccessToken() && !getRefreshToken()) {
    return null;
  }

  try {
    const dto = await apiFetch<UserProfileDto>("/profile");
    return mapProfile(dto);
  } catch {
    return null;
  }
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
    const data = await apiFetch<AuthResponse>("/auth/sign-in", {
      method: "POST",
      auth: false,
      body: { email, password },
    });
    return authResultFromResponse(data);
  } catch (err) {
    return {
      user: null,
      profile: null,
      error: err instanceof Error ? err.message : "Sign in failed",
    };
  }
}

export async function signUp(
  email: string,
  password: string,
  fullName: string,
): Promise<AuthResult> {
  try {
    const data = await apiFetch<AuthResponse>("/auth/sign-up", {
      method: "POST",
      auth: false,
      body: { email, password, full_name: fullName },
    });
    return authResultFromResponse(data);
  } catch (err) {
    return {
      user: null,
      profile: null,
      error: err instanceof Error ? err.message : "Sign up failed",
    };
  }
}

export async function signOut(): Promise<void> {
  const refreshToken = localStorage.getItem("corevia-refresh-token");
  try {
    if (refreshToken && isCustomAuthEnabled()) {
      await apiFetch<void>("/auth/sign-out", {
        method: "POST",
        body: { refresh_token: refreshToken },
      });
    }
  } finally {
    clearTokens();
  }
}

export async function syncSupabaseSession(): Promise<UserProfile | null> {
  const accessToken = await getSupabaseAccessToken();
  if (!accessToken) return null;

  try {
    const data = await apiFetch<{ profile: UserProfileDto }>("/auth/supabase/sync", {
      method: "POST",
      auth: false,
      body: { access_token: accessToken },
    });
    return mapProfile(data.profile);
  } catch {
    return null;
  }
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (isSupabaseAuthEnabled() && getAuthMode() === "supabase") {
    await resetPasswordWithSupabase(email);
    return;
  }

  await apiFetch<void>("/auth/forgot-password", {
    method: "POST",
    auth: false,
    body: { email },
  });
}

export async function updatePassword(
  password: string,
  options?: { email?: string; token?: string },
): Promise<void> {
  if (isSupabaseAuthEnabled() && getAuthMode() === "supabase") {
    await updatePasswordWithSupabase(password);
    return;
  }

  if (!options?.email || !options?.token) {
    throw new Error("Invalid or expired reset link.");
  }

  await apiFetch<void>("/auth/reset-password", {
    method: "POST",
    auth: false,
    body: {
      email: options.email,
      token: options.token,
      new_password: password,
    },
  });
}

export async function updateProfile(
  patch: Partial<Pick<UserProfile, "full_name" | "phone" | "country">>,
): Promise<UserProfile | null> {
  const current = await getCurrentProfile();
  if (!current) return null;

  const dto = await apiFetch<UserProfileDto>("/profile", {
    method: "PUT",
    body: {
      full_name: patch.full_name ?? current.full_name,
      phone: patch.phone ?? current.phone,
      country: patch.country ?? current.country,
    },
  });
  return mapProfile(dto);
}

export interface ContactInput {
  full_name: string;
  email: string;
  phone?: string;
  country?: string;
  service?: string;
  message: string;
}

export async function submitContact(input: ContactInput): Promise<Application> {
  const dto = await apiFetch<ApplicationDto>("/applications/submit", {
    method: "POST",
    body: {
      full_name: input.full_name,
      email: input.email,
      phone: input.phone ?? null,
      country: input.country ?? "",
      service: input.service ?? "",
      message: input.message,
    },
  });
  return mapApplication(dto);
}

async function fetchAllApplications(): Promise<Application[]> {
  const pageSize = 200;
  let page = 1;
  const all: Application[] = [];

  while (true) {
    const res = await apiFetch<PagedResponse<ApplicationDto>>(
      `/admin/applications?page=${page}&pageSize=${pageSize}`,
    );
    all.push(...res.items.map(mapApplication));
    if (all.length >= res.total_count || res.items.length === 0) break;
    page += 1;
  }

  return all;
}

export async function listApplications(): Promise<Application[]> {
  return fetchAllApplications();
}

export async function listMyApplications(): Promise<Application[]> {
  const items = await apiFetch<ApplicationDto[]>("/applications/mine");
  return items.map(mapApplication);
}

export async function updateApplicationStatus(
  id: string,
  newStatus: AdminStatus,
  notes?: string,
): Promise<Application | null> {
  const dto = await apiFetch<ApplicationDto>(`/admin/applications/${id}/status`, {
    method: "PATCH",
    body: { admin_status: newStatus, notes: notes ?? null },
  });
  return mapApplication(dto);
}

export async function updateApplicationNotes(id: string, notes: string): Promise<void> {
  await apiFetch<ApplicationDto>(`/admin/applications/${id}/notes`, {
    method: "PATCH",
    body: { admin_notes: notes },
  });
}

export async function deleteApplication(id: string): Promise<void> {
  await apiFetch<void>(`/admin/applications/${id}`, { method: "DELETE" });
}

export async function getApplicationHistory(id: string): Promise<ApplicationHistoryEntry[]> {
  const items = await apiFetch<ApplicationHistoryDto[]>(`/admin/applications/${id}/history`);
  return items.map((h) => ({
    id: h.id,
    application_id: id,
    old_status: h.old_status,
    new_status: h.new_status,
    notes: h.notes,
    created_at: h.created_at,
    changed_by: h.changed_by,
  }));
}

async function fetchAllContacts(): Promise<ContactMessage[]> {
  const pageSize = 200;
  let page = 1;
  const all: ContactMessage[] = [];

  while (true) {
    const res = await apiFetch<PagedResponse<ContactDto>>(
      `/admin/contacts?page=${page}&pageSize=${pageSize}`,
    );
    all.push(...res.items.map(mapContact));
    if (all.length >= res.total_count || res.items.length === 0) break;
    page += 1;
  }

  return all;
}

export async function listMessages(): Promise<ContactMessage[]> {
  return fetchAllContacts();
}

export async function markMessageRead(id: string, read = true): Promise<void> {
  await apiFetch<ContactDto>(`/admin/contacts/${id}/status`, {
    method: "PATCH",
    body: { status: read ? "lu" : "nouveau" },
  });
}

export async function deleteMessage(id: string): Promise<void> {
  await apiFetch<void>(`/admin/contacts/${id}`, { method: "DELETE" });
}

export async function listApprovedTestimonials(): Promise<Testimonial[]> {
  const items = await apiFetch<TestimonialDto[]>("/testimonials");
  return items.map(mapTestimonial);
}

export async function listAllTestimonials(): Promise<Testimonial[]> {
  const items = await apiFetch<TestimonialDto[]>("/admin/testimonials");
  return items.map(mapTestimonial);
}

export interface TestimonialInput {
  student_name: string;
  country_from: string;
  destination_country: string;
  university: string;
  rating: number;
  testimonial_fr: string;
  testimonial_en?: string;
}

export async function submitTestimonial(input: TestimonialInput): Promise<Testimonial> {
  const dto = await apiFetch<TestimonialDto>("/testimonials", {
    method: "POST",
    body: {
      country_from: input.country_from,
      destination_country: input.destination_country,
      university: input.university,
      rating: input.rating,
      testimonial_fr: input.testimonial_fr,
      testimonial_en: input.testimonial_en || input.testimonial_fr,
    },
  });
  return mapTestimonial(dto);
}

export async function toggleTestimonialActive(_id: string, _isActive: boolean): Promise<void> {
  await apiFetch<TestimonialDto>(`/admin/testimonials/${_id}/toggle-active`, {
    method: "PATCH",
  });
}

export async function toggleTestimonialFeatured(_id: string, _isFeatured: boolean): Promise<void> {
  await apiFetch<TestimonialDto>(`/admin/testimonials/${_id}/toggle-featured`, {
    method: "PATCH",
  });
}

export async function deleteTestimonial(id: string): Promise<void> {
  await apiFetch<void>(`/admin/testimonials/${id}`, { method: "DELETE" });
}

export async function listUsers(): Promise<UserProfile[]> {
  const items = await apiFetch<AdminUserDto[]>("/admin/users");
  return items.map(mapAdminUser);
}

export async function setUserRole(id: string, role: UserProfile["role"]): Promise<void> {
  const user = (await listUsers()).find((u) => u.id === id);
  if (!user) return;

  await apiFetch("/admin/users/update", {
    method: "POST",
    body: {
      user_id: id,
      full_name: user.full_name,
      is_super_admin: user.is_super_admin,
      role,
    },
  });
}

export async function deleteUser(id: string): Promise<void> {
  await apiFetch(`/admin/users/${id}`, { method: "DELETE" });
}
