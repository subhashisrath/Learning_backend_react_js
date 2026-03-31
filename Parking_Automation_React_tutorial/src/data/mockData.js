// ─── ZONES ───
export const zones = [
  { id: 'ZN-001', name: 'MG Road Zone', city: 'Bhubaneswar', streets: 4, totalSpots: 120, occupiedSpots: 87, status: 'active' },
  { id: 'ZN-002', name: 'Janpath Zone', city: 'Bhubaneswar', streets: 3, totalSpots: 90, occupiedSpots: 62, status: 'active' },
  { id: 'ZN-003', name: 'Saheed Nagar Zone', city: 'Bhubaneswar', streets: 5, totalSpots: 150, occupiedSpots: 101, status: 'active' },
  { id: 'ZN-004', name: 'Unit 9 Zone', city: 'Bhubaneswar', streets: 2, totalSpots: 60, occupiedSpots: 48, status: 'active' },
  { id: 'ZN-005', name: 'Patia Zone', city: 'Bhubaneswar', streets: 3, totalSpots: 80, occupiedSpots: 22, status: 'maintenance' },
  { id: 'ZN-006', name: 'Nayapalli Zone', city: 'Bhubaneswar', streets: 4, totalSpots: 110, occupiedSpots: 0, status: 'inactive' },
  { id: 'ZN-007', name: 'Rasulgarh Zone', city: 'Bhubaneswar', streets: 3, totalSpots: 95, occupiedSpots: 78, status: 'active' },
  { id: 'ZN-008', name: 'Khandagiri Zone', city: 'Bhubaneswar', streets: 2, totalSpots: 50, occupiedSpots: 35, status: 'active' },
];

export const streets = [
  { id: 'ST-001', zoneId: 'ZN-001', name: 'MG Marg Main', spots: 40, occupancy: 85 },
  { id: 'ST-002', zoneId: 'ZN-001', name: 'MG Marg East', spots: 30, occupancy: 73 },
  { id: 'ST-003', zoneId: 'ZN-001', name: 'Link Road', spots: 25, occupancy: 60 },
  { id: 'ST-004', zoneId: 'ZN-001', name: 'Service Lane', spots: 25, occupancy: 80 },
  { id: 'ST-005', zoneId: 'ZN-002', name: 'Janpath Main', spots: 35, occupancy: 70 },
  { id: 'ST-006', zoneId: 'ZN-002', name: 'Janpath South', spots: 30, occupancy: 65 },
  { id: 'ST-007', zoneId: 'ZN-002', name: 'Market Road', spots: 25, occupancy: 68 },
  { id: 'ST-008', zoneId: 'ZN-003', name: 'Saheed Nagar Main', spots: 40, occupancy: 72 },
  { id: 'ST-009', zoneId: 'ZN-003', name: 'Bank Colony', spots: 30, occupancy: 66 },
  { id: 'ST-010', zoneId: 'ZN-003', name: 'Temple Road', spots: 25, occupancy: 58 },
  { id: 'ST-011', zoneId: 'ZN-003', name: 'Residential Block A', spots: 30, occupancy: 75 },
  { id: 'ST-012', zoneId: 'ZN-003', name: 'Commercial Strip', spots: 25, occupancy: 80 },
];

