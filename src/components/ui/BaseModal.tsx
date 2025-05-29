import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, ReactNode, useState } from "react";

type Props = {
  title: string;
  actionBtn: string;
  children: ReactNode;
  action: any
};
export default function BaseModal(props: Props) {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function handleAction() {
    props.action();
    closeModal(); 
  }

  return (
    <>
      <div className="flex items-center justify-end mb-8">
        <button type="button" onClick={openModal} className="base-btn w-28">
          {props.title}
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all">
                  <div className="w-16 h-1 mx-auto bg-foreground/10 rounded-md mb-6"></div>
                  <div className="flex justify-center items-center mb-14 ">
                    {props.title ? (
                      <DialogTitle
                        as="h3"
                        className="text-lg font-bold leading-6 text-foreground"
                      >
                        {props.title}
                      </DialogTitle>
                    ) : (
                      ""
                    )}
                    <button
                      type="button"
                      className="absolute end-10"
                      onClick={closeModal}
                    >
                      <span className="mdi mdi-close"></span>
                    </button>
                  </div>
                  <div className="mt-2">{props.children}</div>

                  <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                      type="button"
                      className="base-btn w-48"
                      onClick={handleAction}
                    >
                      {props.actionBtn}
                    </button>
                    <button
                      type="button"
                      className="cancel-btn w-28"
                      onClick={closeModal}
                    >
                      الغاء
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
