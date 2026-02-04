"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AdminSidebar from "../ui/AdminSidebar";
import AdminHeader from "../ui/AdminHeader";
import AdminUsersList from "../AdminUsersList";
import AdminContentList from "../AdminContentList";
import AdminSubjectsList from "../AdminSubjectsList";
import AdminUpload from "../AdminUpload";
import BranchConfig from "../components/BranchConfig";
import AdminUser from "../AdminUser";
import AdminProfile from "../AdminProfile";
import AdminReportsList from "../AdminReportsList";

const AdminLayout = ({ children }) => {
    const { data: session } = useSession();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeView, setActiveView] = useState("dashboard");

    useEffect(() => {
        if (session?.user?.role !== "ADMIN" && session?.user?.role === "USER") {
            // List of allowed views for USER
            const allowedViews = ["content", "upload", "profile"];
            if (!allowedViews.includes(activeView)) {
                setActiveView("content");
            }
        }
    }, [session, activeView]);

    const renderContent = () => {
        switch (activeView) {
            case "users":
                return <AdminUsersList />;
            case "content":
                return <AdminContentList />;
            case "subjects":
                return <AdminSubjectsList />;
            case "branch":
                return <BranchConfig />;
            case "upload":
                return <AdminUpload />;
            case "profile":
                return <AdminProfile />;
            case "reports":
                return <AdminReportsList />;
            case "dashboard":
            default:
                return <AdminUser />;
        }
    };

    return (
        <div className="min-h-screen bg-base-200 text-base-content font-epilogue">
            <AdminSidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                activeView={activeView}
                setActiveView={setActiveView}
            />

            <div className="lg:pl-64 flex flex-col min-h-screen">
                <AdminHeader setIsOpen={setIsSidebarOpen} setActiveView={setActiveView} />

                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="mx-auto max-w-7xl">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
