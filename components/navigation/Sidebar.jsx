"use client";

import { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, Trophy, LogIn, Heart, Link as LinkIcon, Sun, Moon } from "lucide-react";
import Image from "next/image";

import { navlinks } from "@/constants";
import { pnglogo } from "@/public/assets";
import ShareDialogBox from "../models/ShareDialogBox";
import { ThemeContext } from "@/components/layouts/ProviderLayouts";

const Sidebar = () => {
  const router = useRouter();
  const [isActive, setIsActive] = useState("Home");
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const getIcon = (name, isActive) => {
    const iconProps = {
      size: 24,
      strokeWidth: isActive ? 2.5 : 2,
      className: `transition-all duration-300 ${isActive ? "drop-shadow-[0_0_8px_rgba(29,192,113,0.6)]" : "group-hover:scale-110"}`
    };

    switch (name) {
      case "Home":
        return <Home {...iconProps} />;
      case "Hall of Punya":
        // Maintaining the specific image asset for consistency if desired, or could use Trophy
        // But the user liked consistency. Let's stick to the image for this unique branding item if it exists in navlinks
        return null;
      case "Login":
      case "Dashboard": // In case it changes
        return <LogIn {...iconProps} />;
      case "Quick Links":
        return <LinkIcon {...iconProps} />;
      case "Favourites":
        return <Heart {...iconProps} />;
      default:
        return null;
    }
  };

  return (
    <aside className="sticky top-5 h-[93vh] flex flex-col items-center justify-between z-40 hidden sm:flex left-4">
      {/* Logo Area */}
      <Link href="/">
        <div className="w-[60px] h-[60px] rounded-2xl bg-gradient-to-br from-base-100 to-base-300 flex justify-center items-center shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-105 group border border-base-content/5">
          <Image
            src={pnglogo}
            alt="logo"
            className="w-[36px] h-[36px] object-contain group-hover:rotate-12 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Navigation Links - Glassmorphic Container */}
      <div className="flex-1 flex flex-col justify-center items-center gap-6 bg-base-100/50 backdrop-blur-md border border-base-content/5 rounded-[32px] w-[76px] py-8 my-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
        <div className="flex flex-col justify-center items-center gap-6 w-full px-2">
          {navlinks.map((data) => {
            const active = isActive === data.name;
            const IconComponent = getIcon(data.name, active);

            return (
              <div
                key={data.name}
                className="tooltip tooltip-right z-50 capitalize"
                data-tip={data.name}
              >
                <div
                  className={`
                    relative group flex justify-center items-center w-[48px] h-[48px] rounded-2xl cursor-pointer transition-all duration-300
                    ${active
                      ? "bg-gradient-to-br from-primary to-secondary text-primary-content shadow-lg shadow-primary/30"
                      : "hover:bg-base-content/5 text-base-content/70 hover:text-base-content"
                    }
                  `}
                  onClick={() => {
                    setIsActive(data.name);
                    data.btn ? setIsOpen(true) : router.push(data.link);
                  }}
                >
                  {/* Blur Glow for Active State at the back */}
                  {active && <div className="absolute inset-0 rounded-2xl bg-primary blur-md opacity-40 -z-10"></div>}

                  {IconComponent ? (
                    IconComponent
                  ) : (
                    <div className={`w-6 h-6 relative ${active ? "grayscale-0" : "grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100"} transition-all duration-300`}>
                      <Image
                        src={data.imgUrl}
                        alt={data.name}
                        fill
                        className="object-contain drop-shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Theme Toggle & Extras */}
      <div className="flex flex-col gap-4 items-center bg-base-100/50 backdrop-blur-md border border-base-content/5 rounded-3xl p-3 shadow-lg">
        <button
          onClick={toggleTheme}
          className="w-[48px] h-[48px] rounded-2xl flex justify-center items-center hover:bg-base-content/10 transition-all duration-300 text-base-content/80 hover:text-primary active:scale-95"
          title="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun size={24} className="hover:animate-[spin_4s_linear_infinite]" />
          ) : (
            <Moon size={24} className="hover:animate-pulse" />
          )}
        </button>
      </div>

      {isOpen && <ShareDialogBox isOpen={isOpen} setIsOpen={setIsOpen} />}
    </aside>
  );
};

export default Sidebar;
