import { ClubEvent } from '../types';
import { CLUB_EVENTS } from '../data/mockData';
import {
  subscribeToFirestoreEvents,
  saveFirestoreEvent,
  deleteFirestoreEvent,
  seedInitialFirestoreEvents,
  resetFirestoreEvents,
  fetchFirestoreEvents,
} from '../services/firebase';

// Versioning key to ensure initial mock data seeds cleanly
export const EVENTS_STORAGE_KEY = 'bstack_events_v3';
export const EVENTS_VERSION_KEY = 'bstack_events_version';
export const CURRENT_EVENTS_VERSION = '2026.10.18-v3';

const BROADCAST_CHANNEL_NAME = 'bstack_events_channel';

/**
 * Safely parse JSON or return fallback
 */
function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed !== undefined && parsed !== null ? parsed : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Load initial events state
 * Checks localStorage first, then falls back to CLUB_EVENTS
 */
export function getStoredEvents(): ClubEvent[] {
  if (typeof window === 'undefined') return CLUB_EVENTS;

  try {
    const storedVersion = localStorage.getItem(EVENTS_VERSION_KEY);
    const storedEventsRaw = localStorage.getItem(EVENTS_STORAGE_KEY);

    if (storedVersion === CURRENT_EVENTS_VERSION && storedEventsRaw) {
      const parsed = safeJsonParse<ClubEvent[]>(storedEventsRaw, []);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    saveStoredEvents(CLUB_EVENTS, false);
    return CLUB_EVENTS;
  } catch (err) {
    console.warn('[EventStorage] Failed to read from localStorage:', err);
    return CLUB_EVENTS;
  }
}

/**
 * Save events locally and broadcast across tabs/windows
 */
export function saveStoredEvents(events: ClubEvent[], notifyChannel: boolean = true): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    localStorage.setItem(EVENTS_VERSION_KEY, CURRENT_EVENTS_VERSION);
    localStorage.setItem('bstack_events', JSON.stringify(events));

    // In-window event
    window.dispatchEvent(new CustomEvent('bstack_events_updated', { detail: events }));

    // Cross-tab broadcast
    if (notifyChannel && typeof BroadcastChannel !== 'undefined') {
      try {
        const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        channel.postMessage({ type: 'EVENTS_UPDATED', events });
        channel.close();
      } catch {}
    }
  } catch (err) {
    console.error('[EventStorage] Failed to save events:', err);
  }
}

/**
 * Cloud-synchronized Event Creation
 * Writes to Firestore cloud database so every visitor and device sees it immediately!
 */
export async function createCloudEvent(newEvent: ClubEvent): Promise<void> {
  // 1. Instant optimistic update
  const current = getStoredEvents();
  const updated = [newEvent, ...current.filter((e) => e.id !== newEvent.id)];
  saveStoredEvents(updated);

  // 2. Persist to Firestore Cloud
  try {
    await saveFirestoreEvent(newEvent);
  } catch (err) {
    console.warn('[EventStorage] Firestore cloud save warning:', err);
  }

  // 3. Fallback to API endpoint if available
  try {
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent),
    });
  } catch {}
}

/**
 * Cloud-synchronized Event Update
 */
export async function updateCloudEvent(updatedEvent: ClubEvent): Promise<void> {
  // 1. Optimistic update
  const current = getStoredEvents();
  const updated = current.map((e) => (e.id === updatedEvent.id ? updatedEvent : e));
  saveStoredEvents(updated);

  // 2. Persist to Firestore Cloud
  try {
    await saveFirestoreEvent(updatedEvent);
  } catch (err) {
    console.warn('[EventStorage] Firestore cloud update warning:', err);
  }

  // 3. API fallback
  try {
    await fetch(`/api/events/${updatedEvent.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEvent),
    });
  } catch {}
}

/**
 * Cloud-synchronized Event Deletion
 */
export async function deleteCloudEvent(eventId: string): Promise<void> {
  // 1. Optimistic update
  const current = getStoredEvents();
  const updated = current.filter((e) => e.id !== eventId);
  saveStoredEvents(updated);

  // 2. Delete from Firestore Cloud
  try {
    await deleteFirestoreEvent(eventId);
  } catch (err) {
    console.warn('[EventStorage] Firestore cloud delete warning:', err);
  }

  // 3. API fallback
  try {
    await fetch(`/api/events/${eventId}`, {
      method: 'DELETE',
    });
  } catch {}
}

/**
 * Cloud-synchronized Events Reset
 */
export async function resetCloudEvents(): Promise<ClubEvent[]> {
  saveStoredEvents(CLUB_EVENTS);
  try {
    await resetFirestoreEvents(CLUB_EVENTS);
  } catch (err) {
    console.warn('[EventStorage] Firestore cloud reset warning:', err);
  }
  return CLUB_EVENTS;
}

/**
 * Real-time event subscription with Firestore cloud listener
 */
export function subscribeToEvents(callback: (events: ClubEvent[]) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  // 1. Subscribe to Firestore real-time snapshot
  let unsubscribeFirestore = () => {};
  try {
    unsubscribeFirestore = subscribeToFirestoreEvents((firestoreEvents) => {
      if (firestoreEvents && firestoreEvents.length > 0) {
        saveStoredEvents(firestoreEvents, false);
        callback(firestoreEvents);
      } else {
        // First boot: automatically seed Firestore with default events
        seedInitialFirestoreEvents(CLUB_EVENTS).catch(() => {});
      }
    });
  } catch (err) {
    console.warn('[EventStorage] Real-time Firestore sync not available:', err);
  }

  // 2. Multi-tab and in-window event handling
  const handleCustomEvent = (e: Event) => {
    const custom = e as CustomEvent<ClubEvent[]>;
    if (custom.detail && Array.isArray(custom.detail)) {
      callback(custom.detail);
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === EVENTS_STORAGE_KEY && e.newValue) {
      const parsed = safeJsonParse<ClubEvent[]>(e.newValue, []);
      if (Array.isArray(parsed) && parsed.length > 0) {
        callback(parsed);
      }
    }
  };

  window.addEventListener('bstack_events_updated', handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  let channel: BroadcastChannel | null = null;
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event.data?.type === 'EVENTS_UPDATED' && Array.isArray(event.data?.events)) {
          callback(event.data.events);
        }
      };
    } catch {}
  }

  return () => {
    unsubscribeFirestore();
    window.removeEventListener('bstack_events_updated', handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
    if (channel) {
      try {
        channel.close();
      } catch {}
    }
  };
}

/**
 * Sync from server API as an auxiliary sync mechanism
 */
export async function syncEventsFromServer(): Promise<ClubEvent[] | null> {
  // First attempt to read from Firestore cloud
  try {
    const cloudEvents = await fetchFirestoreEvents();
    if (cloudEvents && cloudEvents.length > 0) {
      saveStoredEvents(cloudEvents, true);
      return cloudEvents;
    }
  } catch {}

  // Fallback to /api/events
  try {
    const res = await fetch('/api/events');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data?.success && Array.isArray(data.events) && data.events.length > 0) {
        saveStoredEvents(data.events, true);
        return data.events;
      }
    }
  } catch {}

  return null;
}

/**
 * Generate TypeScript code for src/data/mockData.ts for code-level exports
 */
export function generateMockDataTsCode(events: ClubEvent[]): string {
  const json = JSON.stringify(events, null, 2);
  return `export const CLUB_EVENTS: ClubEvent[] = ${json};\n`;
}
