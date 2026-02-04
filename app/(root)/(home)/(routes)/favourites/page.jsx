"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import PostCard from "@/components/cards/PostCard";
import SkeletonLoading from "@/components/ui/SkeletonLoading";
import { HeartIcon, SparklesIcon, BookmarkIcon, UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const FavouritesPage = () => {
    const { data: session, status } = useSession();
    const [favourites, setFavourites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === "authenticated") {
            fetchFavourites();
        } else if (status === "unauthenticated") {
            setIsLoading(false);
        }
    }, [status]);

    const fetchFavourites = async () => {
        try {
            const res = await axios.get("/api/user/favourites");
            setFavourites(res.data);
        } catch (error) {
            console.error("Error fetching favourites:", error);
            toast.error("Failed to load favourites");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pb-8">
            {/* Modern Header with Gradient */}
            <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-pink-500 to-orange-400 p-8 shadow-2xl">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                        <BookmarkIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-2">
                            Your Favourites
                        </h1>
                        <div className="flex flex-wrap items-center gap-2 text-white/90 text-sm sm:text-base">
                            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                <SparklesIcon className="w-4 h-4" />
                                <span className="font-medium uppercase">Saved Notes & Content</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                <span className="font-medium">{favourites.length} Items</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="items-center">
                {status === "loading" || isLoading ? (
                    <SkeletonLoading />
                ) : status === "unauthenticated" ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-base-200/50 rounded-3xl border border-dashed border-base-content/20 text-center px-4">
                        <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                            <UserIcon className="w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-bold text-base-content mb-2">Login Required</h2>
                        <p className="text-base-content/60 max-w-sm mb-8">
                            Please login to your account to view and manage your favourite saved materials.
                        </p>
                        <Link
                            href="/login"
                            className="btn btn-primary rounded-full px-10 shadow-lg shadow-primary/20 transition-all hover:scale-105"
                        >
                            Login Now
                        </Link>
                    </div>
                ) : (
                    <>
                        {favourites.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-base-200/50 rounded-3xl border border-dashed border-base-content/20">
                                <HeartIcon className="w-16 h-16 text-base-content/20 mb-4" />
                                <h2 className="text-xl font-bold text-base-content/50">No favourites yet</h2>
                                <p className="text-base-content/40 mt-2">Start adding notes to your favourites to see them here!</p>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                                {favourites.map((item) => (
                                    <PostCard key={item.id} data={item} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default FavouritesPage;
