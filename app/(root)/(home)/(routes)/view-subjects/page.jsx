"use client";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BookOpenIcon, AcademicCapIcon, SparklesIcon } from "@heroicons/react/24/outline";

import SubCard from "@/components/cards/SubCard";
import NoDataFound from "@/components/ui/NoDataFound";
import { useFilterSubject } from "@/libs/hooks/useSubject";
import SkeletonLoading from "@/components/ui/SkeletonLoading";

const ViewSubjects = () => {
  const searchParams = useSearchParams();
  const university = searchParams.get("university");
  const branch = searchParams.get("branch");
  const semester = searchParams.get("semester");

  const {
    data: fetchedData,
    error,
    isLoading: loading,
  } = useFilterSubject({ course: branch, semester, university });

  useEffect(() => {
    if (fetchedData) {
      setUserSelectedData(fetchedData);
    }
    if (error) {
      console.error("Error fetching table data:", error);
      toast.error("Something went wrong in fetching Subjects");
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
            <BookOpenIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-2">
              Select Your Subject
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
            </div>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
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
                  <SubCard
                    key={index}
                    hrefData={{
                      pathname: `/category-select`,
                      query: {
                        university: university,
                        branch: branch,
                        semester: semester,
                        subjectCode: item.subject_code,
                      },
                    }}
                    data={item}
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
export default ViewSubjects;
