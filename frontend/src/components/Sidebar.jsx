import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
    Menu,
    Users,
    Dumbbell,
    Calendar,
    CreditCard,
    LayoutDashboard,
    ChevronLeft,
    LogOut
} from 'lucide-react';

function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } bg-white border-r border-gray-200 w-64`}>
                <div className="flex items-center justify-between p-4 border-b">
                    <h1 className="text-xl font-bold text-gray-800">GymPro Admin</h1>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                </div>
                <nav className="p-4 space-y-2">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex items-center p-3 rounded-lg ${
                                isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                            }`
                        }
                    >
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/members"
                        className={({ isActive }) =>
                            `flex items-center p-3 rounded-lg ${
                                isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                            }`
                        }
                    >
                        <Users className="w-5 h-5 mr-3" />
                        Members
                    </NavLink>
                    <NavLink
                        to="/trainers"
                        className={({ isActive }) =>
                            `flex items-center p-3 rounded-lg ${
                                isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                            }`
                        }
                    >
                        <Dumbbell className="w-5 h-5 mr-3" />
                        Trainers
                    </NavLink>
                    <NavLink
                        to="/classes"
                        className={({ isActive }) =>
                            `flex items-center p-3 rounded-lg ${
                                isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                            }`
                        }
                    >
                        <Calendar className="w-5 h-5 mr-3" />
                        Classes
                    </NavLink>
                    <NavLink
                        to="/memberships"
                        className={({ isActive }) =>
                            `flex items-center p-3 rounded-lg ${
                                isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                            }`
                        }
                    >
                        <CreditCard className="w-5 h-5 mr-3" />
                        Memberships
                    </NavLink>
                </nav>
                <div className="absolute bottom-0 w-full p-4 border-t">
                    <button className="flex items-center w-full p-3 text-red-600 rounded-lg hover:bg-red-50">
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className={`${isSidebarOpen ? 'ml-64' : 'ml-0'} min-h-screen transition-all`}>
                {/* Top bar */}
                <header className="bg-white border-b">
                    <div className="flex items-center justify-between px-4 py-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className={`p-2 rounded-lg hover:bg-gray-100 ${
                                isSidebarOpen ? 'hidden' : 'block'
                            }`}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex items-center ml-auto space-x-2">
                            <span className="text-sm text-gray-600">Admin User</span>
                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout