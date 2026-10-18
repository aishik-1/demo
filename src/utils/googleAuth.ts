/**
 * Google Identity Services & Real Google OAuth Helper
 * Connects directly to Google's OAuth 2.0 server to launch the real Google Account Chooser popup.
 */

import { isAuthorizedEditor, UNAUTHORIZED_EDITOR_MESSAGE, processGoogleUserProfile } from './authStorage';

declare global {
  interface Window {
    google?: any;
    onGoogleLibraryLoad?: () => void;
  }
}

export interface GoogleUserProfile {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture: string;
  email: string;
  email_verified: boolean;
}

/**
 * Load Google Identity Services SDK script dynamically if not already in DOM
 */
export function loadGoogleGsiScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }

    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      // Poll briefly in case it already loaded
      const check = setInterval(() => {
        if (window.google?.accounts?.oauth2) {
          clearInterval(check);
          resolve();
        }
      }, 50);
      setTimeout(() => {
        clearInterval(check);
        resolve();
      }, 2000);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
}

/**
 * Launch the REAL Google OAuth Account Chooser popup via Google Identity Services
 * Returns the verified profile from Google's userinfo endpoint.
 */
export async function launchRealGoogleOAuthPopup(
  clientId: string
): Promise<{ success: boolean; profile?: GoogleUserProfile; error?: string; isClosedByUser?: boolean }> {
  await loadGoogleGsiScript();

  if (!window.google?.accounts?.oauth2) {
    return {
      success: false,
      error: 'Google Identity Services library is still loading. Please check your network or try again in a moment.',
    };
  }

  return new Promise((resolve) => {
    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId.trim(),
        scope: 'email profile openid',
        prompt: 'select_account',
        callback: async (tokenResponse: any) => {
          if (!tokenResponse || tokenResponse.error) {
            // Popup closed by user or cancelled - silently cancel without showing popup closed banner
            resolve({
              success: false,
              isClosedByUser: true,
            });
            return;
          }

          if (!tokenResponse.access_token) {
            resolve({
              success: false,
              error: 'No access token received from Google.',
            });
            return;
          }

          // Fetch the real, authenticated user profile from Google's UserInfo API
          try {
            const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            });

            if (!userInfoRes.ok) {
              resolve({
                success: false,
                error: 'Failed to retrieve user profile from Google accounts API.',
              });
              return;
            }

            const profile: GoogleUserProfile = await userInfoRes.json();
            resolve({ success: true, profile });
          } catch {
            resolve({
              success: false,
              error: 'Failed to connect to Google user info API.',
            });
          }
        },
        error_callback: (errorObj: any) => {
          // If popup closed or blocked, silently finish without error banner
          const isClosed =
            errorObj?.type === 'popup_closed' ||
            errorObj?.message?.toLowerCase().includes('closed') ||
            errorObj?.message?.toLowerCase().includes('cancel');

          resolve({
            success: false,
            isClosedByUser: isClosed,
            error: isClosed ? undefined : errorObj?.message,
          });
        },
      });

      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } catch (err: any) {
      resolve({
        success: false,
        error: err?.message || 'Could not initialize Google OAuth token client.',
      });
    }
  });
}
