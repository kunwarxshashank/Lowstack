import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

import FormButtons from "../../ui/FormButtons";
import FormField from "../../ui/FormField";
import ListBox from "./ListBox";
import { roles } from "..";

const AdminModel = ({
  isOpen,
  isLoading,
  setIsOpen,
  userData,
  setUserData,
  handleSubmitButton,
}) => {
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleCloseModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
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
                <Dialog.Title
                  as="h3"
                  className="text-xl font-semibold leading-6 text-base-content"
                >
                  Edit User Profile
                </Dialog.Title>

                <Dialog.Description className="text-sm text-base-content/60 mt-2">
                  Update user details and role.
                </Dialog.Description>

                <div className="mt-4">
                  <form>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-4">
                        <div>
                          <label className="label_form mb-1 block">User role</label>
                          <ListBox
                            value={userData.userRole}
                            onChange={(newValue) => {
                              setUserData({ ...userData, userRole: newValue });
                            }}
                            data={roles}
                          />
                        </div>

                        <FormField
                          label="Name"
                          type="text"
                          name="name"
                          value={userData.name}
                          onChange={(e) =>
                            setUserData({ ...userData, name: e.target.value })
                          }
                          classLabel="label_form"
                          classInput="input_form"
                        />

                        <FormField
                          label="Email"
                          type="email"
                          name="email"
                          value={userData.email}
                          onChange={(e) =>
                            setUserData({ ...userData, email: e.target.value })
                          }
                          classLabel="label_form"
                          classInput="input_form"
                        />

                        <FormField
                          label="Phone Number"
                          type="tel"
                          name="phoneNumber"
                          value={userData.phoneNumber}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              phoneNumber: e.target.value,
                            })
                          }
                          classLabel="label_form"
                          classInput="input_form"
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                      <FormButtons
                        primaryLabel={isLoading ? "Updating..." : "Update"}
                        secondaryLabel="Cancel"
                        onPrimaryClick={handleSubmitButton}
                        onSecondaryClick={handleCloseModal}
                        primaryClassName="btn btn-primary"
                        secondaryClassName="btn btn-ghost"
                      />
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AdminModel;
