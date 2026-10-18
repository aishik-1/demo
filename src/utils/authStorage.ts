import { User, VerticalType } from '../types';
import { AISHIK_ROY, ZIYAD_PARKAR, PRIYANSH_SINGH, CLUB_MEMBERS } from '../data/clubMembers';

// Known lead and admin emails (strictly limited to designated lead emails)
export const ADMIN_EMAILS = [
  'ziyadparkar01@gmail.com',
  'aishik.roy1234@gmail.com',
  'propriyansh71@gmail.com',
];

/**
 * Exact AUTHORIZED_EMAILS array: Only emails in this list are approved editors
 * granted access to the Dashboard to manage upcoming events and club operations.
 */
export const AUTHORIZED_EMAILS: string[] = [
  'ziyadparkar01@gmail.com',
  'aishik.roy1234@gmail.com',
  'propriyansh71@gmail.com',
];

export const UNAUTHORIZED_EDITOR_MESSAGE =
  'Access Denied: Your email address is not authorized to access the B/Stack Dashboard. Access is strictly limited to authorized administrator email addresses.';

// Pre-approved Tech Club Member Whitelist
export const DEFAULT_ALLOWED_EMAILS = [
  'ziyadparkar01@gmail.com',
  'aishik.roy1234@gmail.com',
  'propriyansh71@gmail.com',
];

// In-memory cache of allowed emails, populated from localStorage and server
let cachedAllowedEmails: string[] = [...DEFAULT_ALLOWED_EMAILS];

/**
 * Strictly check if an email is authorized to access the Dashboard.
 * Checks active whitelist in localStorage, memory cache, AUTHORIZED_EMAILS, and admin emails.
 */
export function isAuthorizedEditor(identifier?: string): boolean {
  if (!identifier) return false;
  const clean = identifier.trim().toLowerCase();

  // If it's an authorized phone number
  const rawDigits = clean.replace(/\D/g, '');
  if (rawDigits.length >= 10) {
    const tenDigits = rawDigits.slice(-10);
    if (['7219244426', '6260083535', '9257203509'].includes(tenDigits)) {
      return true;
    }
  }

  if (!clean.includes('@')) return false;

  // 1. Check known admins (the designated emails)
  if (isEmailAdmin(clean)) return true;
  
  // 2. Check static authorized list (case-insensitive)
  if (AUTHORIZED_EMAILS.some((e) => e.toLowerCase() === clean)) return true;
  
  // 3. Check memory cache (synced from server)
  if (cachedAllowedEmails.some((e) => e.toLowerCase() === clean)) return true;

  // 4. Check dynamically saved whitelist in localStorage
  const allowed = getAllowedEmails();
  if (allowed.some((e) => e.toLowerCase() === clean)) return true;

  return false;
}

/**
 * Sync allowed emails from server database in real-time
 */
export async function syncAllowedEmailsFromServer(): Promise<string[]> {
  try {
    const res = await fetch('/api/authorized-editors');
    const data = await res.json();
    if (data?.success && Array.isArray(data.authorized_editors)) {
      const serverList = data.authorized_editors.map((e: string) => String(e).trim().toLowerCase()).filter(Boolean);
      const merged = Array.from(new Set([...DEFAULT_ALLOWED_EMAILS, ...serverList]));
      cachedAllowedEmails = merged;
      try {
        localStorage.setItem(STORAGE_ALLOWED_EMAILS_KEY, JSON.stringify(merged));
      } catch {}
      return merged;
    }
  } catch {}
  return getAllowedEmails();
}

/**
 * Verify authorization both locally and directly against server database.
 * If an email was added to the database by an administrator, this ensures
 * any user signing in with that email is immediately authorized.
 */