// ─── OPERATORS ───
export const operators = [
  { id: 'OP-001', name: 'Amit Patel', phone: '9876543210', zoneId: 'ZN-001', zoneName: 'MG Road Zone', shift: 'Morning', status: 'on-duty', sessionsToday: 24, rating: 4.5 },
  { id: 'OP-002', name: 'Sunita Das', phone: '9876543211', zoneId: 'ZN-001', zoneName: 'MG Road Zone', shift: 'Evening', status: 'off-duty', sessionsToday: 0, rating: 4.8 },
  { id: 'OP-003', name: 'Ravi Mohanty', phone: '9876543212', zoneId: 'ZN-002', zoneName: 'Janpath Zone', shift: 'Morning', status: 'on-duty', sessionsToday: 18, rating: 4.2 },
  { id: 'OP-004', name: 'Deepa Behera', phone: '9876543213', zoneId: 'ZN-002', zoneName: 'Janpath Zone', shift: 'Evening', status: 'on-duty', sessionsToday: 15, rating: 4.6 },
  { id: 'OP-005', name: 'Santosh Nayak', phone: '9876543214', zoneId: 'ZN-003', zoneName: 'Saheed Nagar Zone', shift: 'Morning', status: 'on-duty', sessionsToday: 22, rating: 4.0 },
  { id: 'OP-006', name: 'Laxmi Jena', phone: '9876543215', zoneId: 'ZN-003', zoneName: 'Saheed Nagar Zone', shift: 'Night', status: 'on-leave', sessionsToday: 0, rating: 3.9 },
  { id: 'OP-007', name: 'Bikash Sahoo', phone: '9876543216', zoneId: 'ZN-004', zoneName: 'Unit 9 Zone', shift: 'Morning', status: 'on-duty', sessionsToday: 12, rating: 4.3 },
  { id: 'OP-008', name: 'Mina Pradhan', phone: '9876543217', zoneId: 'ZN-007', zoneName: 'Rasulgarh Zone', shift: 'Morning', status: 'on-duty', sessionsToday: 20, rating: 4.7 },
  { id: 'OP-009', name: 'Gopal Mishra', phone: '9876543218', zoneId: 'ZN-007', zoneName: 'Rasulgarh Zone', shift: 'Evening', status: 'off-duty', sessionsToday: 0, rating: 4.1 },
  { id: 'OP-010', name: 'Rekha Swain', phone: '9876543219', zoneId: 'ZN-008', zoneName: 'Khandagiri Zone', shift: 'Morning', status: 'on-duty', sessionsToday: 16, rating: 4.4 },
];

// ─── SESSIONS ───
export const supervisors = [
  {
    id: 'SUP-001',
    name: 'Priya Sharma',
    email: 'supervisor@parking.in',
    phone: '9876500011',
    status: 'active',
    assignedZones: ['ZN-001', 'ZN-002', 'ZN-003'],
    operatorsManaged: 6,
    disputesReviewedThisMonth: 12,
  },
  {
    id: 'SUP-002',
    name: 'Anil Das',
    email: 'anil.das@parking.in',
    phone: '9876500012',
    status: 'active',
    assignedZones: ['ZN-004', 'ZN-007'],
    operatorsManaged: 3,
    disputesReviewedThisMonth: 7,
  },
  {
    id: 'SUP-003',
    name: 'Meena Patnaik',
    email: 'meena.patnaik@parking.in',
    phone: '9876500013',
    status: 'inactive',
    assignedZones: ['ZN-008'],
    operatorsManaged: 1,
    disputesReviewedThisMonth: 2,
  },
];


const statuses = ['active', 'completed', 'expired', 'violation'];
const vehiclePrefixes = ['OD-02', 'OD-05', 'OD-33', 'WB-26', 'DL-01', 'MH-12'];
const makeVehicle = (i) => `${vehiclePrefixes[i % vehiclePrefixes.length]}-${String.fromCharCode(65 + (i % 26))}- ${String(1000 + i * 137).slice(-4)}`

const baseDate = new Date('2026-02-10T08:00:00+05:30');
export const sessions = Array.from({ length:36 },(_,i) => {
    
    const entry = new Date(baseDate.getTime() - i * 28 * 60000);
    const durMin = 15 + Math.floor (Math.random() * 180);
    const exit = i < 8 ? null : new Date(entry.getTime() + durMin * 60000);
    const zone = zones[i % zones.length];
    const op = operators[i % operators.length];
    const status = i < 8 ? 'active' : statuses[1 + (i % 3)];

    return {
        id: `TK-${String(10001 + i)}`,
        vehicle: makeVehicle(i),
        zoneId: zone.id,
        zoneName: zone.name,
        operatorId: op.id,
        operatorName: op.name,
        entryTime: entry.toISOString(),
        exitTime: exit ? exit.toISOString() : null,
        duration: exit ? `${Math.floor(durMin / 60)}h ${durMin % 60}m` : '—',
        amount: exit ? (10 + Math.floor(durMin / 30) * 5) : 0,
        status,
        evidenceUrl: '/evidence-placeholder.jpg',
  };
})

