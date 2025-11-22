"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { semester } from "@/constants";
import DataCard from "@/components/cards/DataCard";
import { usePostStore } from "@/libs/state/useStore";
import NoDataFound from "@/components/ui/NoDataFound";
import { filterSyllabus } from "@/libs/hooks/usefilter";
import PostViewDialogBox from "@/components/models/PostViewDialogBox";

const UserSemester = () => {
  const searchParams = useSearchParams();
  const course = searchParams.get("name");
  const category = searchParams.get("category");

  const fetchedData = usePostStore((state) => state.posts);

  const [isPostOpen, setIsPostOpen] = useState(false);
  const [data, setData] = useState(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchData = async () => {
      try {
        const post = await filterSyllabus([course, category], fetchedData?.data);
        const [syllabusData] = post.map((items) => items);

        if (syllabusData) {
          setIsPostOpen(true);
          setData(syllabusData);
        } else {
          // Handle case where data is not found
          setIsPostOpen(false);
          setData(null);
        }
      } catch (error) {
        // Handle error
        console.error("Error fetching syllabus data:", error);
      }
    };

    if (category === "Syllabus") {
      fetchData();
    }
  }, [category, course, fetchedData]);

  return (
    <div>
      <h1 className="select_header">Select Semester</h1>
      <div className="items-center">
          <div className="grid grid-cols-2 mt-[18px] gap-[18px]">
            {semester.map((sem, index) => (
              <DataCard
                key={index}
                hrefData={{
                  pathname: `/view-subjects`,
                  query: { name: course, category: category, sem: sem.link },
                }}
                data={sem}
                altMsg="select your semester"
                style="py-2"
                syleName="text-base-content"
                sem="Semester"
              />
            ))}
          </div>
      </div>
      {/* {isPostOpen && data && (
        <PostViewDialogBox
          isOpen={isPostOpen}
          setIsOpen={setIsPostOpen}
          data={data}
        />
      )} */}
    </div>
  );
};

export default UserSemester;
