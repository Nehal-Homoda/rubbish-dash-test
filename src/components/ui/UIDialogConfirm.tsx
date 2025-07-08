import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import React, { Fragment, useState } from "react";
import exclaimanationImg from '@/assets/images/exclaimanation.png'
type Props = {
    children: React.ReactNode;
    title: string;
    danger?: boolean;
    deleteAction?: boolean;
    confirmHandler: () => void;
};

export default function UIDialogConfirm({
    children,
    title,
    danger = false,
    deleteAction,
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



                                <DialogPanel className="w-full max-w-[450px] transform rounded-3xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <div className="absolute -top-8 left-[50%] -translate-x-1/2 ">
                                        <div className="bg-white p-4 rounded-full ">
                                            <div className="w-14 h-14">
                                                <img className="w-full h-full object-contain" src={exclaimanationImg.src} alt="" />

                                            </div>

                                        </div>
                                    </div>
                                    <DialogTitle
                                        as="h3"
                                        className="relative text-lg font-bold leading-6 text-center text-gray-900 "
                                    >
                                        <div className="w-24 h-1 rounded-2xl mb-10 mt-4  mx-auto"></div>
                                        {title}
                                    </DialogTitle>


                                    {deleteAction && <div className="my-3  text-center">
                                        <span className="text-muted text-sm ">  انت علي وشك حذف نهائياً من النظام</span>
                                    </div>}

                                    <div className="mt-8 flex items-center justify-center gap-4">
                                        <button
                                            className={` min-w-[150px] ${danger ? "text-red-600 border border-red-600 rounded-lg py-2" : ""
                                                }`}
                                            onClick={confirmAction}
                                        >
                                            تأكيد
                                        </button>
                                        <button
                                            type="button"
                                            className="bg-[#09131B] min-w-[150px] text-white px-10  rounded-lg py-2"
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
