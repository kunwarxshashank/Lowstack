'use client'
import axios from "axios";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useEffect, useMemo, useState } from "react";
import Table from "./components/Table";
import AdminModel from "./ui/AdminModel";
import useUsers from "@/libs/hooks/useUsers";
import { UserValidation } from "@/libs/validations/user";

const AdminUsersList = () => {
    const { data: fetchedData, error, isLoading: loading } = useUsers();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState({});
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        if (fetchedData) setTableData(fetchedData);
        if (error) toast.error("Something went wrong in fetching users data");
    }, [fetchedData, error]);

    const UserDatas = useMemo(() => tableData, [tableData]);

    const columns = [
        {
            accessorKey: "NO",
            header: "#",
            cell: (info) => `${info.row.index + 1}`,
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: (info) => <div className="font-medium">{info.getValue()}</div>,
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "phoneNumber",
            header: "Phone",
        },
        {
            accessorKey: "userRole",
            header: "Role",
            cell: (info) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${info.getValue() === "ADMIN" ? "bg-primary/10 text-primary" : "bg-base-200 text-base-content/70"
                    }`}>
                    {info.getValue()}
                </span>
            ),
        },
        {
            accessorKey: "premium",
            header: "Premium",
            cell: (info) => {
                const user = info.row.original;
                const isPremium =
                    user.subscription?.sem1 ||
                    user.subscription?.sem2 ||
                    user.subscription?.sem3 ||
                    user.subscription?.sem4 ||
                    user.subscription?.sem5 ||
                    user.subscription?.sem6;

                return isPremium ? <span className="text-yellow-500">⭐</span> : <span className="text-base-content/30">-</span>;
            },
        },
        {
            accessorKey: "action",
            header: "Action",
            cell: (info) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleUpdateButton(info.row.original)}
                        className="btn btn-xs btn-ghost text-info hover:bg-info/10"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDeleteButton(info.row.original)}
                        className="btn btn-xs btn-ghost text-error hover:bg-error/10"
                    >
                        Remove
                    </button>
                </div>
            ),
        },
    ];

    const handleDeleteButton = (userDelete) => {
        Swal.fire({
            title: "Deactivate account",
            text: "This will permanently deactivate your account",
            icon: "warning",
            color: "currentColor",
            background: "hsl(var(--b1))",
            showCancelButton: true,
            confirmButtonColor: "hsl(var(--er))",
            cancelButtonColor: "hsl(var(--n))",
            confirmButtonText: "Yes, delete it!",
            customClass: { popup: "dark:text-white" }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete("/api/user", { data: { email: userDelete.email } });
                    if (res.status === 200) {
                        Swal.fire({
                            title: "Deactivated!",
                            text: "Your account has been permanently deactivated.",
                            icon: "success",
                            background: "hsl(var(--b1))",
                            color: "currentColor",
                        });
                        setTableData((prev) => prev.filter((user) => user.email !== userDelete.email));
                    } else {
                        Swal.fire("Failed", "User not found", "error");
                    }
                } catch (error) {
                    console.error("NEXT_AUTH_ERROR: " + error);
                    toast.error("something went wrong !!");
                }
            }
        });
    };

    const handleUpdateButton = (userUpdate) => {
        setUserData(userUpdate);
        setIsOpen(true);
    };

    const handleSubmitButton = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const userInput = { name: userData.name, email: userData.email, phoneNumber: userData.phoneNumber };

        try {
            const validation = UserValidation.profileUpdate.safeParse(userInput);
            if (!validation.success) {
                validation.error.issues.forEach((err) => toast.error(err.message));
            } else {
                const response = await axios.patch("/api/user", {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    phoneNumber: userData.phoneNumber,
                    userRole: userData.userRole,
                });

                if (response.statusText === "FAILED") {
                    toast.error(response.data);
                } else {
                    const updatedUserData = response.data;
                    setTableData((prev) => {
                        const updated = [...prev];
                        const index = updated.findIndex((u) => u.id === updatedUserData.id);
                        if (index !== -1) updated[index] = updatedUserData;
                        return updated;
                    });
                    toast.success("Successfully updated");
                }
            }
        } catch (err) {
            console.error("NEXT_AUTH_ERROR: " + err);
            toast.error("something went wrong !!");
        } finally {
            setIsLoading(false);
            setIsOpen(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Users</h2>
                {/* Add User Button could go here */}
            </div>
            <Table data={UserDatas} columns={columns} isLoading={loading} />
            <AdminModel
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                userData={userData}
                setUserData={setUserData}
                handleSubmitButton={handleSubmitButton}
                isLoading={isLoading}
            />
        </div>
    );
};

export default AdminUsersList;
