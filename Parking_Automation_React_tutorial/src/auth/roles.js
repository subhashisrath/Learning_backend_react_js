export const ROLES = {
  SUPERVISOR: 'SUPERVISOR',
  GOVT_ADMIN: 'GOVT_ADMIN',
};

export const ROLE_LABELS = {
  [ROLES.SUPERVISOR]: 'Supervisor',
  [ROLES.GOVT_ADMIN]: 'Government Admin',
};

export const DEMO_USERS = [
  {
    id: 'gov-001',
    name: 'Rajesh Kumar',
    email: 'admin@gov.in',
    password: 'admin123',
    role: ROLES.GOVT_ADMIN,
    avatar: 'RK',
  },
  {
    id: 'sup-001',
    name: 'Priya Sharma',
    email: 'supervisor@parking.in',
    password: 'super123',
    role: ROLES.SUPERVISOR,
    assignedZones: ['ZN-001', 'ZN-002', 'ZN-003'],
    avatar: 'PS',
  },
];

export const findDemoUser = (email, password) =>
  DEMO_USERS.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  );
