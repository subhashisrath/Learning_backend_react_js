import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout({title = "Dashboard"}){

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return(
        <div>
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}/>
            <div className="xl:pl-64">
                <Navbar onMenuClick={() => setSidebarOpen(true)} title = {title}/>
                <main className="p-4 sm:p-6 animate-fade-in">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}