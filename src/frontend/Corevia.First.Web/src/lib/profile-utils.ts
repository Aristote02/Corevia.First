import type { UserProfile } from "./api/types";

/** True when we should prompt the user to confirm or complete their display name. */
export function needsProfileCompletion(profile: UserProfile): boolean {
  const name = profile.full_name?.trim();
  if (!name || name.length < 2 || name === "User") return true;

  const localPart = profile.email.split("@")[0]?.trim().toLowerCase();
  return !!localPart && name.toLowerCase() === localPart;
}
