"use client";
import { useEffect, useState } from "react";
import { FireIcon, SparklesIcon, UserIcon } from "@heroicons/react/24/solid";
import { StarIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import { fetcher } from "@/libs/fetcher";
import Image from "next/image";
import punya from "@/public/assets/punya.svg";

const HallOfPunya = () => {
    const { data: response, isLoading, error } = useSWR("/api/leaderboard?limit=50", fetcher);
    const [animateCards, setAnimateCards] = useState(false);

    const leaderboard = response?.data || [];

    useEffect(() => {
        // Trigger animation after component mounts
        const timer = setTimeout(() => setAnimateCards(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const getRankColor = (rank) => {
        switch (rank) {
            case 1:
                return "from-yellow-400 via-amber-500 to-orange-500";
            case 2:
                return "from-slate-300 via-gray-400 to-zinc-400";
            case 3:
                return "from-orange-300 via-amber-600 to-yellow-700";
            default:
                return "from-primary via-secondary to-accent";
        }
    };

    const getRankBadge = (rank) => {
        switch (rank) {
            case 1:
                return "🥇";
            case 2:
                return "🥈";
            case 3:
                return "🥉";
            default:
                return `#${rank}`;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900/20 via-black/40 to-blue-950/30 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="loading loading-infinity loading-md sm:loading-lg text-blue-500"></div>
                    <p className="mt-3 sm:mt-4 text-sm sm:text-base text-base-content/70 font-medium">Loading Hall of Punya...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900/20 via-black/40 to-blue-950/30 flex items-center justify-center p-4">
                <div className="text-center p-6 sm:p-8 bg-base-100 rounded-xl sm:rounded-2xl shadow-xl max-w-md mx-auto">
                    <p className="text-error text-base sm:text-lg font-semibold">Failed to load leaderboard</p>
                    <p className="text-base-content/60 mt-2 text-sm sm:text-base">Please try again later</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900/20 via-black/40 to-blue-950/30 pb-8 sm:pb-12 rounded-2xl sm:rounded-3xl">
            {/* Hero Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-8 sm:py-12 md:py-16 px-3 sm:px-4 mb-6 sm:mb-8 md:mb-10 rounded-2xl sm:rounded-3xl">
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="relative z-10 max-w-6xl mx-auto text-center">
                    <div className="flex justify-center mb-4 sm:mb-6">
                        <div className="relative">
                            <Image
                                src={punya}
                                alt="Punya Trophy"
                                width={80}
                                height={80}
                                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 animate-bounce"
                            />
                            <SparklesIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-yellow-200 absolute -top-1 sm:-top-2 -right-1 sm:-right-2 animate-ping" />
                        </div>
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4 tracking-tight px-2">
                        Hall of पुण्य !
                    </h1>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-4 sm:mt-6 px-3">
                        <FireIcon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-300 hidden sm:block" />
                        <p className="text-white/80 font-semibold text-sm sm:text-base text-center">
                            Earn Punya by sharing notes and helping the community!
                        </p>
                        <FireIcon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-300 hidden sm:block" />
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-5 sm:top-10 left-5 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 bg-blue-400/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-5 sm:bottom-10 right-5 sm:right-10 w-24 h-24 sm:w-40 sm:h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6">
                {/* Leaderboard List */}
                {leaderboard.length > 0 && (
                    <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                        {leaderboard.map((user, index) => {
                            const isTopThree = user.rank <= 3;
                            const rankColor = getRankColor(user.rank);

                            return (
                                <div
                                    key={user.id}
                                    className={`
                                        relative rounded-xl sm:rounded-2xl transition-all duration-500 active:scale-95 sm:hover:scale-[1.02]
                                        ${isTopThree
                                            ? `bg-gradient-to-r ${rankColor} p-0.5 sm:p-1 shadow-xl sm:shadow-2xl hover:shadow-3xl`
                                            : 'bg-base-100 shadow-md hover:shadow-xl border border-base-300 hover:border-primary'
                                        }
                                        ${animateCards ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}
                                    `}
                                    style={{
                                        transitionDelay: `${index * 50}ms`,
                                    }}
                                >
                                    {/* Glow effect for top 3 */}
                                    {isTopThree && (
                                        <div className={`absolute inset-0 bg-gradient-to-r ${rankColor} opacity-20 sm:opacity-30 blur-xl sm:blur-2xl rounded-xl sm:rounded-2xl -z-10`}></div>
                                    )}

                                    <div className={`flex items-center gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 md:p-5 ${isTopThree ? 'bg-base-100 rounded-xl sm:rounded-2xl' : ''}`}>
                                        {/* Rank Badge */}
                                        <div className="flex-shrink-0">
                                            {isTopThree ? (
                                                <div className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${rankColor} flex items-center justify-center shadow-lg sm:shadow-xl ${user.rank === 1 ? 'animate-pulse' : ''}`}>
                                                    <span className="text-2xl sm:text-3xl md:text-4xl">{getRankBadge(user.rank)}</span>
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg shadow-md">
                                                    {user.rank}
                                                </div>
                                            )}
                                        </div>

                                        {/* Avatar - Hidden on very small screens for top 3 to save space */}
                                        <div className={`flex-shrink-0 ${isTopThree ? 'hidden xs:block' : ''}`}>
                                            <div className={`${isTopThree ? 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-2 sm:border-3' : 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 border-2'} rounded-full border-base-300 overflow-hidden bg-base-200 shadow-md sm:shadow-lg`}>
                                                {user.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <UserIcon className={`${isTopThree ? 'w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9' : 'w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8'} text-base-content/40`} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* User info */}
                                        <div className="flex-grow min-w-0">
                                            <h3 className={`font-bold text-base-content truncate ${isTopThree ? 'text-base sm:text-lg md:text-xl' : 'text-sm sm:text-base md:text-lg'}`}>
                                                {user.name}
                                                {isTopThree && (
                                                    <span className="ml-1 sm:ml-2 text-xs sm:text-sm">
                                                        <StarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 inline-block" />
                                                    </span>
                                                )}
                                            </h3>
                                            {user.university && (
                                                <p className="text-base-content/60 text-xs sm:text-sm truncate hidden sm:block">
                                                    {user.university}
                                                </p>
                                            )}
                                            <p className="text-base-content/50 text-xs">
                                                📚 {user._count.posts} contribution{user._count.posts !== 1 ? 's' : ''}
                                            </p>
                                        </div>

                                        {/* Punya */}
                                        <div className="flex-shrink-0 text-right">
                                            <div className={`
                                                inline-flex items-center gap-1.5 sm:gap-2 text-white rounded-full font-bold shadow-md sm:shadow-lg
                                                ${isTopThree
                                                    ? `bg-gradient-to-r ${rankColor} px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 text-base sm:text-lg md:text-xl`
                                                    : 'bg-gradient-to-r from-orange-500 to-red-500 px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 text-sm sm:text-base'
                                                }
                                            `}>
                                                <FireIcon className={`${isTopThree ? 'w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6' : 'w-4 h-4 sm:w-5 sm:h-5'}`} />
                                                <span className="font-black">{user.punya}</span>
                                                {isTopThree && (
                                                    <span className="text-xs sm:text-sm font-semibold ml-0.5 sm:ml-1 hidden sm:inline">Punya</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Empty state */}
                {leaderboard.length === 0 && (
                    <div className="text-center py-12 sm:py-16 md:py-20 px-4">
                        <div className="mx-auto mb-4 sm:mb-6 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 opacity-20">
                            <Image
                                src={punya}
                                alt="No Punya Yet"
                                width={100}
                                height={100}
                                className="w-full h-full"
                            />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-base-content mb-2 sm:mb-3">
                            No contributors yet!
                        </h3>
                        <p className="text-base-content/60 text-base sm:text-lg">
                            Be the first to earn Punya by uploading notes!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HallOfPunya;
