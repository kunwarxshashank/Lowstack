"use client";
import { category } from "@/constants";
import { useSearchParams } from "next/navigation";
import DataCard from "@/components/cards/DataCard";
import useSWR from "swr";
import { fetcher } from "@/libs/fetcher";
import { SmallLoading } from "@/public/assets";
import { useMemo } from "react";

const CategorySelect = () => {
    const searchParams = useSearchParams();
    const branch = searchParams.get("branch");
    const semester = searchParams.get("semester");
    const subjectCode = searchParams.get("subjectCode");

    const { data: subjects, isLoading } = useSWR(
        branch && semester ? `/api/subject/filter/${branch}/${semester}` : null,
        fetcher
    );

    const currentSubject = subjects?.find((s) => s.subject_code === subjectCode);

    const displayedCategories = useMemo(() => {
        if (!currentSubject?.allowed_categories || currentSubject.allowed_categories.length === 0) {
            return category;
        }
        return category.filter((cat) => currentSubject.allowed_categories.includes(cat.name));
    }, [currentSubject]);

    if (isLoading) {
        return (
            <div className="w-full h-[50vh] flex items-center justify-center">
                <SmallLoading />
            </div>
        );
    }

    return (
        <div>
            <h1 className="select_header">Select Category</h1>
            <div className="item-center">
                <div className="grid grid-cols-2 mt-[18px] gap-[18px]">
                    {displayedCategories.map((cat, index) => {
                        return (
                            <DataCard
                                key={index}
                                hrefData={{
                                    pathname: `/view-doc`,
                                    query: {
                                        branch: branch,
                                        semester: semester,
                                        subjectCode: subjectCode,
                                        category: cat.name,
                                    },
                                }}
                                data={cat}
                                altMsg={cat.description}
                                style="py-2"
                                syleName="text-base-content"
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CategorySelect;
