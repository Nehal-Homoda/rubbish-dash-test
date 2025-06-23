"use client";
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import alertImg from "@/assets/images/alert.png";
type Props = {};

export default function UIDialogAlert({}: Props) {
    const [isOpen, setIsOpen] = useState(true);

    const updateDialogFromWindow = () => {
        if (typeof window !== "undefined") {
            //@ts-ignore
            setIsOpen(Boolean(window.dialog));
        }
    };

    useEffect(() => {
        updateDialogFromWindow(); // run once on mount

        // Listen to custom event
        window.addEventListener("dialog-toggle", updateDialogFromWindow);

        return () => {
            window.removeEventListener("dialog-toggle", updateDialogFromWindow);
        };
    }, []);

    const closeModal = () => {
        setIsOpen(false);
        //@ts-ignore
        window.dialog = false;
    };

    const openModal = () => {
        setIsOpen(true);
        //@ts-ignore
        window.dialog = true;
    };

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
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

                    <div className="fixed inset-0 overflow-y-auto pt-5">
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
                                <DialogPanel className="w-full max-w-[500px] transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <DialogTitle
                                        as="h3"
                                        className="relative text-lg font-bold leading-6 text-end text-gray-900"
                                    >
                                        <button
                                            onClick={closeModal}
                                            className="bg-transparent"
                                        >
                                            <span className="text-2xl mdi mdi-close"></span>
                                        </button>
                                    </DialogTitle>

                                    <div className="mb-10 flex items-center flex-col gap-5">
                                        <div className="w-full max-w-[200px] aspect-square">
                                            <img
                                                src={alertImg.src}
                                                alt=""
                                                className="w-full h-full object-contain"
                                            />
                                        </div>

                                        <p className="font-bold">
                                            لقد تمت العملية بنجاح
                                        </p>
                                    </div>

                                    <div className="mt-4 flex items-center justify-center gap-4">
                                        <button
                                            className="base-btn min-w-[200px]"
                                            onClick={closeModal}
                                        >
                                            حسناً
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
