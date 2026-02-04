"use client";

import { useEffect, useState } from "react";
import Feed from "@/components/Feed";
import UniversitySelector from "@/components/UniversitySelector";
import UniversitySwitcher from "@/components/UniversitySwitcher";
import { useUniversity } from "@/libs/hooks/useUniversity";
import HeroSlider from "@/components/home/HeroSlider";

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
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <HeroSlider
          session={session}
          selectedUniversity={selectedUniversity}
          updateUniversity={updateUniversity}
          allUniversities={allUniversities}
        />
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
        selectedId={selectedUniversity?.id}
      />
    </div>
  );
}

