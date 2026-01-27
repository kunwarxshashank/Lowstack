/**
 * Custom hook for university management
 * Handles university selection state, localStorage persistence, and user profile sync
 */

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import universities from "@/constants/university.json";

const STORAGE_KEY = "selected_university";

export function useUniversity() {
    const { data: session, update } = useSession();
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load university from localStorage or user profile on mount
    useEffect(() => {
        const loadUniversity = () => {
            // Priority 1: User profile (if logged in)
            if (session?.user?.selectedUniversity) {
                const uni = universities.find(
                    (u) => u.id === session.user.selectedUniversity
                );
                if (uni) {
                    setSelectedUniversity(uni);
                    localStorage.setItem(STORAGE_KEY, uni.id);
                    setIsLoading(false);
                    return;
                }
            }

            // Priority 2: localStorage
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const uni = universities.find((u) => u.id === stored);
                if (uni) {
                    setSelectedUniversity(uni);
                    setIsLoading(false);
                    return;
                }
            }

            // No university selected
            setIsLoading(false);
        };

        loadUniversity();
    }, [session]);

    // Update university selection
    const updateUniversity = async (university) => {
        if (!university) return;

        setSelectedUniversity(university);
        localStorage.setItem(STORAGE_KEY, university.id);

        // Sync with user profile if logged in
        if (session?.user) {
            try {
                await fetch("/api/user/update-university", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ universityId: university.id }),
                });

                // Update session
                await update({
                    ...session,
                    user: {
                        ...session.user,
                        selectedUniversity: university.id,
                    },
                });
            } catch (error) {
                console.error("Failed to update user university:", error);
            }
        }
    };

    // Clear university selection
    const clearUniversity = () => {
        setSelectedUniversity(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    return {
        selectedUniversity,
        updateUniversity,
        clearUniversity,
        isLoading,
        allUniversities: universities,
    };
}