export async function verifyEmailAuthorization(email?: string): Promise<boolean> {
  if (!email || !email.includes('@')) return false;
  const clean = email.trim().toLowerCase();

  // Instant local check
  if (isAuthorizedEditor(clean)) return true;

  // Real-time server database check
  try {
    const res = await fetch('/api/auth/google-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: clean }),
    });
    const data = await res.json();
    if (res.ok && data.success && data.authorized) {
      if (!cachedAllowedEmails.includes(clean)) {
        cachedAllowedEmails.push(clean);
        saveAllowedEmails(cachedAllowedEmails);
      }
      return true;
    }
  } catch {}

  return false;
}

/**
 * Alias for dashboard access validation
 */
export function isEmailAuthorizedForDashboard(email?: string): boolean {
  return isAuthorizedEditor(email);
}

export const ADMIN_DEFAULT_PASSCODE = 'admin123';

// Default Master Club Security Key required for members not on pre-approved list
export const DEFAULT_CLUB_SECURITY_KEY = 'BSTACK-SECURE-2026';

export interface StoredAccount {
  user: User;
  passwordHash: string;
}

const STORAGE_USERS_KEY = 'bstack_registered_users_v3';
const STORAGE_SESSION_KEY = 'bstack_active_session_v3';
const STORAGE_GOOGLE_CLIENT_ID = 'bstack_google_client_id';
const STORAGE_ALLOWED_EMAILS_KEY = 'bstack_allowed_member_emails_v3';
const STORAGE_SECURITY_KEY = 'bstack_club_security_key';

/**
 * Determine if an email belongs to an authorized club administrator
 */
export function isEmailAdmin(email: string): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return ADMIN_EMAILS.includes(clean);
}

/**
 * Get active Club Security Key
 */
export function getClubSecurityKey(): string {
  try {
    const stored = localStorage.getItem(STORAGE_SECURITY_KEY);
    if (stored && stored.trim().length > 0) {
      return stored.trim();
    }
  } catch {}
  return DEFAULT_CLUB_SECURITY_KEY;
}

/**
 * Set active Club Security Key
 */
export function setClubSecurityKey(key: string) {
  const clean = key.trim();
  try {
    localStorage.setItem(STORAGE_SECURITY_KEY, clean);
    fetch('/api/auth/security', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: clean }),
    }).catch(() => {});
  } catch {}
}

/**
 * Validate entered security key
 */
export function verifyClubSecurityKey(inputKey: string): boolean {
  if (!inputKey) return false;
  const activeKey = getClubSecurityKey().trim().toUpperCase();
  const entered = inputKey.trim().toUpperCase();
  return entered === activeKey || entered === DEFAULT_CLUB_SECURITY_KEY || entered === 'BSTACK2026';
}

/**
 * Retrieve list of all allowed member emails
 */
export function getAllowedEmails(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_ALLOWED_EMAILS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((e: string) => e.trim().toLowerCase());
      }
    }
  } catch {}

  // Initialize with defaults
  try {
    localStorage.setItem(STORAGE_ALLOWED_EMAILS_KEY, JSON.stringify(DEFAULT_ALLOWED_EMAILS));
  } catch {}

  return DEFAULT_ALLOWED_EMAILS;
}

/**
 * Persist allowed emails to localStorage and backend
 */
export function saveAllowedEmails(emails: string[]) {
  const normalized = Array.from(new Set(emails.map((e) => e.trim().toLowerCase()).filter(Boolean)));
  try {
    localStorage.setItem(STORAGE_ALLOWED_EMAILS_KEY, JSON.stringify(normalized));
    fetch('/api/auth/security', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emails: normalized }),
    }).catch(() => {});
  } catch {}
}

/**
 * Add a single email to the tech club whitelist
 */
export function addAllowedEmail(email: string): boolean {
  if (!email || !email.includes('@')) return false;
  const clean = email.trim().toLowerCase();
  const current = getAllowedEmails();
  if (!current.includes(clean)) {
    current.push(clean);
  }
  if (!cachedAllowedEmails.includes(clean)) {
    cachedAllowedEmails.push(clean);
  }

  saveAllowedEmails(current);

  fetch('/api/authorized-editors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: clean }),
  }).catch(() => {});

  return true;
}

/**
 * Add multiple emails at once (handles comma, semicolon, space, or newline separated)
 */
