import { dashboardKPIs, sessions, revenueData, hourlyDistribution, zones, operators, disputes, supervisors, sessionsTrendData } from '../data/mockData';

// Simulate network latency
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Standard API response wrapper
 */
const wrap = async (data) => {
  await delay();
  // In a real app, you'd handle HTTP errors here
  return { ok: true, data };
};

export const api = {
  dashboard: {
    getStats: () => wrap(dashboardKPIs),
    getRevenueTrend: () => wrap(revenueData),
    getHourlyDistribution: () => wrap(hourlyDistribution),
    getSessionsTrend: () => wrap(sessionsTrendData),
  },
  
  sessions: {
    getAll: () => wrap(sessions),
    getById: (id) => wrap(sessions.find(s => s.id === id)),
  },
  
  zones: {
    getAll: () => wrap(zones),
    update: (id, data) => wrap({ ...zones.find(z => z.id === id), ...data }),
    create: (data) => wrap({ id: `ZN-${Math.floor(Math.random() * 1000)}`, ...data }),
    delete: (id) => wrap({ id }),
  },
  
  operators: {
    getAll: () => wrap(operators),
    update: (id, data) => wrap({ ...operators.find(o => o.id === id), ...data }),
    create: (data) => wrap({ id: `OP-${Math.floor(Math.random() * 1000)}`, ...data }),
  },

  supervisors: {
    getAll: () => wrap(supervisors),
    update: (id, data) => wrap({ ...supervisors.find(s => s.id === id), ...data }),
    create: (data) => wrap({ id: `SUP-${Math.floor(Math.random() * 1000)}`, ...data }),
  },
  
  disputes: {
    getAll: () => wrap(disputes),
    updateStatus: (id, status) => wrap({ id, status }),
  },

  settings: {
    get: () => wrap({
      parkingPolicy: { maxDuration: 120, gracePeriod: 15, baseRate: 20 },
      retentionPolicy: { sessionData: 90, evidenceImages: 30 },
      notifications: { email: true, sms: true, whatsapp: false }
    }),
    save: (data) => wrap(data)
  }
};
