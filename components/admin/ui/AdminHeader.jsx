"use client";

import { Menu, Bell, Search } from "lucide-react";
// import ThemeToggle from "@/components/ui/ThemeToggle"; // Assuming you have one, or we can create/use existing
// import { UserButton } from "@clerk/nextjs"; // Or your auth provider's user button

const AdminHeader = ({ setIsOpen }) => {
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

                {/* Theme Toggle - You might need to adjust this import based on your project */}
                {/* <ThemeToggle /> */}

                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    A
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
