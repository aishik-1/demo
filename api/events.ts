// Vercel Serverless Function for /api/events
import type { IncomingMessage, ServerResponse } from 'http';

const INITIAL_EVENTS = [
  {
    id: 'evt-icpc-prep-2026',
    title: 'ICPC Regional Sprint & Advanced Segment Trees',
    description: 'Intensive competitive programming workshop dissecting lazy propagation, 2D range query trees, and flow networks for upcoming regionals.',
    vertical: 'balgo',
    date: '2026-10-24',
    time: '18:00 - 20:30 IST',
    duration: '2.5 hrs',
    location: 'Turing Lab 402 / Virtual Sandbox',
    locationType: 'hybrid',
    host: 'Aishik Roy (Tech Club Head)',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    attendeesCount: 38,
    maxCapacity: 50,
    rsvpStatus: 'attending',
    attendanceVerified: true,
    checkinCode: 'TREE99',
    tags: ['Competitive Programming', 'ICPC', 'Data Structures', 'B/ALGO'],
    agenda: [
      'Segment tree basics with lazy updates',
      'Fenwick tree multidimensional variations',
      'Live Codeforces Div 1 mock round',
      'Q&A and code walk-throughs',
    ],
    prerequisites: ['Proficiency in C++ / Java', 'Basic tree and recursion knowledge'],
  },
  {
    id: 'evt-robotics-bringup-2026',
    title: 'Autonomous Rover Hardware Bring-up & ROS2 Nodes',
    description: 'Hands-on hardware session: flash micro-ROS on ESP32, bring up lidar SLAM pipelines, and calibrate differential drive kinematics on the club rover chassis.',
    vertical: 'beuild',
    date: '2026-10-28',
    time: '15:30 - 18:30 IST',
    duration: '3 hrs',
    location: 'Hardware Prototyping Bay B',
    locationType: 'physical',
    host: 'Harshit Vyas (Robotics Lead)',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    attendeesCount: 24,
    maxCapacity: 30,
    rsvpStatus: 'none',
    attendanceVerified: false,
    checkinCode: 'ROV404',
    tags: ['Hardware', 'ROS2', 'Robotics', 'Firmware', 'Be/UILD'],
    agenda: [
      'Sensor bus wiring & serial telemetry',
      'micro-ROS agent handshake',
      'Lidar mapping in RViz2',
      'Outdoor path following test',
    ],
    prerequisites: ['Linux terminal comfort', 'Basic ROS concepts'],
  },
  {
    id: 'evt-dist-systems-2026',
    title: 'Distributed Consensus: Raft Protocol From Scratch',
    description: 'Deep dive into fault tolerance and distributed state machine replication. We will implement leader election and log replication in Go.',
    vertical: 'bdev',
    date: '2026-11-04',
    time: '17:00 - 19:30 IST',
    duration: '2.5 hrs',
    location: 'Discord Stage & Systems Lab',
    locationType: 'hybrid',
    host: 'Ziyad Parkar',
    hostAvatar: 'https://i.postimg.cc/MKdwgH92/IMG-0117.jpg',
    attendeesCount: 45,
    maxCapacity: 60,
    rsvpStatus: 'none',
    attendanceVerified: false,
    checkinCode: 'RAFT26',
    tags: ['Distributed Systems', 'Go', 'Consensus', 'Cloud', 'B/DEV'],
    agenda: [
      'Split-brain problem & quorum mechanics',
      'Raft heartbeat & term elections',
      'Log consistency proofs',
      'Live chaos testing',
    ],
    prerequisites: ['Go or Rust fundamentals'],
  },
  {
    id: 'evt-hackathon-prep-2026',
    title: '48-Hour Hackathon War Room & Fast Prototyping',
    description: 'Guild-wide sprint simulating high-pressure hackathons. Forming multi-disciplinary teams across AI, systems, and full-stack.',
    vertical: 'bhack',
    date: '2026-11-12',
    time: '14:00 - 20:00 IST',
    duration: '6 hrs',
    location: 'Bosscoder Innovation Central',
    locationType: 'physical',
    host: 'Aishik Roy & Ziyad Parkar',
    hostAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80',
    attendeesCount: 56,
    maxCapacity: 80,
    rsvpStatus: 'none',
    attendanceVerified: false,
    checkinCode: 'HACK01',
    tags: ['Hackathon', 'Full Stack', 'AI Prototyping', 'B/Hack'],
    agenda: [
      'Pitch deck formation',
      'Tech stack architecture selection',
      '6-hour build challenge',
      'Live demo presentations',
    ],
    prerequisites: ['Bring your laptop and charger'],
  },
];

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ success: true, events: INITIAL_EVENTS }));
    return;
  }

  // Acceptance response for POST/PUT/DELETE
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify({ success: true, message: 'Event operation received' }));
}
