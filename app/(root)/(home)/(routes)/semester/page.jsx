"use client";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AcademicCapIcon, CalendarDaysIcon, SparklesIcon } from "@heroicons/react/24/outline";

import { semester } from "@/constants";
import DataCard from "@/components/cards/DataCard";
import NoDataFound from "@/components/ui/NoDataFound";
import SkeletonLoading from "@/components/ui/SkeletonLoading";
import { useBranchConfig } from "@/libs/hooks/useBranchConfig";

const UserSemester = () => {
  const searchParams = useSearchParams();
  const branch = searchParams.get("branch");
  const university = searchParams.get("university");

  const {
    data: branchConfig,
    error,
    isLoading: loading,
  } = useBranchConfig(branch);

  // Filter semesters based on branch configuration
  const availableSemesters = useMemo(() => {
    if (!branchConfig) return semester; // Default to all 8 if no config
    return semester.slice(0, branchConfig.semester_count);
  }, [branchConfig]);

  return (
    <div className="min-h-screen pb-8">
      {/* Modern Header with Gradient */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent p-6 sm:p-8 shadow-2xl">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
            <CalendarDaysIcon className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">
              Select Your Semester
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-white/90 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <AcademicCapIcon className="w-3.5 h-3.5" />
                <span className="font-medium uppercase">{university || "University"}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <SparklesIcon className="w-3.5 h-3.5" />
                <span className="font-medium uppercase">{branch || "Branch"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Semesters Grid */}
      <div className="items-center">
        {loading ? (
          <SkeletonLoading />
        ) : (
          <>
            {availableSemesters.length === 0 ? (
              <NoDataFound />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {availableSemesters.map((sem, index) => (
                  <DataCard
                    key={index}
                    hrefData={{
                      pathname: `/view-subjects`,
                      query: { university: university, branch: branch, semester: sem.link },
                    }}
                    data={sem}
                    altMsg="select your semester"
                    style="py-2"
                    syleName="text-base-content"
                    sem="Semester"
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserSemester;
