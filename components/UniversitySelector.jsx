"use client";

import { useState, useMemo } from "react";
import { MagnifyingGlassIcon, XMarkIcon, BuildingLibraryIcon, MapPinIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { AcademicCapIcon, SparklesIcon } from "@heroicons/react/24/solid";

/**
 * UniversitySelector Modal Component
 * Modern, stylish university selector with card-based layout
 * Used for FTUE and university switching
 */
export default function UniversitySelector({ isOpen, onClose, onSelect, universities, selectedId }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [hoveredId, setHoveredId] = useState(null);

    // Filter universities based on search query
    const filteredUniversities = useMemo(() => {
        if (!searchQuery.trim()) return universities;

        const query = searchQuery.toLowerCase();
        return universities.filter(
            (uni) =>
                uni.name.toLowerCase().includes(query) ||
                uni.id?.toLowerCase().includes(query) ||
                uni.address?.toLowerCase().includes(query)
        );
    }, [universities, searchQuery]);

    const handleSelect = (university) => {
        onSelect(university);
        setSearchQuery("");
        onClose();
    };

    const handleClose = () => {
        // If no university is currently selected (FTUE), select the first one
        if (!selectedId && universities && universities.length > 0) {
            onSelect(universities[0]);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-gradient-to-br from-black/80 via-black/70 to-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-base-100 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden border border-base-content/10 animate-in zoom-in-95 duration-300">
                {/* Header with gradient background */}
                <div className="relative bg-gradient-to-br from-primary via-secondary to-accent p-4 sm:p-6 md:p-8 overflow-hidden">
                    {/* Animated background elements */}
                    <div className="absolute inset-0 bg-black/20 z-0"></div>
                    <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 z-0"></div>
                    <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 z-0"></div>

                    {/* Close button - positioned absolutely */}
                    <button
                        onClick={handleClose}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/30 text-white transition-all duration-300 hover:scale-110 hover:rotate-90 shadow-lg"
                        aria-label="Close"
                    >
                        <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-2" />
                    </button>

                    {/* Content wrapper */}
                    <div className="relative z-10 pr-10 sm:pr-12">
                        <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4">
                            <div className="flex-shrink-0 p-2 sm:p-2.5 md:p-3 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl ring-2 ring-white/30 shadow-lg">
                                <AcademicCapIcon className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                                    <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-white tracking-tight">
                                        Choose Your University
                                    </h2>
                                    <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-300 animate-pulse flex-shrink-0" />
                                </div>
                                <p className="text-xs sm:text-sm md:text-base text-white/90 font-medium">
                                    Unlock personalized content
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar with modern design */}
                <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-b from-base-200/30 to-transparent border-b border-base-content/5">
                    <div className="relative group">
                        <MagnifyingGlassIcon className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-primary group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search universities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input input-md sm:input-lg w-full pl-10 sm:pl-12 pr-3 sm:pr-4 text-sm sm:text-base bg-base-100 border-2 border-base-content/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-xl sm:rounded-2xl transition-all duration-300 font-medium"
                            autoFocus
                        />
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-2 sm:mt-3">
                        <div className="text-xs sm:text-sm font-semibold text-base-content/70">
                            <span className="text-primary text-sm sm:text-base md:text-lg">{filteredUniversities.length}</span> <span className="hidden sm:inline">universities</span><span className="sm:hidden">unis</span> available
                        </div>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="text-xs sm:text-sm text-primary hover:text-primary/80 font-medium transition-colors whitespace-nowrap"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* University Grid */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-gradient-to-b from-transparent to-base-200/20">
                    {filteredUniversities.length === 0 ? (
                        <div className="text-center py-12 sm:py-16 md:py-20 px-4">
                            <div className="relative inline-block mb-4 sm:mb-6">
                                <BuildingLibraryIcon className="w-16 h-16 sm:w-20 sm:h-20 text-base-content/20 mx-auto" />
                                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
                                    <XMarkIcon className="w-6 h-6 sm:w-8 sm:h-8 text-error" />
                                </div>
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-base-content mb-2">No Results Found</h3>
                            <p className="text-sm sm:text-base text-base-content/60 max-w-md mx-auto px-4">
                                No universities matching <span className="font-semibold text-primary">"{searchQuery}"</span>
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {filteredUniversities.map((uni) => (
                                <button
                                    key={uni.id || uni.name}
                                    onClick={() => handleSelect(uni)}
                                    onMouseEnter={() => setHoveredId(uni.id || uni.name)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    className="group relative text-left p-3.5 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl border-2 border-base-content/10 hover:border-primary/50 bg-gradient-to-br from-base-100 to-base-200/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 active:scale-95 sm:hover:-translate-y-1 overflow-hidden"
                                >
                                    {/* Gradient overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    {/* Animated corner accent */}
                                    <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Check icon on hover */}
                                    <div className={`absolute top-3 right-3 sm:top-4 sm:right-4 transition-all duration-300 ${hoveredId === (uni.id || uni.name) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                                        <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                    </div>

                                    <div className="relative flex items-start gap-3 sm:gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ring-2 ring-primary/10 shadow-md">
                                            <BuildingLibraryIcon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0 pt-0.5 sm:pt-1">
                                            <h3 className="font-bold text-sm sm:text-base md:text-lg text-base-content group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-1.5 sm:mb-2">
                                                {uni.name}
                                            </h3>
                                            {uni.id && (
                                                <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-primary/10 rounded-md sm:rounded-lg">
                                                    <AcademicCapIcon className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                                                    <span className="text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wide">
                                                        {uni.id}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer hint */}
                <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-base-200/30 border-t border-base-content/5">
                    <p className="text-center text-xs sm:text-sm text-base-content/60 leading-relaxed">
                        <span className="font-semibold text-base-content/80">💡 Tip:</span> <span className="hidden sm:inline">You can change your university anytime from settings</span><span className="sm:hidden">Change university anytime in settings</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
