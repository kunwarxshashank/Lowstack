"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "../ui/Loading";
import AdminLayout from "../admin/layouts/AdminLayout";

export const ProctectAdminlayout = ({ children }) => {
  const { status } = useSession();

  if (status === "loading") return <Loader />;

  if (status === "authenticated") return <AdminLayout>{children}</AdminLayout>;

  return <Loader />;
};
