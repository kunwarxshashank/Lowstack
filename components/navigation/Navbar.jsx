/* eslint-disable @next/next/no-page-custom-font */
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import Search from "../Search";
import { navlinks } from "@/constants";
import { usePost } from "@/libs/hooks/usePost";
import { filterPosts } from "@/libs/hooks/usefilter";
import { close, logo, menu } from "@/public/assets";
import { usePostStore } from "@/libs/state/useStore";
import ShareDialogBox from "../models/ShareDialogBox";
import PostViewDialogBox from "../models/PostViewDialogBox";
import Link from "next/link";
import { useContext } from "react";
import { Home, Heart, Search as SearchIcon, User, Menu, X, Trophy, LogIn, Link as LinkIcon, Sun, Moon } from "lucide-react";

import { useSession } from "next-auth/react";
import { ThemeContext } from "@/components/layouts/ProviderLayouts";

const Navbar = () => {
  const { status } = useSession();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { data: fetchedData, error } = usePost();
  const setData = usePostStore((state) => state.setPosts);

  const router = useRouter();
  const sidebarRef = useRef(null);
  const menuButtonRef = useRef(null);

  const [post, setPost] = useState("");
  const [isPostOpen, setIsPostOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState("Home");
  const [toggleDrawer, setToggleDrawer] = useState(false);

  //for search function
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  //for controling fetched data
  const [posts, setPosts] = useState([]);
  const data = useMemo(() => posts, [posts]);

  useEffect(() => {
    setData(posts);
  }, [posts, setData]);

  useEffect(() => {
    if (fetchedData) {
      setPosts(fetchedData);
    }
    if (error) {
      console.error("Error fetching Search data:", error);
    }
  }, [fetchedData, error]);

  const handleSearchChange = (e) => {
    /*
    Debouncing is a technique used to filter out noise or rapid changes in a signal, typically in input devices like buttons or switches. The debounce method ensures that the event triggered by the input device is only registered after a stable state has been reached.
    Here's an example JavaScript debounce method:

    function debounce(func, delay) {
        let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
     };
    }

    This debounce function takes two parameters: func which is the function to be debounced, and delay which is the time in milliseconds to wait for the input device to settle before triggering the event.

    The returned function uses setTimeout to wait for the specified delay before calling the original function passed as func. If another input event is triggered during this waiting period, the timeoutId is cleared and the timer starts again.

     In this way, the debounce function ensures that the original function is only called once, after a certain period of stability.
     */
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPosts(e.target.value, data);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  //for navigation
  const handleToggleDrawer = () => {
    setToggleDrawer((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setToggleDrawer(false);
  };

  const handleCloseSearch = () => {
    setSearchText("");
  };
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        handleCloseSidebar();
        handleCloseSearch();
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <nav className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      <p className="text-from-primary to-secondaryalign-middle text-center subpixel-antialiased text-3xl font-bold hidden sm:block">
        LowStack
        {/* <span className="badge"></span> */}
      </p>
      <Search
        results={searchedResults}
        searchText={searchText}
        setSearchText={setSearchText}
        onChangeValue={handleSearchChange}
        setIsPostOpen={setIsPostOpen}
        setPost={setPost}
      />

      <div className="md:flex hidden flex-row justify-end gap-4 items-center">
        {status === "authenticated" ? (
          <Link href="/dashboard">
            <button className="btn_sidebar border-1 bg-gradient-to-r from-secondary to-primary border-base-content font-bold shadow-lg !text-white">
              Dashboard
            </button>
          </Link>
        ) : (
          <Link href="/login">
            <button className="btn_sidebar border-1 bg-gradient-to-r from-secondary to-primary border-base-content font-bold shadow-lg !text-white">
              Login
            </button>
          </Link>
        )}
      </div>

      {/* Small screen navigation */}

      <div className="sm:hidden flex justify-between items-center relative w-full pl-2 pr-0">
        {/* Logo */}
        <div
          className="w-[40px] h-[40px] rounded-xl bg-gradient-to-br from-base-100 to-base-300 flex justify-center items-center cursor-pointer shadow-lg active:scale-95 transition-all duration-200 border border-white/5"
          onClick={() => router.push("/")}
        >
          <Image
            src={logo}
            alt="logo"
            className="w-[60%] h-[60%] object-contain"
          />
        </div>

        {/* Brand Name */}
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-bold text-2xl tracking-tight">
          Lowstack
        </p>

        {/* Hamburger Toggle */}
        <div
          className={`w-[40px] h-[40px] rounded-xl flex justify-center items-center cursor-pointer transition-all duration-300 ${toggleDrawer ? "bg-primary text-white rotate-90" : "bg-base-200 text-base-content"}`}
          onClick={handleToggleDrawer}
          ref={menuButtonRef}
        >
          {toggleDrawer ? <X size={24} /> : <Menu size={24} />}
        </div>

        {/* Glassmorphic Drawer */}
        <div
          className={`fixed top-0 right-0 h-screen w-[280px] bg-[#13131a]/80 backdrop-blur-3xl border-l border-white/10 z-[100] transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${toggleDrawer ? "translate-x-0 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]" : "translate-x-full"
            }`}
          ref={sidebarRef}
        >
          {/* Drawer Header */}
          <div className="flex justify-between items-center p-6 border-b border-white/5">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <div
              onClick={() => setToggleDrawer(false)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={20} className="text-gray-400" />
            </div>
          </div>

          {/* Drawer Links */}
          <ul className="flex flex-col gap-3 p-4 mt-2">
            {navlinks.map((data) => {
              const active = isActive === data.name;

              // Icon Selection Logic inline
              let IconComponent = null;
              switch (data.name) {
                case "Home": IconComponent = <Home size={22} strokeWidth={active ? 2.5 : 2} />; break;
                case "Hall of Punya": IconComponent = null; break; // Use image
                case "Login": IconComponent = <LogIn size={22} strokeWidth={active ? 2.5 : 2} />; break;
                case "Quick Links": IconComponent = <LinkIcon size={22} strokeWidth={active ? 2.5 : 2} />; break;
                case "Favourites": IconComponent = <Heart size={22} strokeWidth={active ? 2.5 : 2} />; break;
                default: IconComponent = null;
              }

              return (
                <li
                  key={data.name}
                  className={`flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-300 group ${active
                    ? "bg-gradient-to-r from-primary/20 to-transparent border-l-4 border-primary text-primary"
                    : "hover:bg-white/5 text-gray-400 border-l-4 border-transparent hover:text-white"
                    }`}
                  onClick={() => {
                    setIsActive(data.name);
                    setToggleDrawer(false);
                    data.btn ? setIsOpen(true) : router.push(data.link);
                  }}
                >
                  <div className={`mr-4 transition-transform duration-300 ${active ? "scale-110 drop-shadow-[0_0_8px_rgba(29,192,113,0.5)]" : "group-hover:scale-110"}`}>
                    {IconComponent ? (
                      IconComponent
                    ) : (
                      <div className={`w-[22px] h-[22px] relative ${active ? "grayscale-0" : "grayscale"} transition-all duration-300`}>
                        <Image
                          src={data.imgUrl}
                          alt={data.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <p className={`font-medium text-[15px] ${active ? "font-bold" : "font-normal"}`}>
                    {data.name}
                  </p>

                  {/* Arrow for active */}
                  {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_#1dc071]"></div>}
                </li>
              );
            })}
          </ul>

          {/* Theme Toggle Button */}
          <div className="px-4 mt-2">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {theme === "dark" ? (
                    <Sun size={20} className="text-primary group-hover:rotate-180 transition-transform duration-500" />
                  ) : (
                    <Moon size={20} className="text-primary group-hover:-rotate-12 transition-transform duration-300" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Theme</p>
                  <p className="text-xs text-gray-400 capitalize">{theme === "dark" ? "Dark Mode" : "Light Mode"}</p>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-primary/50 group-hover:bg-primary transition-colors"></div>
            </button>
          </div>

          {/* User Section at Bottom */}
          {status === "authenticated" && (
            <div className="absolute bottom-24 left-4 right-4 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">My Account</p>
                  <Link href="/dashboard" className="text-xs text-primary hover:underline">View Dashboard</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>


      {isOpen && <ShareDialogBox isOpen={isOpen} setIsOpen={setIsOpen} />}
      {isPostOpen && (
        <PostViewDialogBox
          isOpen={isPostOpen}
          setIsOpen={setIsPostOpen}
          data={post}
        />
      )}

      {/* Glassmorphic Sticky Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 min-h-[70px] bg-black/30 backdrop-blur-xl border-t border-white/10 sm:hidden flex justify-around items-center z-50 px-4 pb-3 pt-2 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] safe-area-pb transition-all duration-300">
        <div
          onClick={() => {
            setIsActive("Home");
            router.push("/");
          }}
          className={`group flex flex-col items-center justify-center p-2 rounded-2xl cursor-pointer transition-all duration-300 w-[60px] hover:bg-white/5 ${isActive === "Home" ? "text-primary scale-110" : "text-gray-400"}`}
        >
          <Home size={22} strokeWidth={isActive === "Home" ? 2.5 : 2} className={`transition-all duration-300 ${isActive === "Home" ? "drop-shadow-[0_0_8px_rgba(29,192,113,0.5)]" : ""}`} />

        </div>

        <div
          onClick={() => {
            setIsActive("Favourites");
            router.push("/favourites");
          }}
          className={`group flex flex-col items-center justify-center p-2 rounded-2xl cursor-pointer transition-all duration-300 w-[60px] hover:bg-white/5 ${isActive === "Favourites" ? "text-primary scale-110" : "text-gray-400"}`}
        >
          <Heart size={22} strokeWidth={isActive === "Favourites" ? 2.5 : 2} className={`transition-all duration-300 ${isActive === "Favourites" ? "fill-primary/20 drop-shadow-[0_0_8px_rgba(29,192,113,0.5)]" : ""}`} />
        </div>

        <div
          onClick={() => {
            setIsActive("Search");
            document.getElementById('global-search-input')?.focus();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center -mt-6 p-3 rounded-full bg-gradient-to-tr from-primary to-secondary shadow-[0_0_15px_rgba(29,192,113,0.4)] cursor-pointer transition-all duration-300 w-[56px] h-[56px] border-4 border-[#121212] z-10 active:scale-95 hover:shadow-[0_0_20px_rgba(29,192,113,0.6)]`}
        >
          <SearchIcon size={24} color="white" strokeWidth={2.5} />
        </div>

        <div
          onClick={() => {
            setIsActive("Hall of Punya");
            router.push("/hallofpunya");
          }}
          className={`group flex flex-col items-center justify-center p-2 rounded-2xl cursor-pointer transition-all duration-300 w-[60px] hover:bg-white/5 ${isActive === "Hall of Punya" ? "text-primary scale-110" : "text-gray-400"}`}
        >
          <div className={`w-6 h-6 flex items-center justify-center transition-all duration-300 ${isActive === "Hall of Punya" ? "drop-shadow-[0_0_8px_rgba(29,192,113,0.5)] grayscale-0" : "grayscale"}`}>
            {navlinks.find(n => n.name === "Hall of Punya")?.imgUrl && (
              <Image
                src={navlinks.find(n => n.name === "Hall of Punya")?.imgUrl}
                alt="Hall of Punya"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>

        <div
          onClick={() => {
            setIsActive("Account");
            router.push(status === "authenticated" ? "/dashboard" : "/login");
          }}
          className={`group flex flex-col items-center justify-center p-2 rounded-2xl cursor-pointer transition-all duration-300 w-[60px] hover:bg-white/5 ${isActive === "Account" ? "text-primary scale-110" : "text-gray-400"}`}
        >
          <User size={22} strokeWidth={isActive === "Account" ? 2.5 : 2} className={`transition-all duration-300 ${isActive === "Account" ? "drop-shadow-[0_0_8px_rgba(29,192,113,0.5)]" : ""}`} />
        </div>


      </div>
    </nav>
  );
};

export default Navbar;
