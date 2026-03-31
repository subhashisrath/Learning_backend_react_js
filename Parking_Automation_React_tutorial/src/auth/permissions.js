import { ROLES } from './roles';

export const ROUTE_ACCESS = {
  dashboard: [ROLES.SUPERVISOR, ROLES.GOVT_ADMIN],
  sessions: [ROLES.SUPERVISOR, ROLES.GOVT_ADMIN],
  zones: [ROLES.SUPERVISOR, ROLES.GOVT_ADMIN],
  operators: [ROLES.SUPERVISOR, ROLES.GOVT_ADMIN],
  supervisors: [ROLES.GOVT_ADMIN],
  reports: [ROLES.SUPERVISOR, ROLES.GOVT_ADMIN],
  disputes: [ROLES.SUPERVISOR, ROLES.GOVT_ADMIN],
  settings: [ROLES.SUPERVISOR, ROLES.GOVT_ADMIN],
};

export const ACTION_ACCESS = {
  zones: {
    create: [ROLES.GOVT_ADMIN],
    edit: [ROLES.GOVT_ADMIN],
    delete: [ROLES.GOVT_ADMIN],
  },
  operators: {
    create: [ROLES.GOVT_ADMIN],
    edit: [ROLES.GOVT_ADMIN],
  },
  supervisors: {
    create: [ROLES.GOVT_ADMIN],
    edit: [ROLES.GOVT_ADMIN],
  },
  disputes: {
    flag: [ROLES.SUPERVISOR, ROLES.GOVT_ADMIN],
    resolve: [ROLES.GOVT_ADMIN],
    close: [ROLES.GOVT_ADMIN],
  },
  settings: {
    save: [ROLES.GOVT_ADMIN],
  },
};

export const canAccessRoute = (role, routeKey) => (ROUTE_ACCESS[routeKey] || []).includes(role);

export const canPerformAction = (role,moduleKey, actionKey) => 
    (ACTION_ACCESS[moduleKey]?.[actionKey] || []).includes(role);

export const getAssignedZoneNames = (zones , assignedZones = []) => {
    if (!assignedZones.length) return new set();
    const allowedZoneIds = new set(assignedZones);
    return new set(zones || []).filter((zone) => allowedZoneIds.has(zone.id)).map((zone) => zone.name)
}