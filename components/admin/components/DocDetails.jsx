import { toast } from "sonner";
import { formatFileSize } from "@edgestore/react/utils";
import { useEffect, useState, useMemo } from "react";
import { DocumentTextIcon, TrashIcon } from "@heroicons/react/20/solid";

import ComboBox from "../ui/ComboBox";
import RoleSelect from "../ui/ListBox";
import FormField from "@/components/ui/FormField";
import { useFilterSubject } from "@/libs/hooks/useSubject";
import { useUniversity } from "@/libs/hooks/useUniversity";
import { semester, category } from "@/constants";
import { useBranchConfigs } from "@/libs/hooks/useBranchConfig";

const DocDetails = ({
  files,
  removeFile,
  fileDetails,
  setFileDetails,
  handlePreviousBtn,
}) => {
  const [subjectData, setSubjectData] = useState([]);
  const { data: branches } = useBranchConfigs();
  const { allUniversities } = useUniversity();

  const universitiesData = useMemo(() => {
    if (!allUniversities) return [];
    return allUniversities.map(u => ({
      id: u.id,
      name: u.name,
      link: u.id,
    }));
  }, [allUniversities]);

  const coursesData = useMemo(() => {
    if (!branches) return [];
    return branches.map(b => ({
      id: b.id,
      name: b.branch_name,
      link: b.branch_code,
    }));
  }, [branches]);

  const [userUniversity, setUserUniversity] = useState(null);
  const [userCourse, setUserCourses] = useState(null);

  useEffect(() => {
    if (universitiesData.length > 0 && !userUniversity) {
      setUserUniversity(universitiesData[0]);
    }
  }, [universitiesData, userUniversity]);

  useEffect(() => {
    if (coursesData.length > 0 && !userCourse) {
      setUserCourses(coursesData[0]);
    }
  }, [coursesData, userCourse]);
  const [userSemester, setUserSemester] = useState(semester[0]);
  const [userSubject, setUserSubject] = useState("");
  const [tempData, setTempData] = useState([]);

  // Derive branch config from branches list
  const branchConfig = useMemo(() => {
    return branches?.find(b => b.branch_code === userCourse?.link);
  }, [branches, userCourse]);

  // Filter semesters based on branch configuration
  const availableSemesters = useMemo(() => {
    if (!branchConfig) return semester; // Default to all 8 if no config
    return semester.slice(0, branchConfig.semester_count);
  }, [branchConfig]);

  // Reset semester selection when course changes
  useEffect(() => {
    if (availableSemesters.length > 0) {
      setUserSemester(availableSemesters[0]);
    }
  }, [availableSemesters]);

  const {
    data: fetchedData,
    error,
    isLoading: loading,
  } = useFilterSubject({
    course: userCourse?.link,
    semester: userSemester.link,
    university: userUniversity?.link,
  });

  useEffect(() => {
    if (fetchedData) {
      const subjects = fetchedData.map((data) => ({
        id: data.id,
        name: data.subject_name,
        link: data.subject_code,
      }));

      setSubjectData(subjects);
      // Set default value if userSubject is not already set
      if (!userSubject && subjects.length > 0) {
        setUserSubject(subjects[0]);
      }
    }

    if (error) {
      console.error("Error fetching subject data:", error);
      toast.error("Something went wrong in fetching subjects");
    }
  }, [fetchedData, error, userSubject]);

  // useEffect to update fileDetails when dependencies change
  useEffect(() => {
    setFileDetails(
      files.map((file, index) => ({
        title: tempData[index]?.title || file.name.replace(/\.[^/.]+$/, ""),
        description: tempData[index]?.description || "",
        category: tempData[index]?.category || category[0].name,
        university: userUniversity?.link,
        course: userCourse?.link,
        semester: userSemester.link,
        subject: userSubject,
      }))
    );
  }, [files, userUniversity, userCourse, userSubject, userSemester, setFileDetails, tempData]);

  useEffect(() => {
    setTempData(
      files.map(() => ({
        title: "",
        description: "",
        category: category[0].name,
      }))
    );
  }, [files]);

  const handleTitleChange = (index, value) => {
    const updatedTempData = [...tempData];
    updatedTempData[index].title = value;
    setTempData(updatedTempData);
  };

  const handleDescriptionChange = (index, value) => {
    const updatedTempData = [...tempData];
    updatedTempData[index].description = value;
    setTempData(updatedTempData);
  };

  const handleCategoryChange = (index, value) => {
    const updatedTempData = [...tempData];
    updatedTempData[index].category = value;
    setTempData(updatedTempData);
  };

  //Extract data
  const filteredCategory = category.map((data) => data.name);

  const styleDocDetails = {
    classlabel: "text-base-content font-medium md:font-semibold",
    classInput:
      "w-full bg-base-200 py-2 pl-3 pr-10 text-sm text-base-content font-medium rounded-lg",
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-between mb-4 items-center space-y-1 gap-4">
        <ComboBox
          value={userUniversity}
          onChange={setUserUniversity}
          data={universitiesData}
          label="Select University"
          zIndex={6}
          classLabel={styleDocDetails.classlabel}
          classInput={styleDocDetails.classInput}
        />
        <ComboBox
          value={userCourse}
          onChange={setUserCourses}
          data={coursesData}
          label="Enter the Course Name"
          zIndex={5}
          classLabel={styleDocDetails.classlabel}
          classInput={styleDocDetails.classInput}
        />
        <ComboBox
          value={userSemester}
          onChange={setUserSemester}
          data={availableSemesters}
          label="Enter the Semester"
          zIndex={4}
          classLabel={styleDocDetails.classlabel}
          classInput={styleDocDetails.classInput}
        />
        <ComboBox
          value={userSubject}
          onChange={setUserSubject}
          data={subjectData}
          label="Enter the Subject Name"
          zIndex={3}
          classLabel={styleDocDetails.classlabel}
          classInput={styleDocDetails.classInput}
          subTrue="subject"
          isloading={loading}
        />
      </div>
      <hr className="border-base-300 mx-2 my-4" />
      {files.length > 0 && (
        <div className="w-full">
          {files.map((file, index) => (
            <div key={index}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <DocumentTextIcon className="text-primary w-6" />
                  <p className="grid">
                    <span className="text-base-content font-medium text-sm">
                      {file.name}
                    </span>
                    <span className="text-xs text-base-content/60">{formatFileSize(file.size)}</span>
                  </p>
                </div>
                {files.length === 1 ? (
                  // If there are no files
                  <p className="text-error hover:text-error/80 w-5 cursor-pointer">
                    <TrashIcon
                      onClick={() => {
                        removeFile(index);
                        handlePreviousBtn();
                      }}
                    />
                  </p>
                ) : (
                  // If there are files
                  <p className="text-error hover:text-error/80 w-5 cursor-pointer">
                    <TrashIcon onClick={() => removeFile(index)} />
                  </p>
                )}
              </div>
              <hr className="border-base-300 mx-2 my-4" />
              <div className="space-y-4">
                <div className="flex flex-wrap lg:flex-nowrap justify-between w-full items-center lg:space-x-4 gap-4">
                  <div className="relative w-full lg:w-1/2">
                    <FormField
                      label="title"
                      type="text"
                      name={`text-${index}`}
                      placeholder="Enter your title here"
                      value={fileDetails[index]?.title || ""}
                      onChange={(e) => handleTitleChange(index, e.target.value)}
                      classLabel="label_form capitalize"
                      classInput="input_form"
                    />
                  </div>
                  <div className="relative w-full lg:w-1/2">
                    <label className="label_form capitalize mb-1 block">
                      category
                    </label>
                    <RoleSelect
                      value={fileDetails[index]?.category || ""}
                      onChange={(value) => handleCategoryChange(index, value)}
                      data={filteredCategory}
                      style={{ bg: "bg-base-200" }}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor={`description-${index}`}
                    className="label_form capitalize mb-1 block"
                  >
                    description
                  </label>
                  <textarea
                    id={`description-${index}`}
                    name={`description-${index}`}
                    rows="3"
                    className="input_form"
                    placeholder="Write document description here"
                    value={fileDetails[index]?.description || ""}
                    onChange={(e) =>
                      handleDescriptionChange(index, e.target.value)
                    }
                  ></textarea>
                </div>
              </div>
              <hr className="border-base-300 mx-2 my-4" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocDetails;
