import axios from "axios";
import { toast } from "sonner";
import { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import { PlusIcon, BookOpenIcon, PencilSquareIcon, XMarkIcon } from "@heroicons/react/20/solid";

import ComboBox from "../ui/ComboBox";
import { SmallLoading } from "@/public/assets";
import { useBranchConfigs } from "@/libs/hooks/useBranchConfig";
import { useUniversity } from "@/libs/hooks/useUniversity";
import { SubjectValidation } from "@/libs/validations/subject";
import { category } from "@/constants";

const AddSubject = ({ editSubject, setEditSubject }) => {
    const { data: session } = useSession();
    const { data: branchConfigs, isLoading: branchLoading } = useBranchConfigs();
    const { allUniversities } = useUniversity();
    const [isLoading, setIsLoading] = useState(false);

    const [subjectCode, setsubjectCode] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState(
        category.map(c => c.name)
    );

    // Transform universities into ComboBox format
    const universityOptions = useMemo(() => {
        if (!allUniversities || allUniversities.length === 0) return [];
        return allUniversities.map((uni) => ({
            id: uni.id,
            name: uni.name,
            link: uni.id,
        }));
    }, [allUniversities]);

    // Transform branch configs into ComboBox format
    const branchOptions = useMemo(() => {
        if (!branchConfigs || branchConfigs.length === 0) return [];
        return branchConfigs.map((branch) => ({
            id: branch.id,
            name: branch.branch_name,
            link: branch.branch_code,
            imgUrl: branch.logo || null,
            semester_count: branch.semester_count,
        }));
    }, [branchConfigs]);

    // Generate semester options based on selected branch
    const semesterOptions = useMemo(() => {
        if (!selectedBranch) return [];

        const semesterNames = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth"];
        const count = selectedBranch.semester_count || 8;

        return Array.from({ length: count }, (_, index) => ({
            id: index + 1,
            name: semesterNames[index],
            link: (index + 1).toString(),
        }));
    }, [selectedBranch]);

    // Set default university when data loads
    useEffect(() => {
        if (universityOptions.length > 0 && !selectedUniversity) {
            setSelectedUniversity(universityOptions[0]);
        }
    }, [universityOptions, selectedUniversity]);

    // Set default branch when data loads
    useEffect(() => {
        if (branchOptions.length > 0 && !selectedBranch) {
            setSelectedBranch(branchOptions[0]);
        }
    }, [branchOptions, selectedBranch]);

    // Set default semester when branch changes
    useEffect(() => {
        if (semesterOptions.length > 0 && !selectedSemester) {
            setSelectedSemester(semesterOptions[0]);
        }
    }, [semesterOptions, selectedSemester]);

    // Populate form when editSubject changes
    useEffect(() => {
        if (editSubject && branchOptions.length > 0 && universityOptions.length > 0) {
            // Set university
            if (editSubject.university) {
                const university = universityOptions.find(u => u.link === editSubject.university);
                if (university) {
                    setSelectedUniversity(university);
                }
            }
            
            const branch = branchOptions.find(b => b.link === editSubject.course_name);
            if (branch) {
                setSelectedBranch(branch);
                // We need to wait for semester options to update based on branch
                // This might need a separate effect or careful ordering, but let's try setting it directly if options are available
                // or rely on the user to re-select if it doesn't match perfectly.
                // Better approach: derive semester from the branch count.
                const semCount = branch.semester_count || 8;
                const semesterNames = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth"];
                const semIndex = parseInt(editSubject.semester_code) - 1;
                if (semIndex >= 0 && semIndex < semCount) {
                    setSelectedSemester({
                        id: semIndex + 1,
                        name: semesterNames[semIndex],
                        link: (semIndex + 1).toString(),
                    });
                }
            }
            setsubjectCode(editSubject.subject_code);
            setSubjectName(editSubject.subject_name);
            setSelectedCategories(editSubject.allowed_categories || []);
        }
    }, [editSubject, branchOptions, universityOptions]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate user input using the schema
        const userInput = {
            courseName: selectedBranch?.link,
            userSemester: selectedSemester?.link,
            subjectCode,
            subjectName,
        };

        try {
            // Validate the user input
            const validation = SubjectValidation.addSubject.safeParse(userInput);

            //if validation is failure, return error message
            if (validation.success === false) {
                const { issues } = validation.error;
                issues.forEach((err) => {
                    toast.error(err.message);
                });
            } else {
                // If validation is successful, make the API request
                let response;
                if (editSubject) {
                    response = await axios.put("/api/subject", {
                        id: editSubject.id,
                        courseName: selectedBranch?.link,
                        userSemester: selectedSemester?.link,
                        subjectCode,
                        subjectName,
                        university: selectedUniversity?.link,
                        allowedCategories: selectedCategories,
                    });
                } else {
                    response = await axios.post("/api/subject", {
                    courseName: selectedBranch?.link,
                    userSemester: selectedSemester?.link,
                    subjectCode,
                    subjectName,
                    userEmail: session?.user?.email,
                        university: selectedUniversity?.link,
                        allowedCategories: selectedCategories,
                });
                }

                if (response.statusText === "FAILED") {
                    toast.error(response.data);
                } else {
                    toast.success(editSubject ? "Subject updated successfully!" : "Subject created successfully!");
                    handleReset();
                    // Refresh the page or trigger a data refetch
                    window.location.reload();
                }
            }
        } catch (error) {
            console.error("Error creating/updating subject: " + error);
            toast.error("Failed to save subject. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setsubjectCode("");
        setSubjectName("");
        if (universityOptions.length > 0) {
            setSelectedUniversity(universityOptions[0]);
        }
        if (branchOptions.length > 0) {
            setSelectedBranch(branchOptions[0]);
        }
        if (semesterOptions.length > 0) {
            setSelectedSemester(semesterOptions[0]);
        }
        setSelectedCategories(category.map(c => c.name));
        if (setEditSubject) setEditSubject(null);
    };

    // Show loading state while fetching branch configs
    if (branchLoading) {
        return (
            <div className="w-full mx-auto space-y-4">
                <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 p-6">
                    <div className="flex items-center justify-center gap-2.5">
                        <SmallLoading />
                        <span className="text-sm text-base-content/70">Loading branch configurations...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Show message if no branches configured
    if (!branchOptions || branchOptions.length === 0) {
        return (
            <div className="w-full mx-auto space-y-4">
                <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 p-6">
                    <div className="text-center">
                        <BookOpenIcon className="w-10 h-10 text-base-content/40 mx-auto mb-3" />
                        <h3 className="text-base font-semibold text-base-content mb-1.5">
                            No Branches Configured
                        </h3>
                        <p className="text-sm text-base-content/60">
                            Please configure branches in Branch Config before adding subjects.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto space-y-4">
            <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 overflow-hidden">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/5 px-4 sm:px-5 py-3 border-b border-base-300">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-primary/10 rounded-lg">
                            <BookOpenIcon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-base-content">
                                {editSubject ? "Edit Subject" : "Add New Subject"}
                            </h2>
                            <p className="text-base-content/70 text-xs mt-0.5">
                                {editSubject ? "Update existing subject details" : "Create a new subject for your course curriculum"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-4 sm:p-5">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
                            {/* University */}
                            <div className="form-control w-full">
                                <label className="label py-1">
                                    <span className="label-text text-sm font-medium text-base-content/80">
                                        University
                                    </span>
                                </label>
                                <ComboBox
                                    value={selectedUniversity}
                                    onChange={setSelectedUniversity}
                                    data={universityOptions}
                                    label=""
                                    zIndex={6}
                                    classLabel="hidden"
                                    classInput="select select-sm select-bordered w-full bg-base-100 focus:border-primary focus:outline-none"
                                />
                            </div>

                            {/* Course Name */}
                            <div className="form-control w-full">
                                <label className="label py-1">
                                    <span className="label-text text-sm font-medium text-base-content/80">
                                        Branch
                                    </span>
                                </label>
                                <ComboBox
                                    value={selectedBranch}
                                    onChange={(branch) => {
                                        setSelectedBranch(branch);
                                        setSelectedSemester(null); // Reset semester when branch changes
                                    }}
                                    data={branchOptions}
                                    label=""
                                    zIndex={5}
                                    classLabel="hidden"
                                    classInput="select select-sm select-bordered w-full bg-base-100 focus:border-primary focus:outline-none"
                                />
                            </div>

                            {/* Semester */}
                            <div className="form-control w-full">
                                <label className="label py-1">
                                    <span className="label-text text-sm font-medium text-base-content/80">
                                        Semester
                                    </span>
                                </label>
                                <ComboBox
                                    value={selectedSemester}
                                    onChange={setSelectedSemester}
                                    data={semesterOptions}
                                    label=""
                                    zIndex={4}
                                    classLabel="hidden"
                                    classInput="select select-sm select-bordered w-full bg-base-100 focus:border-primary focus:outline-none"
                                />
                                <label className="label py-1">
                                    <span className="label-text-alt text-xs text-base-content/60">
                                        {selectedBranch?.name} has {selectedBranch?.semester_count} semesters
                                    </span>
                                </label>
                            </div>

                            {/* Subject Code */}
                            <div className="form-control w-full">
                                <label className="label py-1">
                                    <span className="label-text text-sm font-medium text-base-content/80">
                                        Subject Code
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={subjectCode}
                                    onChange={(e) => setsubjectCode(e.target.value)}
                                    placeholder="e.g., CS101, MATH201"
                                    className="input input-sm input-bordered w-full uppercase bg-base-100 focus:border-primary focus:outline-none"
                                    required
                                />
                            </div>

                            {/* Subject Name */}
                            <div className="form-control w-full">
                                <label className="label py-1">
                                    <span className="label-text text-sm font-medium text-base-content/80">
                                        Subject Name
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={subjectName}
                                    onChange={(e) => setSubjectName(e.target.value)}
                                    placeholder="e.g., Data Structures"
                                    className="input input-sm input-bordered w-full capitalize bg-base-100 focus:border-primary focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Category Toggles */}
                        <div className="form-control w-full mb-4">
                            <label className="label py-1">
                                <span className="label-text text-sm font-medium text-base-content/80">
                                    Enabled Categories
                                </span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 border border-base-200 rounded-lg bg-base-50/50">
                                {category.map((cat) => (
                                    <label key={cat.id} className="label cursor-pointer justify-start gap-3 hover:bg-base-100 p-2 rounded-lg transition-colors">
                                        <input
                                            type="checkbox"
                                            className="toggle toggle-primary toggle-xs"
                                            checked={selectedCategories.includes(cat.name)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedCategories([...selectedCategories, cat.name]);
                                                } else {
                                                    setSelectedCategories(selectedCategories.filter(c => c !== cat.name));
                                                }
                                            }}
                                        />
                                        <div className="flex items-center gap-2">
                                            <span className="label-text text-sm font-medium">{cat.name}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-base-200">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn btn-sm btn-primary gap-2 flex-1 sm:flex-initial"
                            >
                                {isLoading ? (
                                    <>
                                        <SmallLoading />
                                        <span className="text-sm">{editSubject ? "Updating..." : "Creating Subject..."}</span>
                                    </>
                                ) : (
                                    <>
                                        {editSubject ? <PencilSquareIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
                                        <span className="text-sm">{editSubject ? "Update Subject" : "Add Subject"}</span>
                                    </>
                                )}
                            </button>
                            {editSubject && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    disabled={isLoading}
                                    className="btn btn-sm btn-error btn-outline gap-2"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                    <span className="text-sm">Cancel Edit</span>
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={isLoading}
                                className="btn btn-sm btn-ghost gap-2"
                            >
                                <span className="text-sm">Reset Form</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Info Card */}
            <div className="alert alert-info shadow-sm py-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                    <h3 className="font-semibold text-sm">Quick Tip</h3>
                    <div className="text-xs">Subject codes should be unique. Use uppercase letters and numbers for consistency.</div>
                </div>
            </div>
        </div>
    );
};

export default AddSubject;
