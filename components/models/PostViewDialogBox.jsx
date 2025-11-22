"use client";
import { useSession } from "next-auth/react";
import { Fragment } from "react";
import { toast } from "sonner";
import { saveAs } from "file-saver";
import { useRouter } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";
import { ShareIcon, XMarkIcon, EyeIcon } from "@heroicons/react/20/solid";
import { handlesharebtn } from "@/libs/utils";

const PostViewDialogBox = ({ isOpen, setIsOpen, data }) => {
  const { data: session } = useSession();
  const router = useRouter();

  function closeModal() {
    setIsOpen(false);
  }

  const handleDownload = (url, filename) => {
    saveAs(url, `Lowstack.in_${filename}`);
    toast("Successfully downloaded");
  };

  const handleOpen = () => {
    // Navigate to embed file page with the file URL as query parameter
    const embedUrl = `/embedfile?url=${encodeURIComponent(data.file_url)}&title=${encodeURIComponent(data.title)}`;
    router.push(embedUrl);
    closeModal();
  };

  const SharePost = {
    title: "",
    content: `Hey! Check out ${data.course_name} ${data.title} on LowStack.in!\n#${data.subject_name.replace(/\s/g, "")}\n`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/post/${data.id.slice(
      15
    )}/${data.title.replace(/\s+/g, "-")}`,
  };

  const semWordToNumberMap = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
  };

  const semKey = `sem${semWordToNumberMap[data.semester_code.toLowerCase()]}`;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        {/* Background overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
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
              {/* Dialog panel */}
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                <XMarkIcon
                  className="absolute top-4 right-4 w-6 h-6 text-gray-800 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-400 cursor-pointer"
                  onClick={closeModal}
                />

                <Dialog.Title
                  as="h3"
                  className="text-2xl font-semibold leading-6 text-gray-900 dark:text-white mt-3"
                >
                  {data.title}
                </Dialog.Title>

                <Dialog.Description className="text-md text-gray-600 dark:text-gray-400 font-medium mt-3">
                  {data.description}
                </Dialog.Description>

                <div className="mt-2 text-[15px] capitalize text-gray-800 dark:text-gray-300">
                  <ul>
                    <li>Subject : {data.subject_name}</li>
                    <li>Course : {data.course_name}</li>
                    <li>Semester : {data.semester_code}</li>
                    <li>Category : {data.category}</li>
                  </ul>
                </div>

                <div className="mt-4 flex justify-center gap-2">
                  {/* Open button */}
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 py-2.5 px-4 capitalize mt-4 flex-1"
                    onClick={handleOpen}
                  >
                    <EyeIcon className="h-5 w-5" />
                    Open
                  </button>

               {/*  // THIS ONE IS FOR PREMIUM

                  {session?.user?.subscription?.[semKey] ? (
                    <button
                      type="button"
                      className="rounded-full items-center justify-center text-white bg-black hover:bg-gray-700 py-2.5 px-4 capitalize mt-4 w-full"
                      onClick={() =>
                        handleDownload(data.file_url, data.file_name)
                      }
                    >
                      Download
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="rounded-full items-center justify-center text-white bg-black hover:bg-gray-700 py-2.5 px-4 capitalize mt-4 w-full"
                      onClick={() => window.location.href = "/premium"}
                    >
                      BUY PREMIUM TO UNLOCK 👑
                    </button>
                  )}

              */}
                                        

                  {/* Download button */}
                  <button
                    type="button"
                    className="rounded-full items-center justify-center text-white bg-black dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 py-2.5 px-4 capitalize mt-4 flex-1"
                    onClick={() =>
                      handleDownload(data.file_url, data.file_name)
                    }
                  >
                    Download
                  </button>

                  {/* Share button */}
                  <button
                    type="button"
                    className="flex items-center justify-center rounded-full mt-4 py-2.5 px-4 text-white bg-black dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600"
                    onClick={() => handlesharebtn(SharePost)}
                  >
                    <ShareIcon className="h-6 w-6" />
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PostViewDialogBox;