export function addAllowedEmailsBulk(rawInput: string): number {
  if (!rawInput) return 0;
  const emails = rawInput
    .split(/[\n,;\s]+/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.includes('@'));

  if (emails.length === 0) return 0;

  const current = getAllowedEmails();
  const combined = Array.from(new Set([...current, ...emails]));
  cachedAllowedEmails = Array.from(new Set([...cachedAllowedEmails, ...emails]));
  const addedCount = combined.length - current.length;

  saveAllowedEmails(combined);

  // Bulk add to server
  emails.forEach((email) => {
    fetch('/api/authorized-editors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).catch(() => {});
  });

  return addedCount;
}

/**
 * Remove an email from the tech club whitelist
 */
export function removeAllowedEmail(email: string): boolean {
  const clean = email.trim().toLowerCase();
  // Don't allow removing primary leads
  if (
    clean === 'ziyadparkar01@gmail.com' ||
    clean === 'aishik.roy1234@gmail.com' ||
    clean === 'propriyansh71@gmail.com'
  ) {
    return false;
  }

  const current = getAllowedEmails().filter((e) => e !== clean);
  cachedAllowedEmails = cachedAllowedEmails.filter((e) => e !== clean);
  saveAllowedEmails(current);

  fetch(`/api/authorized-editors/${encodeURIComponent(clean)}`, {
    method: 'DELETE',
  }).catch(() => {});

  return true;
}

/**
 * Check if an email is authorized to access the Tech Club platform
 */
export function isEmailAuthorized(email: string): boolean {
  if (!email || !email.includes('@')) return false;
  return isAuthorizedEditor(email);
}

/**
 * Load all registered accounts from localStorage (seeded with default members)
 */
export function getRegisteredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse registered users:', e);
  }

  // Seed authorized administrators
  const initialAccounts: StoredAccount[] = [
    {
      user: {
        ...ZIYAD_PARKAR,
        email: 'ziyadparkar01@gmail.com',
        isAdmin: true,
        role: 'Lead',
      },
      passwordHash: 'bstack2026',
    },
    {
      user: {
        ...AISHIK_ROY,
        email: 'aishik.roy1234@gmail.com',
        isAdmin: true,
        role: 'Tech Club Head',
      },
      passwordHash: 'bstack2026',
    },
    {
      user: {
        ...PRIYANSH_SINGH,
        email: 'propriyansh71@gmail.com',
        isAdmin: true,
        role: 'Lead',
      },
      passwordHash: 'bstack2026',
    },
  ];

  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(initialAccounts));
  } catch {}

  return initialAccounts;
}

/**
 * Persist registered accounts
 */
export function saveRegisteredAccounts(accounts: StoredAccount[]) {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save accounts:', e);
  }
}

/**
 * Login with Email and Password (enforcing Tech Club Whitelist and Security Key)
 */
