"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    EyeIcon
} from "@heroicons/react/24/outline";

const AdminReportsList = () => {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await axios.get("/api/admin/reports");
            setReports(res.data);
        } catch (error) {
            toast.error("Failed to fetch reports");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (reportId, status) => {
        try {
            await axios.put("/api/admin/reports", { reportId, status });
            setReports(reports.map(r => r.id === reportId ? { ...r, status } : r));
            toast.success(`Report marked as ${status}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (isLoading) return <div className="text-center p-10">Loading reports...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Reports Management</h2>

            <div className="overflow-x-auto bg-base-100 rounded-xl shadow-sm border border-base-content/10">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-base-200/50">
                            <th>Status</th>
                            <th>Reason</th>
                            <th>Description</th>
                            <th>Post</th>
                            <th>Reporter</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.length > 0 ? (
                            reports.map((report) => (
                                <tr key={report.id} className="hover:bg-base-200/30">
                                    <td>
                                        <span className={`badge ${report.status === 'SOLVED' ? 'badge-success' :
                                                report.status === 'REJECTED' ? 'badge-error' : 'badge-warning'
                                            }`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="font-medium">{report.reason}</td>
                                    <td className="max-w-xs truncate" title={report.description}>
                                        {report.description || "-"}
                                    </td>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-xs">{report.post?.title}</span>
                                            <span className="text-[10px] opacity-50">{report.postId}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-xs">{report.User?.name || "Unknown"}</span>
                                            <span className="text-[10px] opacity-50">{report.User?.email}</span>
                                        </div>
                                    </td>
                                    <td className="text-xs opacity-70">
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            {report.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(report.id, 'SOLVED')}
                                                        className="btn btn-xs btn-success btn-outline"
                                                        title="Mark as Solved"
                                                    >
                                                        <CheckCircleIcon className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(report.id, 'REJECTED')}
                                                        className="btn btn-xs btn-error btn-outline"
                                                        title="Reject Report"
                                                    >
                                                        <XCircleIcon className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            {/* Assuming there is a route /post/:id or similar to view the post. 
                          The user request didn't specify, but I'll link to the embed or similar if possible.
                          Wait, PostViewDialogBox uses /embedfile?url=...
                          But here we might not have the URL easily unless we fetch it.
                          The API returns post { title, id }.
                          I'll just link to a placeholder or try to open it if I can.
                          Actually, I'll just leave the EyeIcon but maybe disable it if I can't link easily.
                          Or I can fetch file_url in the API.
                      */}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-8 opacity-50">
                                    No reports found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminReportsList;
