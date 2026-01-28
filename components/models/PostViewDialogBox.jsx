"use client";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import { saveAs } from "file-saver";
import { useRouter } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";
import {
  ShareIcon,
  XMarkIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CalendarIcon,
  TagIcon,
  FlagIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  TrashIcon,
  HeartIcon
} from "@heroicons/react/24/outline";
import {
  HandThumbUpIcon as HandThumbUpSolidIcon,
  HandThumbDownIcon as HandThumbDownSolidIcon,
  EyeIcon as EyeSolidIcon,
  HeartIcon as HeartSolidIcon
} from "@heroicons/react/24/solid";
import { handlesharebtn } from "@/libs/utils";
import axios from "axios";

const PostViewDialogBox = ({ isOpen, setIsOpen, data }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [postData, setPostData] = useState(data);
  const [isLoading, setIsLoading] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("Broken Link");
  const [reportDescription, setReportDescription] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isTogglingFavourite, setIsTogglingFavourite] = useState(false);

  // Only update state when modal opens with new data
  useEffect(() => {
    if (isOpen && data?.id) {
      setPostData(data);
      setHasViewed(false);
      fetchComments(data.id);
      if (session) {
        checkFavouriteStatus(data.id);
      }
    }
  }, [isOpen, data?.id, session]);

  const checkFavouriteStatus = async (postId) => {
    try {
      const res = await axios.get(`/api/post/favourite?postId=${postId}`);
      setIsFavourite(res.data.isFavourite);
    } catch (error) {
      console.error("Error checking favourite status", error);
    }
  };

  const handleToggleFavourite = async () => {
    if (!session) {
      toast.error("Please login to add to favourites");
      return;
    }
    if (isTogglingFavourite) return;

    setIsTogglingFavourite(true);
    try {
      const res = await axios.post("/api/post/favourite", { postId: postData.id });
      setIsFavourite(res.data.isFavourite);
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Failed to update favourites");
    } finally {
      setIsTogglingFavourite(false);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await axios.get(`/api/comments?postId=${postId}`);
      setComments(res.data);
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const res = await axios.post("/api/comments", {
        postId: postData.id,
        content: newComment
      });
      setComments([res.data, ...comments]);
      setNewComment("");
      toast.success("Comment added!");
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/comments?commentId=${commentId}`);
      setComments(comments.filter(c => c.id !== commentId));
      toast.success("Comment deleted");
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    setIsSubmittingReport(true);
    try {
      await axios.post("/api/reports", {
        postId: postData.id,
        reason: reportReason,
        description: reportDescription
      });
      toast.success("Report submitted successfully");
      setIsReportOpen(false);
      setReportDescription("");
      setReportReason("Broken Link");
    } catch (error) {
      toast.error("Failed to submit report");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  // Increment view count when dialog opens (only once)
  useEffect(() => {
    if (isOpen && postData?.id && !hasViewed) {
      incrementView();
      setHasViewed(true);
    }
  }, [isOpen, postData?.id, hasViewed]);

  const incrementView = async () => {
    try {
      const response = await axios.post("/api/post/interaction", {
        postId: postData.id,
        action: "view",
      });

      if (response.data.success) {
        setPostData(response.data.data);
      }
    } catch (error) {
      console.error("Error incrementing view:", error);
    }
  };

  const handleLike = async () => {
    if (isLoading) return;

    // Update UI instantly (optimistic update)
    const currentLikes = postData.likes || 0;
    setPostData(prev => ({
      ...prev,
      likes: currentLikes + 1
    }));

    setIsLoading(true);
    try {
      const response = await axios.post("/api/post/interaction", {
        postId: postData.id,
        action: "like",
      });

      if (response.data.success) {
        // Confirm with server data
        setPostData(prev => ({
          ...prev,
          likes: response.data.data.likes,
          views: response.data.data.views,
          dislikes: response.data.data.dislikes
        }));
      } else {
        // Revert on failure
        setPostData(prev => ({
          ...prev,
          likes: currentLikes
        }));
      }
    } catch (error) {
      console.error("Error liking post:", error);
      // Revert on error
      setPostData(prev => ({
        ...prev,
        likes: currentLikes
      }));
      toast.error("Failed to like post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDislike = async () => {
    if (isLoading) return;

    // Update UI instantly (optimistic update)
    const currentDislikes = postData.dislikes || 0;
    setPostData(prev => ({
      ...prev,
      dislikes: currentDislikes + 1
    }));

    setIsLoading(true);
    try {
      const response = await axios.post("/api/post/interaction", {
        postId: postData.id,
        action: "dislike",
      });

      if (response.data.success) {
        // Confirm with server data
        setPostData(prev => ({
          ...prev,
          likes: response.data.data.likes,
          views: response.data.data.views,
          dislikes: response.data.data.dislikes
        }));
      } else {
        // Revert on failure
        setPostData(prev => ({
          ...prev,
          dislikes: currentDislikes
        }));
        toast.error("Failed to dislike post");
      }
    } catch (error) {
      console.error("Error disliking post:", error);
      // Revert on error
      setPostData(prev => ({
        ...prev,
        dislikes: currentDislikes
      }));
    } finally {
      setIsLoading(false);
    }
  };

  function closeModal() {
    setIsOpen(false);
  }

  const handleDownload = (url, filename) => {
    saveAs(url, `Lowstack.in_${filename}`);
    toast.success("Download started!");
  };

  const handleOpen = () => {
    const embedUrl = `/embedfile?url=${encodeURIComponent(postData.file_url)}&title=${encodeURIComponent(postData.title)}`;
    router.push(embedUrl);
    closeModal();
  };

  const SharePost = {
    title: "",
    content: `Hey! Check out ${postData.course_name} ${postData.title} on LowStack.in!\n#${postData.subject_name.replace(/\s/g, "")}\n`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/post/${postData.id.slice(15)}/${postData.title.replace(/\s+/g, "-")}`,
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        {/* Background overlay with blur */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {/* Modern Dialog Panel */}
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-base-100 to-base-200 shadow-2xl transition-all border border-base-content/10">
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-1.5 sm:p-2 rounded-full bg-base-content/10 hover:bg-base-content/20 transition-all duration-300 hover:rotate-90"
                >
                  <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-base-content" />
                </button>

                {/* Header with gradient */}
                <div className="relative bg-gradient-to-r from-primary via-secondary to-accent p-4 sm:p-6 md:p-8 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                  <div className="relative z-10 pr-8 sm:pr-0">
                    <Dialog.Title className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight mb-2 sm:mb-3">
                      {postData.title}
                    </Dialog.Title>

                    {/* Stats Bar */}
                    <div className="flex items-center flex-wrap gap-3 sm:gap-4 text-white/90 text-xs sm:text-sm font-medium">
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <EyeSolidIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>{postData.views || 0} views</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <HandThumbUpSolidIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>{postData.likes || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <HandThumbDownSolidIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>{postData.dislikes || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
                  {/* Description */}
                  {postData.description && (
                    <div className="bg-base-200/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <Dialog.Description className="text-sm sm:text-base text-base-content/80 leading-relaxed">
                        {postData.description}
                      </Dialog.Description>
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="bg-base-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-base-content/5 hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-base-content/60 text-xs sm:text-sm mb-1">
                        <AcademicCapIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>University</span>
                      </div>
                      <p className="text-base-content font-semibold uppercase text-xs sm:text-sm truncate">
                        {postData.university || "N/A"}
                      </p>
                    </div>

                    <div className="bg-base-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-base-content/5 hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-base-content/60 text-xs sm:text-sm mb-1">
                        <BookOpenIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Course</span>
                      </div>
                      <p className="text-base-content font-semibold uppercase text-xs sm:text-sm truncate">
                        {postData.course_name}
                      </p>
                    </div>

                    <div className="bg-base-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-base-content/5 hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-base-content/60 text-xs sm:text-sm mb-1">
                        <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Semester</span>
                      </div>
                      <p className="text-base-content font-semibold text-xs sm:text-sm">
                        Semester {postData.semester_code}
                      </p>
                    </div>

                    <div className="bg-base-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-base-content/5 hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-base-content/60 text-xs sm:text-sm mb-1">
                        <TagIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Category</span>
                      </div>
                      <p className="text-base-content font-semibold text-xs sm:text-sm truncate">
                        {postData.category}
                      </p>
                    </div>
                  </div>

                  {/* Subject Badge */}
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-primary/20">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary/20 rounded-lg">
                        <BookOpenIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-base-content/60 font-medium">Subject</p>
                        <p className="text-sm sm:text-base text-base-content font-bold truncate">{postData.subject_name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {/* Like/Dislike Row */}
                    <div className="flex gap-2 justify-center sm:justify-start">
                      <button
                        onClick={handleLike}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold bg-primary/10 text-primary hover:bg-primary hover:text-primary-content transition-all duration-300 active:scale-95 sm:hover:scale-105 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <HandThumbUpIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">{postData.likes || 0}</span>
                      </button>

                      <button
                        onClick={handleDislike}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold bg-error/10 text-error hover:bg-error hover:text-error-content transition-all duration-300 active:scale-95 sm:hover:scale-105 hover:shadow-lg hover:shadow-error/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <HandThumbDownIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">{postData.dislikes || 0}</span>
                      </button>

                      {/* Report Button */}
                      <button
                        onClick={() => setIsReportOpen(true)}
                        className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold bg-base-content/5 text-base-content/70 hover:bg-error/10 hover:text-error transition-all duration-300 active:scale-95 sm:hover:scale-105 hover:shadow-lg hover:shadow-error/10"
                        title="Report this note"
                      >
                        <FlagIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>

                      {/* Favourite Button */}
                      <button
                        onClick={handleToggleFavourite}
                        disabled={isTogglingFavourite}
                        className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold transition-all duration-300 active:scale-95 sm:hover:scale-105 hover:shadow-lg ${isFavourite
                            ? "bg-rose-100 text-rose-500 hover:bg-rose-200 hover:shadow-rose-200/30"
                            : "bg-base-content/5 text-base-content/70 hover:bg-rose-50 hover:text-rose-500 hover:shadow-rose-100/30"
                          }`}
                        title={isFavourite ? "Remove from favourites" : "Add to favourites"}
                      >
                        {isFavourite ? (
                          <HeartSolidIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </button>
                    </div>

                    {/* Main Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      {/* Open */}
                      <button
                        onClick={handleOpen}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 active:scale-95 sm:hover:scale-105 text-sm sm:text-base"
                      >
                        <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Open</span>
                      </button>

                      {/* Download */}
                      <button
                        onClick={() => handleDownload(postData.file_url, postData.file_name)}
                        className="flex-1 flex items-center justify-center gap-2 bg-base-content text-base-100 font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-base-content/30 transition-all duration-300 active:scale-95 sm:hover:scale-105 text-sm sm:text-base"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Download</span>
                      </button>

                      {/* Share */}
                      <button
                        onClick={() => handlesharebtn(SharePost)}
                        className="flex items-center justify-center gap-2 sm:gap-0 py-2.5 sm:py-3 px-4 sm:px-3 rounded-lg sm:rounded-xl bg-base-200 hover:bg-base-300 transition-all duration-300 active:scale-95 sm:hover:scale-105 sm:w-auto font-bold sm:font-normal text-sm sm:text-base"
                      >
                        <ShareIcon className="w-4 h-4 sm:w-5 sm:h-5 text-base-content" />
                        <span className="sm:hidden">Share</span>
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="border-t border-base-content/10 pt-4 sm:pt-6">
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                      <ChatBubbleLeftRightIcon className="w-5 h-5" />
                      Comments
                    </h3>

                    {/* Add Comment */}
                    <form onSubmit={handleSubmitComment} className="flex gap-2 mb-6">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        disabled={isSubmittingComment}
                        className="flex-1 bg-base-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={isSubmittingComment || !newComment.trim()}
                        className="bg-primary text-primary-content p-2 rounded-lg hover:bg-primary-focus disabled:opacity-50 transition-colors"
                      >
                        <PaperAirplaneIcon className="w-5 h-5" />
                      </button>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {comments.length > 0 ? (
                        comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <div className="flex-shrink-0">
                              {comment.User?.avatar ? (
                                <img src={comment.User.avatar} alt={comment.User.name} className="w-8 h-8 rounded-full object-cover" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center">
                                  <UserCircleIcon className="w-5 h-5 text-base-content/50" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 bg-base-200/50 rounded-lg p-3">
                              <div className="flex justify-between items-start mb-1">
                                <div className="flex flex-col">
                                  <span className="font-semibold text-sm">
                                    {comment.User?.name || "Unknown User"}
                                  </span>
                                  <span className="text-xs text-base-content/50">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                {session?.user?.id === comment.userId && (
                                  <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="text-base-content/40 hover:text-error transition-colors p-1"
                                    title="Delete comment"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                              <p className="text-sm text-base-content/80">{comment.content}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-sm text-base-content/50 py-4">No comments yet. Be the first!</p>
                      )}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>

        {/* Report Modal */}
        <Transition appear show={isReportOpen} as={Fragment}>
          <Dialog as="div" className="relative z-[60]" onClose={() => setIsReportOpen(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-base-100 p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-bold leading-6 text-base-content mb-4"
                    >
                      Report Content
                    </Dialog.Title>
                    <form onSubmit={handleReport} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Reason</label>
                        <select
                          value={reportReason}
                          onChange={(e) => setReportReason(e.target.value)}
                          className="w-full rounded-lg border border-base-content/20 bg-base-200 p-2.5 text-sm focus:border-primary focus:outline-none"
                        >
                          <option value="Broken Link">Broken Link</option>
                          <option value="Wrong Notes">Wrong Notes</option>
                          <option value="Improper Content">Improper Content</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                        <textarea
                          value={reportDescription}
                          onChange={(e) => setReportDescription(e.target.value)}
                          className="w-full rounded-lg border border-base-content/20 bg-base-200 p-2.5 text-sm focus:border-primary focus:outline-none"
                          rows={3}
                          placeholder="Please provide more details..."
                        />
                      </div>
                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          type="button"
                          onClick={() => setIsReportOpen(false)}
                          className="px-4 py-2 text-sm font-medium text-base-content/70 hover:bg-base-200 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmittingReport}
                          className="px-4 py-2 text-sm font-medium text-white bg-error hover:bg-error-focus rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isSubmittingReport ? "Submitting..." : "Submit Report"}
                        </button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </Dialog>
    </Transition>
  );
};

export default PostViewDialogBox;
