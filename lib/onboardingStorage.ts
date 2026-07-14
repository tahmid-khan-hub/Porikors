const ROLE_KEY = "onboarding:role"
const FORM_KEY = "onboarding:formData"

export type StoredRole = "teacher" | "student" | null;

export function getStoredRole(): StoredRole {
    if(typeof window === "undefined") return null;
    const value = sessionStorage.getItem(ROLE_KEY)
    return value === "teacher" || value === "student" ? value : null;
}

export function setStoredRole(role: StoredRole) {
    if(role) sessionStorage.setItem(ROLE_KEY, role);
    else sessionStorage.removeItem(ROLE_KEY)
}

export function getStoredField(name: string): string {
    if(typeof window === "undefined") return "";
    try {
        const data = JSON.parse(sessionStorage.getItem(FORM_KEY) ?? "{}")
        return data[name] ?? "";
    } catch {
        return "";
    }
}

export function setStoredField(name: string, value: string) {
    const data = JSON.parse(sessionStorage.getItem(FORM_KEY) ?? "{}");
    data[name] = value;
    sessionStorage.setItem(FORM_KEY, JSON.stringify(data));
}

export function clearOnboardingStorage() {
  sessionStorage.removeItem(ROLE_KEY);
  sessionStorage.removeItem(FORM_KEY);
}