// ─── DISPUTES ───
const disputeTypes = ['Incorrect Charge', 'Unauthorized Tow', 'Wrong Vehicle', 'Operator Complaint', 'System Error'];
const priorities = ['high', 'medium', 'low'];
const dStatuses = ['open', 'under-review', 'resolved', 'closed'];

export const disputes = Array . from({ length : 14},(_,i) => {
    const filed = new Date(baseDate.getTime() - i * 3 * 3600000)

    return {
        id: `DSP-${String(5001 + i)}`,
        ticketRef: sessions[i]?.id || `TK-${10001 + i}`,
        type: disputeTypes[i % disputeTypes.length],
        priority: priorities[i % 3],
        status: dStatuses[i % 4],
        filedDate: filed.toISOString(),
        description: `Customer reports issue regarding ${disputeTypes[i % disputeTypes.length].toLowerCase()} for vehicle ${sessions[i]?.vehicle || 'unknown'}.`,
        resolution: i % 4 >= 2 ? 'Dispute reviewed and action taken. Refund processed.' : null,
        zoneName: zones[i % zones.length].name,
    }
})

// ─── DASHBOARD KPIs ───
export const dashboardKPIs = {
  activeSessions: sessions.filter((s) => s.status === 'active').length,
  todayRevenue: sessions.filter((s) => s.status === 'completed').reduce((sum, s) => sum + s.amount, 0),
  totalZones: zones.filter((z) => z.status === 'active').length,
  totalOperatorsOnDuty: operators.filter((o) => o.status === 'on-duty').length,
  occupancyRate: Math.round(zones.reduce((s, z) => s + z.occupiedSpots, 0) / zones.reduce((s, z) => s + z.totalSpots, 0) * 100),
  violations: sessions.filter((s) => s.status === 'violation').length,
  openDisputes: disputes.filter((d) => d.status === 'open' || d.status === 'under-review').length,
};

// ─── CHART DATA ───
export const sessionsTrendData = [
  { day: 'Mon', sessions: 42 }, { day: 'Tue', sessions: 56 },
  { day: 'Wed', sessions: 48 }, { day: 'Thu', sessions: 61 },
  { day: 'Fri', sessions: 73 }, { day: 'Sat', sessions: 85 },
  { day: 'Sun', sessions: 39 },
];

export const revenueData = [
  { month: 'Sep', revenue: 18500 }, { month: 'Oct', revenue: 22000 },
  { month: 'Nov', revenue: 25800 }, { month: 'Dec', revenue: 24100 },
  { month: 'Jan', revenue: 28400 }, { month: 'Feb', revenue: 12300 },
];

export const hourlyDistribution = [
  { hour: '6AM', count: 5 }, { hour: '7AM', count: 12 }, { hour: '8AM', count: 28 },
  { hour: '9AM', count: 35 }, { hour: '10AM', count: 40 }, { hour: '11AM', count: 38 },
  { hour: '12PM', count: 42 }, { hour: '1PM', count: 36 }, { hour: '2PM', count: 33 },
  { hour: '3PM', count: 37 }, { hour: '4PM', count: 44 }, { hour: '5PM', count: 48 },
  { hour: '6PM', count: 52 }, { hour: '7PM', count: 38 }, { hour: '8PM', count: 22 },
  { hour: '9PM', count: 10 },
];

export const zoneOccupancyData = zones
  .filter((z) => z.status === 'active')
  .map((z) => ({ name: z.name.replace(' Zone', ''), occupancy: Math.round((z.occupiedSpots / z.totalSpots) * 100) }));