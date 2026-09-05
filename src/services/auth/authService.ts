import { User, Role } from "../../types";
import { DEMO_USERS } from "../../data/initialData";

const STORAGE_KEY_AUTH = "cleancity_auth_session_v2";

export interface LoginResult {
  success: boolean;
  message?: string;
  user?: User;
}

class AuthService {
  private currentUser: User | null = null;

  constructor() {
    this.loadSession();
  }

  private loadSession() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.isAuthenticated && parsed?.user) {
          this.currentUser = parsed.user;
          return;
        }
      }
      // Check legacy auth storage
      const legacy = localStorage.getItem("cleancity_auth_session_v1");
      if (legacy) {
        const parsed = JSON.parse(legacy);
        if (parsed?.isAuthenticated && parsed?.user) {
          this.currentUser = parsed.user;
          this.saveSession();
        }
      }
    } catch (e) {
      console.error("Failed to load auth session", e);
    }
  }

  private saveSession() {
    try {
      if (this.currentUser) {
        localStorage.setItem(
          STORAGE_KEY_AUTH,
          JSON.stringify({ isAuthenticated: true, user: this.currentUser })
        );
      } else {
        localStorage.removeItem(STORAGE_KEY_AUTH);
      }
    } catch (e) {
      console.error("Failed to persist auth session", e);
    }
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public getUserRole(): Role | null {
    return this.currentUser?.role || null;
  }

  public login(emailOrPhone: string, pass: string): LoginResult {
    const cleanKey = (emailOrPhone || "").trim().toLowerCase();
    const entry = DEMO_USERS[cleanKey];

    if (!entry) {
      return {
        success: false,
        message: "Invalid credentials. Please click one of the pre-filled demo accounts below for quick access.",
      };
    }

    if (entry.pass !== pass) {
      return {
        success: false,
        message: "Incorrect password. Please verify your credentials or use the one-click demo login buttons.",
      };
    }

    this.currentUser = entry.user;
    this.saveSession();
    return { success: true, user: entry.user };
  }

  public loginAsDemoRole(role: Role): LoginResult {
    let email = "citizen@cleancity.demo";
    if (role === "worker") email = "worker@cleancity.demo";
    else if (role === "admin") email = "admin@cleancity.demo";

    const entry = DEMO_USERS[email];
    if (entry) {
      this.currentUser = entry.user;
      this.saveSession();
      return { success: true, user: entry.user };
    }
    return { success: false, message: "Demo role not found." };
  }

  public logout(): void {
    this.currentUser = null;
    this.saveSession();
  }

  public canAccessRole(targetRole: Role): boolean {
    if (!this.currentUser) return false;
    if (this.currentUser.role === "admin") return true; // Admin can inspect all portals
    return this.currentUser.role === targetRole;
  }
}

export const authService = new AuthService();
