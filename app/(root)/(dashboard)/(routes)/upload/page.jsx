// Modified Upload Component for Local Server Storage with Enhanced Error Handling
"use client";

import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

import { PostValidation } from "@/libs/validations/post";
import UploadDoc from "@/components/admin/components/UploadDoc";
import DocDetails from "@/components/admin/components/DocDetails";
import UploadDoneModel from "@/components/admin/ui/UploadDoneModel";

const Stepper = dynamic(() => import("@/components/admin/ui/Stepper"));

const Upload = () => {
  const { data: session } = useSession();

  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  // For local server storage
  const [fileStates, setFileStates] = useState([]);
  const [uploadRes, setUploadRes] = useState([]);
  const [files, setFiles] = useState([]);
  const [fileDetails, setFileDetails] = useState([]);

  const steps = ["UPLOAD", "DETAILS", "DONE"];

  const getSectionComponent = () => {
    switch (activeStep) {
      case 0:
        return (
          <UploadDoc
            files={files}
            setFiles={setFiles}
            removeFile={removeFile}
            value={fileStates}
            onChange={setFileStates}
            onFilesAdded={async (addedFiles) => {
              setFileStates([...fileStates, ...addedFiles]);
            }}
          />
        );
      case 1:
        return (
          <DocDetails
            files={files}
            removeFile={removeFile}
            setFileDetails={setFileDetails}
            fileDetails={fileDetails}
            handlePreviousBtn={handlePreviousBtn}
          />
        );
      default:
        return null;
    }
  };

  const updateFileProgress = (key, progress) => {
    setFileStates((fileStates) => {
      const newFileStates = [...fileStates];
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  };

  const removeFile = (fileIndex) => {
    const updatedFiles = [...files];
    updatedFiles.splice(fileIndex, 1);
    setFiles(updatedFiles);
    const updatedFile = [...fileStates];
    updatedFile.splice(fileIndex, 1);
    setFileStates(updatedFile);
  };

  const handlePreviousBtn = () => {
    setActiveStep(activeStep - 1);
  };

  // Enhanced error handling for file upload
  const handleUploadError = (error, fileName) => {
    console.error('Upload error:', error);
    
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          if (data.error?.includes('duplicate') || data.message?.includes('duplicate')) {
            toast.error(`Duplicate file: ${fileName} already exists`);
          } else if (data.error?.includes('file type') || data.message?.includes('file type')) {
            toast.error(`Invalid file type for ${fileName}`);
          } else if (data.error?.includes('size') || data.message?.includes('size')) {
            toast.error(`File size too large for ${fileName}`);
          } else {
            toast.error(`Upload failed for ${fileName}: ${data.message || data.error || 'Bad request'}`);
          }
          break;
        case 413:
          toast.error(`File ${fileName} is too large`);
          break;
        case 415:
          toast.error(`Unsupported file type for ${fileName}`);
          break;
        case 409:
          toast.error(`Duplicate file: ${fileName} already exists`);
          break;
        case 500:
          toast.error(`Server error while uploading ${fileName}`);
          break;
        default:
          toast.error(`Failed to upload ${fileName}: ${data.message || data.error || `Error ${status}`}`);
      }
    } else if (error.request) {
      toast.error(`Network error while uploading ${fileName}`);
    } else {
      toast.error(`Failed to upload ${fileName}: ${error.message}`);
    }
  };

  // Modified handleNextBtn for local server upload with enhanced error handling
  const handleNextBtn = async () => {
    setIsLoading(true);

    if (fileStates.length < 1) {
      toast.error("One document must be selected for the next step");
      setIsLoading(false);
      return;
    }

    try {
      await Promise.all(
        fileStates.map(async (fileState) => {
          try {
            if (fileState.progress !== "PENDING") return;

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('file', fileState.file);
            formData.append('userId', session.user.id || session.user.email);
            formData.append('uploadType', 'document');

            // Upload to your local server
            const response = await axios.post('/api/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              onUploadProgress: (progressEvent) => {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                updateFileProgress(fileState.key, progress);
              },
            });

            // Handle successful upload
            if (response.data.success) {
              updateFileProgress(fileState.key, "COMPLETE");
              setUploadRes((uploadRes) => [
                ...uploadRes,
                {
                  url: response.data.fileUrl, // URL from your server
                  filename: fileState.file.name,
                  path: response.data.filePath, // Server file path
                  id: response.data.fileId, // File ID from your database
                },
              ]);
            } else {
              throw new Error(response.data.message || 'Upload failed');
            }
          } catch (err) {
            handleUploadError(err, fileState.file.name);
            updateFileProgress(fileState.key, "ERROR");
          }
        })
      );
      setActiveStep(activeStep + 1);
    } catch (error) {
      console.error("An error occurred during file upload:", error);
      toast.error("An error occurred during file upload");
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced error handling for submission
  const handleSubmissionError = (error) => {
    console.error("Submission error:", error);
    
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          if (data.error?.includes('duplicate') || data.message?.includes('duplicate')) {
            toast.error("Duplicate post: A post with similar content already exists");
          } else if (data.error?.includes('validation') || data.message?.includes('validation')) {
            toast.error(`Validation error: ${data.message || data.error}`);
          } else {
            toast.error(`Submission failed: ${data.message || data.error || 'Invalid data'}`);
          }
          break;
        case 401:
          toast.error("Unauthorized: Please log in again");
          break;
        case 403:
          toast.error("Forbidden: You don't have permission to create posts");
          break;
        case 409:
          toast.error("Conflict: Post with similar title or content already exists");
          break;
        case 422:
          toast.error(`Validation error: ${data.message || data.error || 'Invalid input data'}`);
          break;
        case 413:
          toast.error("Request too large: Please reduce the content size");
          break;
        case 500:
          toast.error("Server error: Please try again later");
          break;
        case 503:
          toast.error("Service unavailable: Please try again later");
          break;
        default:
          toast.error(`Submission failed: ${data.message || data.error || `Error ${status}`}`);
      }
    } else if (error.request) {
      toast.error("Network error: Please check your connection and try again");
    } else {
      toast.error(`Submission failed: ${error.message}`);
    }
  };

  const handleSubmitBtn = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const validationResults = fileDetails.map((fileDetail) => {
      const userInput = {
        postTitle: fileDetail.title,
        postDesc: fileDetail.description,
      };
      return PostValidation.addPost.safeParse(userInput);
    });

    try {
      const hasValidationErrors = validationResults.some(
        (validation) => validation.success === false
      );

      if (hasValidationErrors) {
        validationResults.forEach((validation, index) => {
          if (validation.success === false) {
            const { issues } = validation.error;
            issues.forEach((err) => {
              toast.error(
                `Validation error for "${fileDetails[index].title}": ${err.message}`
              );
            });
          }
        });
      } else {
        // Submit to your post creation API
        const response = await axios.post("/api/post", {
          fileDetails,
          uploadRes,
          userEmail: session.user.email,
        });

        if (response.data.success) {
          setSubmitModalOpen(true);
          toast.success(response.data.message || "Posts created successfully!");
        } else {
          // Handle API response indicating failure but with 200 status
          if (response.data.error?.includes('duplicate') || response.data.message?.includes('duplicate')) {
            toast.error("Duplicate post: A post with similar content already exists");
          } else {
            toast.error(response.data.message || response.data.error || "Failed to create post");
          }
        }
      }
    } catch (error) {
      handleSubmissionError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex-col items-center mt-5">
        <h3 className="text-base-800 text-3xl font-bold text-center">
          Upload document
        </h3>
        <p className="text-base-800 mt-2 text-sm font-medium text-center align-bottom mb-2">
          Upload your summaries and other study documents to LowStack
        </p>
      </div>

      <Stepper steps={steps} activeStep={activeStep} />

      <div className="bg-[#1d232a] p-3 rounded-lg mt-5 border border-green-400 w-full max-h-[490px] mb-5 overflow-auto">
        {getSectionComponent()}
      </div>

      <div className="md:w-full md:flex md:justify-end">
        {activeStep !== 0 && (
          <button
            onClick={handlePreviousBtn}
            className="btn bg-[#1d232a] text-white w-[11rem] text-center border-green-400 border hover:border-green-400 right-0"
          >
            Previous
          </button>
        )}
        {activeStep !== steps.length - 1 && (
          <div
            onClick={activeStep === 0 ? handleNextBtn : handleSubmitBtn}
            className="btn bg-[#1d232a] text-white w-[11rem] text-center border-green-400 border hover:border-green-400 right-0"
          >
            {activeStep === 0 ? "Upload" : "Submit"}
            {isLoading && "ing..."}
          </div>
        )}
      </div>

      {submitModalOpen && (
        <UploadDoneModel
          isOpen={submitModalOpen}
          setIsOpen={setSubmitModalOpen}
        />
      )}
    </div>
  );
};

export default Upload;