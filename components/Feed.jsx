"use client"
import { useMemo } from "react";
import DataCard from "./cards/DataCard";
import { useBranchConfigs } from "@/libs/hooks/useBranchConfig";
import SkeletonLoading from "./ui/SkeletonLoading";
import { books } from "@/public/icons";

const Feed = ({ label, styleHead, style, university }) => {
  const { data: branches, isLoading, error } = useBranchConfigs();

  // Filter branches by university
  const filteredBranches = useMemo(() => {
    if (!branches || !university) return branches || [];

    // Filter branches that have this university in their universities array
    // If universities array is empty, show the branch to all universities (backward compatibility)
    return branches.filter((branch) => {
      const universityList = branch.universities || [];
      return universityList.length === 0 || universityList.includes(university);
    });
  }, [branches, university]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-base-content to-base-content/60 ${styleHead}`}>
          {label}
        </h2>
        {/* Optional: Add a 'View All' link here if needed */}
      </div>

      {isLoading ? (
        <div className="mt-4">
          <SkeletonLoading />
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-base-200/50 rounded-2xl border border-base-content/5">
          <p className="text-error font-medium">Failed to load branches</p>
        </div>
      ) : filteredBranches && filteredBranches.length > 0 ? (
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 md:gap-4 ${style}`}>
          {filteredBranches.map((item, index) => {
            return (
              <DataCard
                key={item.id}
                hrefData={{
                  pathname: `/semester`,
                  query: { university: university, branch: item.branch_code },
                }}
                data={{
                  id: item.id,
                  name: item.branch_name,
                  link: item.branch_code,
                  imgUrl: item.logo || books,
                  description: `${item.semester_count} Semesters • ${item.branch_code}`
                }}
                altMsg={`${item.branch_name} - ${item.semester_count} Semesters`}
                style="h-full transform transition-all duration-300 hover:scale-105"
                styleContent="h-full flex flex-col justify-between"
                syleName="mb-1"
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No branches available for your university. Please contact admin.</p>
        </div>
      )}
    </div>
  );
};

export default Feed;

