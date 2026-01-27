"use client";

import { useState } from "react";
import { AcademicCapIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import UniversitySelector from "./UniversitySelector";

/**
 * UniversitySwitcher Component
 * Displays current university and allows switching
 */
export default function UniversitySwitcher({ selectedUniversity, onUniversityChange, universities }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!selectedUniversity) return null;

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="group relative flex items-center gap-3 px-5 py-2.5 rounded-full bg-base-100/10 backdrop-blur-md border border-white/10 hover:bg-base-100/20 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary">
                    <AcademicCapIcon className="w-5 h-5" />
                </div>
                <div className="text-left flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-base-content/60">University</span>
                    <span className="text-sm font-bold text-base-content leading-tight max-w-[150px] truncate">
                        {selectedUniversity.id || selectedUniversity.name}
                    </span>
                </div>
                <ChevronDownIcon className="w-4 h-4 text-base-content/40 group-hover:text-base-content transition-colors ml-2" />
            </button>

            <UniversitySelector
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={onUniversityChange}
                universities={universities}
            />
        </>
    );
}
