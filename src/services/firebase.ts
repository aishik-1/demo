import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  collection,
  getDocFromServer,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { ClubEvent } from '../types';

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// CRITICAL: Must pass firestoreDatabaseId from configuration
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({ prompt: 'select_account' });

// ==========================================
// Required Error Handling
// ==========================================
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection Health Check
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline. Please check network and Firebase configuration.');
    }
    return false;
  }
}

// Execute connection test on initial load
testConnection().catch(() => {});

// ==========================================
// Firestore Event Services
// ==========================================

const EVENTS_COLLECTION = 'events';

/**
 * Real-time event listener across all connected devices and browsers
 */
export function subscribeToFirestoreEvents(
  callback: (events: ClubEvent[]) => void,
  onError?: (err: Error) => void
): () => void {
  const eventsCol = collection(db, EVENTS_COLLECTION);

  const unsubscribe = onSnapshot(
    eventsCol,
    (snapshot) => {
      if (snapshot.empty) {
        callback([]);
        return;
      }
      const loadedEvents: ClubEvent[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        loadedEvents.push({
          ...(data as ClubEvent),
          id: docSnap.id,
        });
      });
      callback(loadedEvents);
    },
    (error) => {
      console.error('Firestore onSnapshot listener error:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, EVENTS_COLLECTION);
    }
  );

  return unsubscribe;
}

/**
 * Fetch all events once from Firestore
 */
export async function fetchFirestoreEvents(): Promise<ClubEvent[]> {
  try {
    const snap = await getDocs(collection(db, EVENTS_COLLECTION));
    if (snap.empty) return [];
    const list: ClubEvent[] = [];
    snap.forEach((docSnap) => {
      list.push({ ...(docSnap.data() as ClubEvent), id: docSnap.id });
    });
    return list;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, EVENTS_COLLECTION);
  }
}

/**
 * Save or update an event in Firestore
 */
export async function saveFirestoreEvent(event: ClubEvent): Promise<void> {
  const path = `${EVENTS_COLLECTION}/${event.id}`;
  try {
    const docRef = doc(db, EVENTS_COLLECTION, event.id);
    // Sanitize event payload to ensure clean object without undefined
    const cleanPayload: Record<string, any> = {};
    for (const [key, value] of Object.entries(event)) {
      if (value !== undefined) {
        cleanPayload[key] = value;
      }
    }
    await setDoc(docRef, cleanPayload, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Delete an event from Firestore
 */
export async function deleteFirestoreEvent(eventId: string): Promise<void> {
  const path = `${EVENTS_COLLECTION}/${eventId}`;
  try {
    const docRef = doc(db, EVENTS_COLLECTION, eventId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

/**
 * Seed Firestore with initial events if collection is currently empty
 */
export async function seedInitialFirestoreEvents(initialEvents: ClubEvent[]): Promise<void> {
  try {
    const snap = await getDocs(collection(db, EVENTS_COLLECTION));
    if (!snap.empty) {
      return; // Already populated
    }

    const batch = writeBatch(db);
    for (const ev of initialEvents) {
      const docRef = doc(db, EVENTS_COLLECTION, ev.id);
      const cleanPayload: Record<string, any> = {};
      for (const [key, value] of Object.entries(ev)) {
        if (value !== undefined) {
          cleanPayload[key] = value;
        }
      }
      batch.set(docRef, cleanPayload);
    }
    await batch.commit();
  } catch (err) {
    console.warn('Initial seeding error:', err);
  }
}

/**
 * Reset Firestore events back to default club events
 */
export async function resetFirestoreEvents(defaultEvents: ClubEvent[]): Promise<void> {
  try {
    const snap = await getDocs(collection(db, EVENTS_COLLECTION));
    const batch = writeBatch(db);

    // Delete existing
    snap.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });

    // Write defaults
    for (const ev of defaultEvents) {
      const docRef = doc(db, EVENTS_COLLECTION, ev.id);
      const cleanPayload: Record<string, any> = {};
      for (const [key, value] of Object.entries(ev)) {
        if (value !== undefined) {
          cleanPayload[key] = value;
        }
      }
      batch.set(docRef, cleanPayload);
    }

    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, EVENTS_COLLECTION);
  }
}

/**
 * Sign in using Firebase Google popup
 */
export async function signInWithGooglePopup(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In failed:', error);
    throw error;
  }
}

/**
 * Sign out of Firebase
 */
export async function signOutFirebase(): Promise<void> {
  await firebaseSignOut(auth);
}
