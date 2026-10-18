export type VerticalType = 'balgo' | 'beuild' | 'bhack' | 'bdev';

export type ClubRole = 'Lead' | 'Tech Club Head' | 'Core Member' | 'Active Member' | 'Mentor' | 'Alumni' | 'Admin' | 'B/ALGO Lead' | 'B/UILD Lead' | 'B/HACK Lead' | 'B/DEV Lead';

export interface User {
  id: string;
  name: string;
  handle: string;
  email: string;
  role: ClubRole;
  isAdmin?: boolean;
  avatar: string;
  vertical: VerticalType;
  year: string;
  github: string;
  linkedin?: string;
  instagram?: string;
  bio: string;
  xp: number;
  streakWeeks: number;
  attendanceRate: number;
  projectsCount: number;
  badges: string[];
  joinedDate: string;
  codeforcesHandle?: string;
  codeforcesRating?: number;
  phoneNumber?: string;
  authProvider?: 'google' | 'phone' | 'credentials';
}

export interface ClubEvent {
  id: string;
  title: string;
  description: string;
  vertical: VerticalType | 'all';
  date: string; // ISO date 'YYYY-MM-DD'
  time: string;
  duration: string;
  location: string;
  locationType: 'physical' | 'virtual' | 'hybrid';
  host: string;
  hostAvatar?: string;
  attendeesCount: number;
  maxCapacity?: number;
  rsvpStatus?: 'attending' | 'maybe' | 'none';
  attendanceVerified?: boolean;
  checkinCode: string;
  tags: string[];
  agenda?: string[];
  prerequisites?: string[];
}

export interface ProjectContributor {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface ClubProject {
  id: string;
  title: string;
  description: string;
  vertical: VerticalType;
  status: 'ideation' | 'in-progress' | 'testing' | 'deployed';
  repoUrl: string;
  demoUrl?: string;
  stars: number;
  forks: number;
  contributors: ProjectContributor[];
  techStack: string[];
  progress: number; // 0-100
  lastUpdated: string;
  openIssuesCount: number;
  featured?: boolean;
}

export interface AttendanceRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  vertical: VerticalType | 'all';
  status: 'present' | 'absent' | 'excused';
  verifiedAt: string;
  xpEarned: number;
}

export interface ClubNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'event' | 'project' | 'achievement' | 'announcement';
  actionUrl?: string;
}

export interface VerticalInfo {
  id: VerticalType;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  leads: string[];
  memberCount: number;
  projectsCount: number;
  achievements: string[];
  currentFocus: string;
  metrics: { label: string; value: string }[];
  color: string;
}
