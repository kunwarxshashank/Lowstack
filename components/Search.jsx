/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import { search } from "@/public/assets";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";

const Search = ({
  results,
  searchText,
  onChangeValue,
  setSearchText,
  setIsPostOpen,
  setPost,
}) => {
  return (
    <div className="relative md:flex-1 max-w-[658px]">
      {/* Modern Search Bar with Gradient */}
      <div className="relative overflow-hidden rounded-full bg-gradient-to-r from-base-100 via-base-200 to-base-100 border border-base-content/10 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300 group">
        {/* Gradient Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

        <div className="relative flex items-center gap-2 py-2.5 sm:py-3 px-4 sm:px-5">
          {/* Search Icon */}
          <MagnifyingGlassIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />

          {/* Input Field */}
          <input
            type="text"
            value={searchText}
            onChange={onChangeValue}
            placeholder="Search for Study materials, Notes, PYQs..."
            id="global-search-input"
            className="flex-1 font-medium text-sm sm:text-base placeholder:text-base-content/40 text-base-content bg-transparent outline-none"
          />

          {/* Search Button */}
          <button
            className="shrink-0 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95"
            onClick={() => { }}
          >
            <span className="hidden sm:inline">Search</span>
            <MagnifyingGlassIcon className="w-5 h-5 sm:hidden" />
          </button>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {searchText && (
        <SearchDropDown
          result={results}
          searchText={searchText}
          closeSearch={setSearchText}
          setIsPostOpen={setIsPostOpen}
          setPost={setPost}
        />
      )}
    </div>
  );
};

export default Search;

const SearchDropDown = ({
  result,
  searchText,
  closeSearch,
  setIsPostOpen,
  setPost,
}) => {
  const handleClose = () => {
    closeSearch("");
  };

  const handleModel = (post) => {
    setPost(post);
    setIsPostOpen(true);
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-3 z-50 max-h-[500px] w-full rounded-2xl sm:rounded-3xl bg-gradient-to-br from-base-100 via-base-200 to-base-100 border border-base-content/10 overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Header with Gradient */}
      <div className="sticky top-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-md border-b border-base-content/10 px-4 sm:px-6 py-3 sm:py-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <p className="text-sm sm:text-base font-bold text-base-content">
              {result.length} <span className="font-normal text-base-content/70">results for</span>{" "}
              <span className="text-primary">"{searchText}"</span>
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 sm:p-2 rounded-full bg-base-content/10 hover:bg-base-content/20 hover:rotate-90 transition-all duration-300"
          >
            <XMarkIcon className="w-5 h-5 text-base-content" />
          </button>
        </div>
      </div>

      {/* Results List */}
      <div className="overflow-auto max-h-[420px] p-2 sm:p-3">
        {result?.map((post, index) => {
          let title = post.title.slice(0, 22);
          let shouldShowDots = post.title.length > 22;
          return (
            <div
              key={index}
              title={`file Details : \n subject name : ${post.subject_name} \n semester : ${post.semester_code} \n course name : ${post.course_name}`}
              className="group relative overflow-hidden flex items-center justify-between gap-3 rounded-xl sm:rounded-2xl py-3 px-3 sm:px-4 mb-2 bg-base-100 hover:bg-gradient-to-r hover:from-primary/10 hover:via-secondary/10 hover:to-accent/10 border border-transparent hover:border-primary/20 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              onClick={() => handleModel(post)}
            >
              {/* Gradient Line on Hover */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-accent transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top rounded-r-full"></div>

              <div className="flex-1 min-w-0 pl-2">
                <p className="text-sm sm:text-base text-base-content font-semibold truncate sm:hidden">
                  {shouldShowDots ? `${title}...` : title}
                </p>
                <p className="text-sm sm:text-base text-base-content font-semibold truncate hidden sm:block">
                  {post.title}
                </p>
                <p className="text-xs text-base-content/60 truncate mt-0.5">
                  {post.subject_name}
                </p>
              </div>

              <div className="shrink-0">
                <span className="inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  {post.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
