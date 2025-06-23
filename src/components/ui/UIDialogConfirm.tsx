import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import React, { Fragment, useState } from "react";

type Props = {
    children: React.ReactNode;
    title: string;
    danger?: boolean;
    confirmHandler: () => void;
};

export default function UIDialogConfirm({
    children,
    title,
    danger = false,
    confirmHandler,
}: Props) {
    let [isOpen, setIsOpen] = useState(false);

    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    const confirmAction = () => {
        confirmHandler();
        closeModal();
    };

    return (
        <>
            <div className="" onClick={openModal}>
                {children}
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className=" relative z-50"
                    onClose={closeModal}
                >
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
                                <DialogPanel className="w-full max-w-[400px] transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <DialogTitle
                                        as="h3"
                                        className="relative text-lg font-bold leading-6 text-center text-gray-900 "
                                    >
                                        <div className="w-24 h-1 rounded-2xl mb-5 bg-gray-300 mx-auto"></div>
                                        {title}
                                    </DialogTitle>

                                    <div className="mt-10 flex items-center justify-center gap-4">
                                        <button
                                            className={`base-btn min-w-[200px] ${
                                                danger ? "bg-red-600" : ""
                                            }`}
                                            onClick={confirmAction}
                                        >
                                            تأكيد
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-secondary px-10"
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
