import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth, ROLE_LABELS } from '@/auth';
import {
  HomeIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  IdentificationIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolid,
  ClockIcon as ClockSolid,
  MapPinIcon as MapPinSolid,
  UsersIcon as UsersSolid,
  IdentificationIcon as IdentificationSolid,
  ChartBarIcon as ChartBarSolid,
  ExclamationTriangleIcon as ExclamationSolid,
  Cog6ToothIcon as CogSolid,
} from '@heroicons/react/24/solid';


const navGroups = [
  {
    label: 'Operations',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: HomeIcon, activeIcon: HomeSolid, roles: ['SUPERVISOR', 'GOVT_ADMIN'] },
      { name: 'Live Sessions', path: '/sessions', icon: ClockIcon, activeIcon: ClockSolid, roles: ['SUPERVISOR', 'GOVT_ADMIN'] },
      { name: 'Zones & Streets', path: '/zones', icon: MapPinIcon, activeIcon: MapPinSolid, roles: ['SUPERVISOR', 'GOVT_ADMIN'] },
      { name: 'Operators', path: '/operators', icon: UsersIcon, activeIcon: UsersSolid, roles: ['SUPERVISOR', 'GOVT_ADMIN'] },
      { name: 'Supervisors', path: '/supervisors', icon: IdentificationIcon, activeIcon: IdentificationSolid, roles: ['GOVT_ADMIN'] },
    ],
  },
  {
    label: 'Governance',
    items: [
      { name: 'Reports', path: '/reports', icon: ChartBarIcon, activeIcon: ChartBarSolid, roles: ['SUPERVISOR', 'GOVT_ADMIN'] },
      { name: 'Disputes', path: '/disputes', icon: ExclamationTriangleIcon, activeIcon: ExclamationSolid, roles: ['SUPERVISOR', 'GOVT_ADMIN'] },
      { name: 'Settings', path: '/settings', icon: Cog6ToothIcon, activeIcon: CogSolid, roles: ['SUPERVISOR', 'GOVT_ADMIN'] },
    ],
  },
];

export default function Sidebar({open, onClose}){
    const { role, user, logout } = useAuth();
    const location = useLocation();

    return (
        <>
            {/* Overlay for mobile */}
            {open && (
                <div
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm xl:hidden"
                onClick={onClose}
                />
            )}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-surface-200 transition-transform duration-300 ease-in-out xl:translate-x-0 ${
                open ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand */}
                <div className="flex h-16 items-center justify-between border-b border-surface-200 px-5">
                  <div className="flex items-center gap-2.5">
                      <img src="/Assets/mivo.png" alt="Mivo" className="h-8 w-auto" />
                      <span className="text-lg font-bold text-surface-900 tracking-tight">Mivo</span>
                  </div>
                  <button onClick={onClose} className="rounded-lg p-1 text-surface-400 hover:bg-surface-100 xl:hidden">
                      <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <nav className='flex-1 overflow-y-auto px-3 py-4'>
                  {navGroups.map((group) => {
                    const visibleItems = group.items.filter((item) => item.roles.includes(role));
                    if (visibleItems.length === 0) return null;

                    return (
                      <div key={group.label}>
                        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-surface-400">
                          {group.label}
                        </p>

                        <ul className="space-y-0.5">
                          {visibleItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const Icon = isActive ? item.activeIcon : item.icon;

                            return(
                              <li key={item.path}>
                                <NavLink
                                  to={item.path}
                                  onClick={onClose}
                                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                                  isActive
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                                }`}
                                >
                                  <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-primary-600' : 'text-surface-400 group-hover:text-surface-600'}`} />
                                  {item.name}
                                </NavLink>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
                </nav>

                {/* User card */}
                <div className="border-t border-surface-200 p-3">
                  <div className="flex items-center gap-3 rounded-lg bg-surface-50 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                      {user?.avatar || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold text-surface-800">{user?.name || 'User'}</p>
                      <p className="truncate text-xs text-surface-500">{ROLE_LABELS[role]}</p>
                    </div>
                    <button
                      onClick={logout}
                      title="Log out"
                      className="rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-surface-200 hover:text-red-600"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
            </aside>
        </>
    );

}
