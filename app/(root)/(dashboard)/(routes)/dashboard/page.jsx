"use client";

import { Tab } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AddSubject from "@/components/admin/components/AddSubject";
import ShowData from "@/components/admin/components/ShowData";
import ChangePassword from "@/components/admin/components/ChangePassword";
const Tabs = ["Playground", "Show Data"];

const MyDash = () => {
  const { data: session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log(`User: ${session.user.role}`)
    if (session.user?.role === "ADMIN") setIsAdmin(true);
  }, [session]);


  return (
    <Tab.Group>
      <Tab.List className="flex space-x-1 sm:w-2/5">
        {Tabs.map((tab, index) => (
          <Tab
            key={index}
            className={({ selected }) =>
              `w-full py-2.5 text-base font-semibold text-base-800 outline-none ${selected && "border-b-4 border-green-400 "
              }`
            }
          >
            {tab}
          </Tab>
        ))}
      </Tab.List>

      <Tab.Panels className="mt-3">
        <Tab.Panel>
          <div className="space-y-3">
            {/* For Admin Only Create Category*/}
            {isAdmin && (
              <AddSubject userEmail={session.user.email} />

            )}
            <ChangePassword sessionData={session.user.email} />
          </div>
        </Tab.Panel>
        <Tab.Panel>
          <ShowData userID={session.user.sub} />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

export default MyDash;
