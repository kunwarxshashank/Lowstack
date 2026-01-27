'use client'
import axios from "axios";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useEffect, useMemo, useState } from "react";
import Table from "./components/Table";
import { usePost } from "@/libs/hooks/usePost";

const AdminContentList = () => {
    const { data: fetchedPostData, error: postError, isLoading: PostLoading } = usePost();
    const [postData, setPostData] = useState([]);

    useEffect(() => {
        if (fetchedPostData) setPostData(fetchedPostData.data);
        if (postError) toast.error("Something went wrong in fetching Post data");
    }, [fetchedPostData, postError]);

    const postDatas = useMemo(() => postData, [postData]);

    const postColumns = [
        {
            accessorKey: "NO",
            header: "#",
            cell: (info) => `${info.row.index + 1}`,
        },
        {
            accessorKey: "title",
            header: "File name",
            cell: (info) => <div className="font-medium">{info.getValue()}</div>,
        },
        {
            accessorKey: "course_name",
            header: "Course",
        },
        {
            accessorKey: "category",
            header: "Category",
            cell: (info) => (
                <span className="px-2 py-1 bg-base-200 rounded text-xs">
                    {info.getValue()}
                </span>
            ),
        },
        {
            accessorKey: "semester_code",
            header: "Sem",
        },
        {
            accessorKey: "action",
            header: "Action",
            cell: (info) => (
                <button
                    onClick={() => handlePostDeleteButton(info.row.original)}
                    className="btn btn-xs btn-ghost text-error hover:bg-error/10"
                >
                    Remove
                </button>
            ),
        },
    ];

    const handlePostDeleteButton = (data) => {
        Swal.fire({
            title: "Delete Document",
            text: "This will permanently Delete your Document",
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
                    const res = await axios.delete("/api/post", { data: { id: data.id } });
                    if (res.status === 200) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Document deleted.",
                            icon: "success",
                            background: "hsl(var(--b1))",
                            color: "currentColor",
                        });
                        setPostData((prev) => prev.filter((document) => document.id !== data.id));
                    } else {
                        Swal.fire("Failed", "Document not found", "error");
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
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Documents</h2>
            </div>
            <Table data={postDatas} columns={postColumns} isLoading={PostLoading} />
        </div>
    );
};

export default AdminContentList;
