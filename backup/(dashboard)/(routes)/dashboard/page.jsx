"use client";

import { Tab } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  WrenchScrewdriverIcon,
  TableCellsIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";

import BranchConfig from "@/components/admin/components/BranchConfig";

const tabs = [
  { name: "Playground", icon: WrenchScrewdriverIcon },
  { name: "Show Data", icon: TableCellsIcon },
  { name: "Branch Config", icon: Cog6ToothIcon },
];

const MyDash = () => {
  const { data: session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log(`User: ${session.user.role}`);
    if (session.user?.role === "ADMIN") setIsAdmin(true);
  }, [session]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, <span className="font-semibold">{session.user.name || session.user.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyDash;
