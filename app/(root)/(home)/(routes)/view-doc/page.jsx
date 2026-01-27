"use client";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DocumentTextIcon, AcademicCapIcon, SparklesIcon, BookOpenIcon } from "@heroicons/react/24/outline";

import PostCard from "@/components/cards/PostCard";
import { useFilterPost } from "@/libs/hooks/usePost";
import NoDataFound from "@/components/ui/NoDataFound";
import SkeletonLoading from "@/components/ui/SkeletonLoading";

const MyDoc = () => {
  const searchParams = useSearchParams();
  const university = searchParams.get("university");
  const branch = searchParams.get("branch");
  const semester = searchParams.get("semester");
  const subjectCode = searchParams.get("subjectCode");
  const category = searchParams.get("category");

  const {
    data: fetchedData,
    error,
    isLoading: loading,
  } = useFilterPost({ course: branch, semester, category, subId: subjectCode, university });

  useEffect(() => {
    if (fetchedData) {
      setUserSelectedData(fetchedData);
    }
    if (error) {
      console.error("Error fetching table data:", error);
      toast.error("Something went wrong in fetching Posts");
    }
  }, [fetchedData, error]);

  const [userSelectedData, setUserSelectedData] = useState([]);
  const data = useMemo(() => userSelectedData, [userSelectedData]);

  return (
    <div className="min-h-screen pb-8">
      {/* Modern Header with Gradient */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent p-8 shadow-2xl">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
            <DocumentTextIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-2">
              {category || "Documents"}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-white/90 text-sm sm:text-base">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <AcademicCapIcon className="w-4 h-4" />
                <span className="font-medium uppercase">{university || "University"}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <SparklesIcon className="w-4 h-4" />
                <span className="font-medium uppercase">{branch || "Branch"}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span className="font-medium">Semester {semester}</span>
              </div>
              {subjectCode && (
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <BookOpenIcon className="w-4 h-4" />
                  <span className="font-medium uppercase">{subjectCode}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="items-center">
        {loading ? (
          <SkeletonLoading />
        ) : (
          <>
            {data.length === 0 ? (
              <NoDataFound />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {data.map((item, index) => (
                  <PostCard key={index} data={item} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyDoc;
