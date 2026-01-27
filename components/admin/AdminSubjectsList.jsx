'use client'
import axios from "axios";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useEffect, useMemo, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import Table from "./components/Table";
import { useSubject } from "@/libs/hooks/useSubject";
import AddSubject from "@/components/admin/components/AddSubject";

const AdminSubjectsList = () => {
    const { data: fetchedSubjectData, error: subjectError, isLoading: SubjectLoading } = useSubject();
    const [subjectData, setSubjectData] = useState([]);
    const [editSubject, setEditSubject] = useState(null);

    useEffect(() => {
        if (fetchedSubjectData) setSubjectData(fetchedSubjectData);
        if (subjectError) toast.error("Something went wrong in fetching table data");
    }, [fetchedSubjectData, subjectError]);

    const subjectDatas = useMemo(() => subjectData, [subjectData]);

    const subjectColumns = [
        {
            accessorKey: "NO",
            header: "#",
            cell: (info) => `${info.row.index + 1}`,
        },
        {
            accessorKey: "subject_name",
            header: "Name",
            cell: (info) => <div className="font-medium">{info.getValue()}</div>,
        },
        {
            accessorKey: "university",
            header: "University",
            cell: (info) => (
                <div className="uppercase text-xs font-semibold text-primary">
                    {info.getValue() || "N/A"}
                </div>
            ),
        },
        {
            accessorKey: "course_name",
            header: "Course",
        },
        {
            accessorKey: "semester_code",
            header: "Sem",
        },
        {
            accessorKey: "subject_code",
            header: "Code",
            cell: (info) => <span className="font-mono text-xs">{info.getValue()}</span>,
        },
        {
            accessorKey: "action",
            header: "Action",
            cell: (info) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setEditSubject(info.row.original);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="btn btn-xs btn-ghost text-primary hover:bg-primary/10"
                    >
                        <PencilSquareIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleSubjectDeleteButton(info.row.original)}
                        className="btn btn-xs btn-ghost text-error hover:bg-error/10"
                    >
                        Remove
                    </button>
                </div>
            ),
        },
    ];

    const handleSubjectDeleteButton = (data) => {
        Swal.fire({
            title: "Delete Subject",
            text: "This will permanently Delete your Subject",
            icon: "warning",
            background: "hsl(var(--b1))",
            color: "currentColor",
            showCancelButton: true,
            confirmButtonColor: "hsl(var(--er))",
            cancelButtonColor: "hsl(var(--n))",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete("/api/subject", { data: { id: data.id } });
                    if (res.status === 200) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Subject deleted.",
                            icon: "success",
                            background: "hsl(var(--b1))",
                            color: "currentColor",
                        });
                        setSubjectData((prev) => prev.filter((subject) => subject.id !== data.id));
                    } else {
                        Swal.fire("Failed", "Subject not found", "error");
                    }
                } catch (error) {
                    console.error("NEXT_AUTH_ERROR: " + error);
                    toast.error("something went wrong !!");
                }
            }
        });
    };

    return (
        <div className="space-y-4">
            <AddSubject editSubject={editSubject} setEditSubject={setEditSubject} />
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Subjects</h2>
            </div>
            <Table data={subjectDatas} columns={subjectColumns} isLoading={SubjectLoading} />
        </div>
    );
};

export default AdminSubjectsList;
