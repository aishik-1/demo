import { User } from '../types';
import { isAuthorizedEditor, isEmailAdmin, AUTHORIZED_EMAILS } from './authStorage';

/**
 * Check if the user is authorized to access the Dashboard
 */
export function canAccessDashboard(user?: User | null): boolean {
  if (!user || !user.email) return false;
  return isAuthorizedEditor(user.email);
}

/**
 * Check if the current user has permission to create, edit, or publish events
 */
export function hasEventEditAccess(user?: User | null): boolean {
  if (!user || !user.email) return false;
  return isAuthorizedEditor(user.email);
}

/**
 * Check if the user has admin console access
 */
export function hasAdminAccess(user?: User | null): boolean {
  if (!user) return false;
  const cleanEmail = (user.email || '').trim().toLowerCase();
  return Boolean(
    user.isAdmin ||
    user.role === 'Admin' ||
    user.role === 'Lead' ||
    isEmailAdmin(cleanEmail)
  );
}
