"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Check, X, ToggleLeft, ToggleRight } from "lucide-react";

const TAG_COLORS = [
    { label: "Primary", value: "bg-primary/20 text-primary" },
    { label: "Blue", value: "bg-blue-500/20 text-blue-400" },
    { label: "Green", value: "bg-emerald-500/20 text-emerald-400" },
    { label: "Violet", value: "bg-violet-500/20 text-violet-400" },
    { label: "Amber", value: "bg-amber-500/20 text-amber-400" },
    { label: "Rose", value: "bg-rose-500/20 text-rose-400" },
    { label: "Cyan", value: "bg-cyan-500/20 text-cyan-400" },
];

const EMPTY_FORM = {
    tag: "",
    text: "",
    href: "",
    tagColor: TAG_COLORS[0].value,
    active: true,
    order: 0,
};

const AdminAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);

    const fetchAll = async () => {
        try {
            // Fetch all (including inactive) — admin sees everything
            const res = await axios.get("/api/admin/announcements?all=true");
            setAnnouncements(res.data);
        } catch {
            toast.error("Failed to load announcements");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.tag.trim() || !form.text.trim() || !form.href.trim()) {
            toast.error("Tag, text, and URL are required");
            return;
        }
        setSubmitting(true);
        try {
            if (editingId) {
                await axios.put("/api/admin/announcements", { id: editingId, ...form });
                toast.success("Announcement updated");
            } else {
                await axios.post("/api/admin/announcements", form);
                toast.success("Announcement created");
            }
            setForm(EMPTY_FORM);
            setEditingId(null);
            fetchAll();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setForm({
            tag: item.tag,
            text: item.text,
            href: item.href,
            tagColor: item.tagColor,
            active: item.active,
            order: item.order,
        });
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this announcement?")) return;
        try {
            await axios.delete(`/api/admin/announcements?id=${id}`);
            toast.success("Deleted");
            fetchAll();
        } catch {
            toast.error("Failed to delete");
        }
    };

    const handleToggleActive = async (item) => {
        try {
            await axios.put("/api/admin/announcements", { ...item, active: !item.active });
            toast.success(item.active ? "Deactivated" : "Activated");
            fetchAll();
        } catch {
            toast.error("Failed to update");
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
    };

    return (
        <div className="w-full space-y-6">
            {/* ── Form ── */}
            <div className="rounded-2xl bg-base-100 border border-base-300 p-5 shadow-sm">
                <h2 className="text-base font-bold text-base-content mb-4 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-primary" />
                    {editingId ? "Edit Announcement" : "New Announcement"}
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Tag */}
                    <div className="flex flex-col gap-1">
                        <label className="label_form">Tag label</label>
                        <input
                            className="input_form"
                            placeholder="e.g. New, Update, Feature"
                            value={form.tag}
                            onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                        />
                    </div>

                    {/* Tag Color */}
                    <div className="flex flex-col gap-1">
                        <label className="label_form">Tag colour</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {TAG_COLORS.map((c) => (
                                <button
                                    key={c.value}
                                    type="button"
                                    onClick={() => setForm((f) => ({ ...f, tagColor: c.value }))}
                                    className={`text-[10px] font-bold px-2 py-1 rounded-md border-2 transition-all ${c.value} ${form.tagColor === c.value
                                            ? "border-base-content scale-105 shadow-md"
                                            : "border-transparent opacity-70 hover:opacity-100"
                                        }`}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Text */}
                    <div className="flex flex-col gap-1 sm:col-span-2">
                        <label className="label_form">Announcement text</label>
                        <input
                            className="input_form"
                            placeholder="e.g. RGPV Notes for all semesters updated"
                            value={form.text}
                            onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                        />
                    </div>

                    {/* URL */}
                    <div className="flex flex-col gap-1">
                        <label className="label_form">Link URL</label>
                        <input
                            className="input_form"
                            placeholder="/category-select or https://..."
                            value={form.href}
                            onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
                        />
                    </div>

                    {/* Order */}
                    <div className="flex flex-col gap-1">
                        <label className="label_form">Display order (lower = first)</label>
                        <input
                            type="number"
                            className="input_form"
                            placeholder="0"
                            value={form.order}
                            onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
                        />
                    </div>

                    {/* Active toggle */}
                    <div className="flex items-center gap-3 sm:col-span-2">
                        <button
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                            className="flex items-center gap-2 text-sm font-medium text-base-content"
                        >
                            {form.active ? (
                                <ToggleRight className="w-6 h-6 text-primary" />
                            ) : (
                                <ToggleLeft className="w-6 h-6 text-base-content/40" />
                            )}
                            {form.active ? "Active (visible on site)" : "Inactive (hidden)"}
                        </button>
                    </div>

                    {/* Preview */}
                    <div className="sm:col-span-2">
                        <p className="label_form mb-1">Preview</p>
                        <div className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 bg-base-200 border border-base-content/10">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${form.tagColor}`}>
                                {form.tag || "Tag"}
                            </span>
                            <span className="text-xs text-base-content/70 truncate max-w-xs">
                                {form.text || "Your announcement text here"}
                            </span>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="sm:col-span-2 flex gap-3 pt-1">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn_form flex items-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            {submitting ? "Saving..." : editingId ? "Update" : "Create"}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="btn_form flex items-center gap-2 bg-base-300 hover:bg-base-200 text-base-content"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* ── List ── */}
            <div className="rounded-2xl bg-base-100 border border-base-300 p-5 shadow-sm">
                <h2 className="text-base font-bold text-base-content mb-4">
                    All Announcements ({announcements.length})
                </h2>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="loading loading-spinner loading-md text-primary" />
                    </div>
                ) : announcements.length === 0 ? (
                    <p className="text-sm text-base-content/50 text-center py-6">
                        No announcements yet. Create one above.
                    </p>
                ) : (
                    <div className="space-y-2">
                        {announcements.map((item) => (
                            <div
                                key={item.id}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-all ${item.active
                                        ? "bg-base-200/60 border-base-content/8"
                                        : "bg-base-200/20 border-base-content/5 opacity-50"
                                    }`}
                            >
                                {/* Tag preview */}
                                <span className={`flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${item.tagColor}`}>
                                    {item.tag}
                                </span>

                                {/* Text */}
                                <p className="flex-1 text-xs text-base-content/80 truncate">{item.text}</p>

                                {/* URL */}
                                <span className="hidden sm:block text-[10px] text-base-content/40 truncate max-w-[120px]">
                                    {item.href}
                                </span>

                                {/* Order badge */}
                                <span className="hidden sm:block text-[10px] px-1.5 py-0.5 rounded bg-base-300 text-base-content/50 font-mono">
                                    #{item.order}
                                </span>

                                {/* Actions */}
                                <div className="flex-shrink-0 flex items-center gap-1">
                                    <button
                                        onClick={() => handleToggleActive(item)}
                                        className="btn btn-ghost btn-xs rounded-lg"
                                        title={item.active ? "Deactivate" : "Activate"}
                                    >
                                        {item.active ? (
                                            <ToggleRight className="w-4 h-4 text-primary" />
                                        ) : (
                                            <ToggleLeft className="w-4 h-4 text-base-content/40" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="btn btn-ghost btn-xs rounded-lg"
                                        title="Edit"
                                    >
                                        <Pencil className="w-3.5 h-3.5 text-base-content/60" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="btn btn-ghost btn-xs rounded-lg"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAnnouncements;