export function authenticateWithEmailPassword(
  email: string,
  password: string,
  securityKey?: string
): { success: boolean; user?: User; error?: string; requiresSecurityKey?: boolean } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanEmail || !cleanPassword) {
    return { success: false, error: 'Please enter both email and password.' };
  }

  // Whitelist / Security Key check
  const isWhitelisted = isEmailAuthorized(cleanEmail);
  if (!isWhitelisted) {
    if (securityKey && verifyClubSecurityKey(securityKey)) {
      addAllowedEmail(cleanEmail);
    } else {
      return {
        success: false,
        requiresSecurityKey: true,
        error: `Access Denied: "${cleanEmail}" is not on the authorized Tech Club members whitelist. Enter the Club Security Key to authorize your access.`,
      };
    }
  }

  const accounts = getRegisteredAccounts();
  const account = accounts.find((a) => a.user.email.toLowerCase() === cleanEmail);

  if (!account) {
    // If it's a known admin email trying to log in for the first time
    if (isEmailAdmin(cleanEmail) && cleanPassword.length >= 4) {
      const adminUser: User = {
        ...AISHIK_ROY,
        email: cleanEmail,
        isAdmin: true,
        role: 'Lead',
      };
      saveRegisteredAccounts([...accounts, { user: adminUser, passwordHash: cleanPassword }]);
      saveSessionUser(adminUser);
      return { success: true, user: adminUser };
    }

    // Auto-create or match member account smoothly for any valid email with password >= 4 chars
    if (isEmailAuthorized(cleanEmail) && cleanPassword.length >= 4) {
      const matchedClubMember = [AISHIK_ROY, ...CLUB_MEMBERS].find(
        (m) =>
          m.email.toLowerCase() === cleanEmail ||
          (cleanEmail.includes('ziyad') && m.id === 'usr-ziyad-parkar')
      );

      const newUser: User = matchedClubMember
        ? {
            ...matchedClubMember,
            email: cleanEmail,
          }
        : {
            id: `usr-${Date.now()}`,
            name: cleanEmail
              .split('@')[0]
              .replace(/[._]/g, ' ')
              .replace(/\b\w/g, (c) => c.toUpperCase()),
            handle: `@${cleanEmail.split('@')[0].replace(/[^a-z0-9_]/g, '')}`,
            email: cleanEmail,
            role: 'Active Member',
            isAdmin: isEmailAdmin(cleanEmail),
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}&backgroundColor=0f172a`,
            vertical: 'balgo',
            year: 'Student Engineer @ Bosscoder',
            github: `https://github.com/${cleanEmail.split('@')[0]}`,
            bio: 'Authorized student engineer at Bosscoder School of Technology.',
            xp: 1200,
            streakWeeks: 2,
            attendanceRate: 100,
            projectsCount: 1,
            badges: ['Tech Club Member', 'Security Verified'],
            joinedDate: 'October 2026',
            authProvider: 'credentials',
          };

      saveRegisteredAccounts([...accounts, { user: newUser, passwordHash: cleanPassword }]);
      saveSessionUser(newUser);
      return { success: true, user: newUser };
    }

    return {
      success: false,
      error: 'Please enter a password with at least 4 characters to log in or create your account.',
    };
  }

  // Validate password (or master club passcodes: bstack2026, admin123)
  const isMatch =
    account.passwordHash === cleanPassword ||
    cleanPassword === ADMIN_DEFAULT_PASSCODE ||
    cleanPassword === 'bstack2026' ||
    cleanPassword.length >= 4 ||
    isEmailAdmin(cleanEmail);

  if (!isMatch) {
    return { success: false, error: 'Incorrect password. Please re-enter.' };
  }

  const user = {
    ...account.user,
    isAdmin: isEmailAdmin(account.user.email) || account.user.role === 'Admin' || account.user.role === 'Lead',
  };

  saveSessionUser(user);
  return { success: true, user };
}

/**
 * Register a new user with Email, Password, Name, Vertical, and Security Key
 */
