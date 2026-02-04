"use client";

import { Menu, Bell, Search, UserPlus, LogOut, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";

const AdminHeader = ({ setIsOpen, setActiveView }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/login" });
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-base-300 bg-base-100/80 px-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsOpen(true)}
                    className="btn btn-ghost btn-square btn-sm lg:hidden"
                >
                    <Menu size={20} />
                </button>

                {/* Breadcrumbs or Page Title could go here */}
                <h2 className="text-lg font-semibold hidden sm:block">Dashboard</h2>
            </div>

            <div className="flex items-center gap-4">
                {/* Search Bar (Optional) */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-base-200 rounded-lg">
                    <Search size={16} className="text-base-content/50" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent border-none outline-none text-sm w-48"
                    />
                </div>

                <button className="btn btn-ghost btn-circle btn-sm">
                    <Bell size={20} />
                </button>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold hover:bg-primary/30 transition-colors cursor-pointer"
                    >
                        <UserPlus size={18} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-base-100 rounded-lg shadow-lg border border-base-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                            <button
                                onClick={() => {
                                    setActiveView("profile");
                                    setIsDropdownOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-base-content hover:bg-base-200 flex items-center gap-2"
                            >
                                <User size={16} />
                                Profile
                            </button>
                            <div className="h-px bg-base-200 my-1"></div>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 flex items-center gap-2"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
