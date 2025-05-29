import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, ReactNode, useState } from "react";
import alert from "@/assets/images/alert.png";
type Props = {
  message: string;
  openBtn: string;
};
export default function AlertModal(props: Props) {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div className="flex items-center justify-center mb-10">
        <button type="button" onClick={openModal} className="base-btn">
          {props.openBtn}
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
                <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all">
                  <div className="w-16 h-1 mx-auto bg-foreground/10 rounded-md mb-6"></div>
                  <button
                    type="button"
                    className="text-end w-full"
                    onClick={closeModal}
                  >
                    <span className="mdi mdi-close"></span>
                  </button>
                  <div className="mt-2">
                    <div className="image w-32 h-32 overflow-hidden mx-auto mb-8">
                      <img
                        src={alert.src}
                        alt="alert image"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-lg font-semibold">{props.message}</p>
                  </div>

                  <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                      type="button"
                      className="base-btn w-28"
                      onClick={closeModal}
                    >
                      حسنا
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