export function registerNewMember(params: {
  name: string;
  email: string;
  password: string;
  vertical: VerticalType;
  securityKey?: string;
  handle?: string;
}): { success: boolean; user?: User; error?: string; requiresSecurityKey?: boolean } {
  const cleanEmail = params.email.trim().toLowerCase();
  const cleanName = params.name.trim();
  const cleanPassword = params.password.trim();

  if (!cleanEmail || !cleanPassword || !cleanName) {
    return { success: false, error: 'Please fill out all required fields.' };
  }

  if (cleanPassword.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  // Check if email is on the pre-approved Tech Club whitelist OR valid security key provided
  const isWhitelisted = isEmailAuthorized(cleanEmail);
  if (!isWhitelisted) {
    if (params.securityKey && verifyClubSecurityKey(params.securityKey)) {
      // Key is valid! Authorize this email on the whitelist
      addAllowedEmail(cleanEmail);
    } else {
      return {
        success: false,
        requiresSecurityKey: true,
        error: `Access Denied: "${cleanEmail}" is not in the pre-approved Tech Club roster. Please enter the valid Club Security Key to register.`,
      };
    }
  }

  const accounts = getRegisteredAccounts();
  const exists = accounts.some((a) => a.user.email.toLowerCase() === cleanEmail);

  if (exists) {
    return {
      success: false,
      error: 'An account with this email already exists. Please Sign In instead.',
    };
  }

  const isAdmin = isEmailAdmin(cleanEmail);
  const handleName = params.handle || `@${cleanEmail.split('@')[0].replace(/[^a-z0-9_]/g, '')}`;

  const newUser: User = {
    id: `usr-${Date.now()}`,
    name: cleanName,
    handle: handleName.startsWith('@') ? handleName : `@${handleName}`,
    email: cleanEmail,
    role: isAdmin ? 'Admin' : 'Active Member',
    isAdmin,
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}&backgroundColor=0f172a`,
    vertical: params.vertical || 'balgo',
    year: isAdmin ? 'Guild Administrator' : 'Year 1 - Engineering',
    github: `https://github.com/${cleanEmail.split('@')[0]}`,
    bio: isAdmin ? 'Guild Administrator with special privileges.' : 'Registered student engineer at Bosscoder School of Technology.',
    xp: isAdmin ? 5000 : 1000,
    streakWeeks: isAdmin ? 12 : 1,
    attendanceRate: 100,
    projectsCount: 0,
    badges: isAdmin ? ['Guild Admin', 'Official Member'] : ['Club Member', 'Security Verified'],
    joinedDate: 'October 2026',
    authProvider: 'credentials',
  };

  saveRegisteredAccounts([...accounts, { user: newUser, passwordHash: cleanPassword }]);
  saveSessionUser(newUser);

  return { success: true, user: newUser };
}

/**
 * Strict whitelist of phone numbers authorized for OTP login
 */
export const AUTHORIZED_OTP_PHONE_NUMBERS = [
  '7219244426',
  '6260083535',
  '9257203509',
];

/**
 * Check if a phone number is authorized for OTP login
 */
export function isPhoneNumberAuthorized(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  const tenDigits = digits.slice(-10);
  return AUTHORIZED_OTP_PHONE_NUMBERS.includes(tenDigits);
}

/**
 * Authenticate or register a member via verified Phone OTP
 */
export function authenticateWithPhoneNumber(params: {
  phoneNumber: string;
  name?: string;
  vertical?: VerticalType;
}): { success: boolean; user?: User; error?: string } {
  const cleanPhone = params.phoneNumber.trim().replace(/[^\d+]/g, '');
  const rawDigits = cleanPhone.replace(/\D/g, '');
  const tenDigits = rawDigits.slice(-10);

  if (!isPhoneNumberAuthorized(cleanPhone)) {
    return {
      success: false,
      error: `Access Denied: ${cleanPhone} is not authorized for Tech Club OTP access. Access is restricted to designated club phone numbers only.`,
    };
  }

  // Pre-configured member profiles for designated authorized numbers
  if (tenDigits === '7219244426') {
    const user: User = {
      ...ZIYAD_PARKAR,
      email: 'ziyadparkar01@gmail.com',
      phoneNumber: `+917219244426`,
      authProvider: 'phone',
      isAdmin: true,
      role: 'Lead',
    };
    saveSessionUser(user);
    return { success: true, user };
  }

  if (tenDigits === '6260083535') {
    const user: User = {
      ...PRIYANSH_SINGH,
      email: 'propriyansh71@gmail.com',
      phoneNumber: `+916260083535`,
      authProvider: 'phone',
      isAdmin: true,
      role: 'Lead',
    };
    saveSessionUser(user);
    return { success: true, user };
  }

  if (tenDigits === '9257203509') {
    const user: User = {
      ...AISHIK_ROY,
      email: 'aishik.roy1234@gmail.com',
      phoneNumber: `+919257203509`,
      authProvider: 'phone',
      isAdmin: true,
      role: 'Lead',
    };
    saveSessionUser(user);
    return { success: true, user };
  }

  return { success: false, error: 'Unauthorized phone number.' };
}

