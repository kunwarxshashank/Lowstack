import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { handleSignOutButton } from "@/libs/utils";
import { AdminDashIcon, AdminuploadIcon, AdminPremiumIcon, SettingIcon } from "@/public/assets";

const AdminSidebar = () => {
  const { data: session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (session.user?.role === "ADMIN") setIsAdmin(true);
  }, [session]);

  return (
    <aside className="flex flex-col w-64 h-screen px-4 py-8 border-r border-green-400 bg-base-200 overflow-hidden justify-between items-center">
      <div>
        <div className="flex flex-col items-center mt-6 -mx-2">
          <Image
            className="object-cover w-24 h-24 mx-2 rounded-full"
            src="/img/profile.jpg"
            width={96}
            height={96}
            priority
            alt="avatar"
          />
          <h4 className="mx-2 mt-2 font-medium text-base-800">
            {session.user?.name}
          </h4>
          <p className="mx-2 mt-1 text-sm font-medium text-gray-400">
            {session.user?.email}
          </p>
        </div>

        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav>
            {isAdmin && (
              <Link href="/admin" className="btn_sidebar">
                <AdminDashIcon />
                <span className="mx-4 font-medium">Manage Users</span>
              </Link>
            )}

            {isAdmin && (
              <Link href="/dashboard" className="btn_sidebar">
                <AdminDashIcon />
                <span className="mx-4 font-medium">Dashboard</span>
              </Link>
            )}

            {/* <Link href="/premium" className="btn_sidebar">
              <AdminPremiumIcon />
              <span className="mx-4 font-medium">Premium</span>
            </Link>     */}

            {isAdmin && (
              <Link href="/upload" className="btn_sidebar">
                <AdminuploadIcon />
                <span className="mx-4 font-medium">Upload</span>
              </Link>
            )}       

            <Link href="/" className="btn_sidebar">
              <AdminDashIcon />
              <span className="mx-4 font-medium">Home</span>
            </Link>
            <a className="btn_sidebar" onClick={handleSignOutButton}>
              <SettingIcon />
              <span className="mx-4 font-medium">Logout</span>
            </a>
          </nav>
        </div>
      </div>
      <div className="font-medium text-xs text-gray-400 mb-5 mr-5">
        LowStack@2025
      </div>
    </aside>
  );
};

export default AdminSidebar;
