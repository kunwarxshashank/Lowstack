"use client";

import { useEffect, useState } from "react";
import Feed from "@/components/Feed";
import UniversitySelector from "@/components/UniversitySelector";
import UniversitySwitcher from "@/components/UniversitySwitcher";
import { useUniversity } from "@/libs/hooks/useUniversity";

import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const {
    selectedUniversity,
    updateUniversity,
    isLoading,
    allUniversities,
  } = useUniversity();

  const [showFTUE, setShowFTUE] = useState(false);

  // Show FTUE modal if no university is selected
  useEffect(() => {
    if (!isLoading && !selectedUniversity) {
      setShowFTUE(true);
    }
  }, [isLoading, selectedUniversity]);

  const handleUniversitySelect = (university) => {
    updateUniversity(university);
    setShowFTUE(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="relative w-full bg-base-200/30 border-b border-base-content/5 rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-2xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              {session?.user && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-100 border border-base-content/10 text-sm font-medium text-base-content/70">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Welcome, {session.user.name}
                </div>
              )}
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-base-content">
                Master Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Engineering Journey
                </span>
              </h1>
              <p className="text-lg text-base-content/70 max-w-lg leading-relaxed">
                Access premium notes, previous year questions, and curated study materials tailored for your university curriculum.
              </p>
            </div>

            {/* University Switcher in Hero */}
            {selectedUniversity && (
              <div className="flex flex-col items-start md:items-end gap-2">
                <span className="text-sm font-medium text-base-content/50 uppercase tracking-wider">Current University</span>
                <UniversitySwitcher
                  selectedUniversity={selectedUniversity}
                  onUniversityChange={updateUniversity}
                  universities={allUniversities}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Feed
          label="Explore Branches"
          styleHead="mb-1"
          style=""
          university={selectedUniversity?.id}
        />
      </div>

      {/* FTUE Modal */}
      <UniversitySelector
        isOpen={showFTUE}
        onClose={() => { }} // Prevent closing without selection
        onSelect={handleUniversitySelect}
        universities={allUniversities}
      />
    </div>
  );
}