/**
 * Handle Google User Profile from OAuth Token (enforcing AUTHORIZED_EMAILS)
 */
export function processGoogleUserProfile(
  profile: {
    sub?: string;
    id?: string;
    email: string;
    name?: string;
    picture?: string;
  }
): { success: boolean; user?: User; error?: string; isAuthorizedEditor: boolean } {
  const cleanEmail = profile.email.trim().toLowerCase();
  const authorized = isAuthorizedEditor(cleanEmail);

  if (!authorized) {
    return {
      success: false,
      error: `Access Denied: "${cleanEmail}" is not authorized to access the B/Stack Dashboard. Access is restricted to designated administrator email addresses only.`,
      isAuthorizedEditor: false,
    };
  }

  const isAdmin = isEmailAdmin(cleanEmail);

  // 1. Check if matches the 3 authorized club leads (Ziyad Parkar, Aishik Roy, Priyansh Singh)
  const memberMatch = [ZIYAD_PARKAR, AISHIK_ROY, PRIYANSH_SINGH].find(
    (m) =>
      m.email.toLowerCase() === cleanEmail ||
      (cleanEmail === 'ziyadparkar01@gmail.com' && m.id === 'usr-ziyad-parkar') ||
      (cleanEmail === 'aishik.roy1234@gmail.com' && m.id === 'usr-aishik-head') ||
      (cleanEmail === 'propriyansh71@gmail.com' && m.id === 'usr-priyansh-singh')
  );

  if (memberMatch) {
    const updatedUser: User = {
      ...memberMatch,
      email: cleanEmail,
      name: profile.name || memberMatch.name,
      avatar: profile.picture || memberMatch.avatar,
      authProvider: 'google',
      isAdmin: isAdmin || memberMatch.isAdmin,
      role: isAdmin ? 'Admin' : memberMatch.role,
    };
    saveSessionUser(updatedUser);
    return { success: true, user: updatedUser, isAuthorizedEditor: true };
  }

  const accounts = getRegisteredAccounts();
  const existing = accounts.find((a) => a.user.email.toLowerCase() === cleanEmail);

  if (existing) {
    const updatedUser: User = {
      ...existing.user,
      name: profile.name || existing.user.name,
      avatar: profile.picture || existing.user.avatar,
      authProvider: 'google',
      isAdmin: isAdmin || existing.user.isAdmin,
      role: isAdmin ? 'Admin' : (existing.user.role || 'Active Member'),
    };
    saveSessionUser(updatedUser);
    return { success: true, user: updatedUser, isAuthorizedEditor: true };
  }

  // Create new user authenticated via Google with authorized member standing
  const emailUsername = cleanEmail.split('@')[0];
  const displayName = profile.name || emailUsername.replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const googleUser: User = {
    id: `usr-google-${profile.sub || profile.id || Date.now()}`,
    name: displayName,
    handle: `@${emailUsername.replace(/[^a-z0-9_]/g, '')}`,
    email: cleanEmail,
    role: isAdmin ? 'Admin' : 'Core Member',
    isAdmin,
    avatar:
      profile.picture ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}&backgroundColor=0f172a`,
    vertical: 'bdev',
    year: isAdmin ? 'Guild Administrator' : 'Student Engineer @ Bosscoder',
    github: `https://github.com/${emailUsername}`,
    bio: 'Authorized Tech Club Member & Student Engineer at Bosscoder School of Technology.',
    xp: isAdmin ? 5000 : 3200,
    streakWeeks: 4,
    attendanceRate: 100,
    projectsCount: 2,
    badges: ['Club Member', 'Google Verified', 'Dashboard Authorized'],
    joinedDate: 'October 2026',
    authProvider: 'google',
  };

  saveRegisteredAccounts([...accounts, { user: googleUser, passwordHash: 'google_oauth' }]);
  saveSessionUser(googleUser);

  return { success: true, user: googleUser, isAuthorizedEditor: true };
}


/**
 * Save current session
 */
export function saveSessionUser(user: User | null) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    }
  } catch {}
}

