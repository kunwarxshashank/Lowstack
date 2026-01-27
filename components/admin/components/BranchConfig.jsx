import axios from "axios";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/20/solid";

import { semesterCounts } from "@/constants";
import { useBranchConfigs } from "@/libs/hooks/useBranchConfig";
import SkeletonLoading from "@/components/ui/SkeletonLoading";

const BranchConfig = () => {
    const { data: branchConfigs, isLoading, mutate } = useBranchConfigs();
    const [isEditing, setIsEditing] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        branch_code: "",
        branch_name: "",
        semester_count: 8,
        logo: "",
    });

    useEffect(() => {
        if (editingBranch) {
            setFormData({
                branch_code: editingBranch.branch_code,
                branch_name: editingBranch.branch_name,
                semester_count: editingBranch.semester_count,
                logo: editingBranch.logo || "",
            });
        }
    }, [editingBranch]);

    const handleEdit = (branch) => {
        setEditingBranch(branch);
        setIsEditing(true);
        setIsAdding(false);
    };

    const handleAdd = () => {
        setFormData({
            branch_code: "",
            branch_name: "",
            semester_count: 8,
            logo: "",
        });
        setIsAdding(true);
        setIsEditing(false);
        setEditingBranch(null);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setIsAdding(false);
        setEditingBranch(null);
        setFormData({
            branch_code: "",
            branch_name: "",
            semester_count: 8,
            logo: "",
        });
    };

    const handleSave = async () => {
        if (!formData.branch_code || !formData.branch_name) {
            toast.error("Branch code and name are required");
            return;
        }

        setIsSaving(true);
        try {
            const response = await axios.post("/api/branch-config", formData);
            if (response.data.success) {
                toast.success(
                    isAdding
                        ? "Branch added successfully"
                        : "Branch updated successfully"
                );
                mutate();
                handleCancel();
            }
        } catch (error) {
            console.error("Error saving branch:", error);
            toast.error("Failed to save branch configuration");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (branchCode) => {
        if (!confirm(`Are you sure you want to delete branch: ${branchCode}?`)) {
            return;
        }

        try {
            const response = await axios.delete("/api/branch-config", {
                data: { branch_code: branchCode },
            });
            if (response.data.success) {
                toast.success("Branch deleted successfully");
                mutate();
            }
        } catch (error) {
            console.error("Error deleting branch:", error);
            toast.error("Failed to delete branch");
        }
    };

    if (isLoading) {
        return (
            <div className="p-8">
                <SkeletonLoading />
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 overflow-hidden">
                {/* Header */}
                <div className="bg-primary/10 px-6 py-5 border-b border-base-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-base-content">
                                Branch Configuration
                            </h2>
                            <p className="text-base-content/70 text-sm mt-1">
                                Manage branches and their semester configurations
                            </p>
                        </div>
                        <button
                            onClick={handleAdd}
                            className="btn btn-primary btn-sm gap-2"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Add Branch
                        </button>
                    </div>
                </div>

                {/* Add/Edit Form */}
                {(isAdding || isEditing) && (
                    <div className="bg-base-200/50 border-b border-base-300 px-6 py-5">
                        <h3 className="text-lg font-semibold text-base-content mb-4">
                            {isAdding ? "Add New Branch" : "Edit Branch"}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-base-content/80 mb-2">
                                    Branch Code
                                </label>
                                <input
                                    type="text"
                                    value={formData.branch_code}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            branch_code: e.target.value.toLowerCase(),
                                        })
                                    }
                                    disabled={isEditing}
                                    placeholder="e.g., cse, aiml"
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-base-content/80 mb-2">
                                    Branch Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.branch_name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, branch_name: e.target.value })
                                    }
                                    placeholder="e.g., Computer Science"
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-base-content/80 mb-2">
                                    Logo URL
                                </label>
                                <input
                                    type="text"
                                    value={formData.logo}
                                    onChange={(e) =>
                                        setFormData({ ...formData, logo: e.target.value })
                                    }
                                    placeholder="https://example.com/logo.png"
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-base-content/80 mb-2">
                                    Semester Count
                                </label>
                                <select
                                    value={formData.semester_count}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            semester_count: parseInt(e.target.value),
                                        })
                                    }
                                    className="select select-bordered w-full"
                                >
                                    {semesterCounts.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="btn btn-primary"
                            >
                                {isSaving ? "Saving..." : "Save"}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="btn btn-ghost"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Branch List */}
                <div className="p-6">
                    {branchConfigs && branchConfigs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {branchConfigs.map((branch) => (
                                <div
                                    key={branch.id}
                                    className="bg-base-100 border border-base-300 rounded-xl p-5 hover:shadow-md transition-all hover:border-primary/50"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="badge badge-primary badge-lg uppercase font-bold">
                                                    {branch.branch_code}
                                                </span>
                                                {branch.logo && (
                                                    <img
                                                        src={branch.logo}
                                                        alt={branch.branch_name}
                                                        className="w-6 h-6 object-contain rounded-full bg-base-200"
                                                    />
                                                )}
                                            </div>
                                            <h4 className="text-lg font-bold text-base-content mt-2">
                                                {branch.branch_name}
                                            </h4>
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => handleEdit(branch)}
                                                className="btn btn-ghost btn-sm btn-square text-info"
                                                title="Edit"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(branch.branch_code)}
                                                className="btn btn-ghost btn-sm btn-square text-error"
                                                title="Delete"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-base-200 mt-2">
                                        <span className="text-sm text-base-content/60 font-medium">
                                            Semesters
                                        </span>
                                        <span className="text-xl font-bold text-primary">
                                            {branch.semester_count}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-base-200 rounded-full mb-4">
                                <PlusIcon className="w-8 h-8 text-base-content/40" />
                            </div>
                            <h3 className="text-lg font-semibold text-base-content mb-2">
                                No branches configured
                            </h3>
                            <p className="text-base-content/60 mb-4">
                                Get started by adding your first branch
                            </p>
                            <button
                                onClick={handleAdd}
                                className="btn btn-primary"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Add Branch
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BranchConfig;
