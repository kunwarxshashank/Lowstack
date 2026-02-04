"use client";

import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    Menu,
    X,
    BookOpen,
    GitBranch,
    UploadCloud,
    User,
    Flag,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const AdminSidebar = ({ isOpen, setIsOpen, activeView, setActiveView }) => {

    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "ADMIN";

    const links = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, adminOnly: true },
        { id: "profile", label: "Profile", icon: User },
        { id: "users", label: "Users", icon: Users, adminOnly: true },
        { id: "content", label: "Content", icon: FileText },
        { id: "upload", label: "Upload", icon: UploadCloud },
        { id: "subjects", label: "Subjects", icon: BookOpen, adminOnly: true },
        { id: "branch", label: "Branch Config", icon: GitBranch, adminOnly: true },
        { id: "reports", label: "Reports", icon: Flag, adminOnly: true },
        // { id: "settings", label: "Settings", icon: Settings },
    ].filter(link => isAdmin || !link.adminOnly);

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-64 bg-base-100 border-r border-base-300 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-16 items-center justify-between px-6 border-b border-base-300">
                    <Link href="/" className="text-xl font-bold text-primary">
                        Lowstack<span className="text-base-content">Admin</span>
                    </Link>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden btn btn-ghost btn-sm btn-square"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = activeView === link.id;

                        return (
                            <button
                                key={link.id}
                                onClick={() => {
                                    setActiveView(link.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                                    }`}
                            >
                                <Icon size={20} />
                                <span>{link.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};

export default AdminSidebar;