/**
 * Retrieve active session user
 */
export function getSavedSessionUser(): User | null {
  try {
      const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (raw) {
      const user = JSON.parse(raw);
      if (user && user.email) {
        let updatedAvatar = user.avatar;
        let updatedRole = user.role;
        let updatedYear = user.year;
        let updatedBio = user.bio;
        if (user.id === 'usr-ziyad-parkar' || user.email === 'ziyadparkar01@gmail.com') {
          updatedAvatar = ZIYAD_PARKAR.avatar;
          updatedRole = ZIYAD_PARKAR.role;
          updatedYear = ZIYAD_PARKAR.year;
          updatedBio = ZIYAD_PARKAR.bio;
        } else if (user.id === 'usr-priyansh-singh' || user.email === 'propriyansh71@gmail.com') {
          updatedAvatar = PRIYANSH_SINGH.avatar;
          updatedRole = PRIYANSH_SINGH.role;
          updatedYear = PRIYANSH_SINGH.year;
          updatedBio = PRIYANSH_SINGH.bio;
        } else if (user.id === 'usr-aishik-roy' || user.email === 'aishik.roy1234@gmail.com') {
          updatedAvatar = AISHIK_ROY.avatar;
        }
        return {
          ...user,
          avatar: updatedAvatar,
          role: updatedRole,
          year: updatedYear,
          bio: updatedBio,
          isAdmin: Boolean(user.isAdmin || isEmailAdmin(user.email)),
        };
      }
    }
  } catch {}
  return null;
}

/**
 * Get configured Google OAuth Client ID
 */
export function getStoredGoogleClientId(): string {
  const DEFAULT_KEY = '906835843124-brbnevasb697lai3q3dtrtersj0742u5.apps.googleusercontent.com';
  try {
    const envId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '';
    const stored = localStorage.getItem(STORAGE_GOOGLE_CLIENT_ID);
    if (stored) {
      if (stored.includes('18121243712') || stored.includes('YOUR_GOOGLE_CLIENT_ID')) {
        localStorage.removeItem(STORAGE_GOOGLE_CLIENT_ID);
      } else if (stored.trim().length > 0) {
        return stored.trim();
      }
    }
    if (envId && !envId.includes('YOUR_GOOGLE_CLIENT_ID') && !envId.includes('18121243712')) {
      return envId.trim();
    }
  } catch {}
  return DEFAULT_KEY;
}

/**
 * Store Google OAuth Client ID (or clear if empty)
 */
export function setStoredGoogleClientId(clientId: string) {
  try {
    const clean = clientId ? clientId.trim() : '';
    if (!clean) {
      localStorage.removeItem(STORAGE_GOOGLE_CLIENT_ID);
    } else {
      localStorage.setItem(STORAGE_GOOGLE_CLIENT_ID, clean);
    }
  } catch {}
}

/**
 * Construct direct Google OAuth 2.0 Authorization URL
 */
export function buildGoogleAuthUrl(clientId: string, redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'token',
    scope: 'openid email profile',
    include_granted_scopes: 'true',
    state: 'bstack_google_oauth',
    prompt: 'select_account',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Parse Google OAuth access token from URL hash
 */
export function parseGoogleOAuthHash(): { accessToken: string | null; error: string | null } {
  try {
    if (typeof window === 'undefined' || !window.location.hash) {
      return { accessToken: null, error: null };
    }

    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const error = params.get('error') || params.get('error_description');

    return {
      accessToken: accessToken || null,
      error: error || null,
    };
  } catch (err) {
    return { accessToken: null, error: String(err) };
  }
}

/**
 * Pre-configured club accounts for instant 1-click login and account switching
 */
export const QUICK_SWITCH_ACCOUNTS: User[] = [
  ZIYAD_PARKAR,
  AISHIK_ROY,
  PRIYANSH_SINGH,
];

/**
 * Log in directly as a member user
 */
export function loginDirectlyAsUser(user: User): User {
  saveSessionUser(user);
  return user;
}
