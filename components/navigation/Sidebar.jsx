"use client";

import { useState, useContext } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { navlinks } from "@/constants";
import { logo, sun, pnglogo } from "@/public/assets";
import Icon from "../ui/Icon";
import ShareDialogBox from "../models/ShareDialogBox";
import { ThemeContext } from "@/components/layouts/ProviderLayouts";


const Sidebar = () => {
  const router = useRouter();
  const [isActive, setIsActive] = useState("Home");
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <aside className="flex justify-between items-center flex-col sticky top-5 h-[89vh]">
      <Link href="/">
        <Icon
          styles="w-[52px] h-[52px] bg-base-200 [&>img]:!w-full [&>img]:!h-full [&>img]:object-contain"
          imgUrl={pnglogo}
        />
      </Link>


      <div className="flex-1 flex flex-col justify-between items-center bg-base-200 rounded-[20px] w-[76px] py-4 mt-12 shadow-xl">
        <div className="flex flex-col justify-center items-center gap-3 ">
          {navlinks.map((data) => {
            return (
              <div
                key={data.name}
                className="tooltip tooltip-right"
                data-tip={data.name}
              >
                <Icon
                  {...data}
                  isActive={isActive}
                  handleClick={() => {
                    setIsActive(data.name);
                    data.btn ? setIsOpen(true) : router.push(data.link);
                  }}
                />
              </div>
            );
          })}
        </div>
        <button
          aria-label="Toggle theme"
          className="btn btn-ghost btn-sm rounded-full"
          onClick={toggleTheme}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        {isOpen && <ShareDialogBox isOpen={isOpen} setIsOpen={setIsOpen} />}
      </div>
    </aside>
  );
};

export default Sidebar;
