import Image from "next/image";
import { Fragment } from "react";
import { useRouter } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Dialog, Transition } from "@headlessui/react";

const UploadDoneModel = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  const closeModal = () => {
    setIsOpen(false);
    // router.push("/dashboard"); // Removed redirect for admin dashboard flow
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-base-100 p-6 text-left align-middle shadow-xl transition-all border border-base-300">
                  <XMarkIcon
                    className="text-base-content/60 hover:text-base-content absolute top-4 right-4 text-lg cursor-pointer w-6 h-6"
                    onClick={closeModal}
                  />

                  <Image
                    src="/img/submit.png"
                    width={340}
                    height={100}
                    alt="Done"
                    className="mx-auto mb-auto my-auto"
                    loading="lazy"
                  />

                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium text-center leading-6 text-primary"
                  >
                    Thank You :)
                  </Dialog.Title>

                  <div className="mt-2">
                    <p className="text-sm text-base-content/60 text-center">
                      Awesome! Your upload will make a big difference for
                      students, helping them perform better in their studies.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={closeModal}
                    >
                      ok
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
export default UploadDoneModel;
