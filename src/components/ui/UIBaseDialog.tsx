import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";

type Props = {
  open: boolean; 
  onClose: () => void; 
  btn?: React.ReactNode;
  children: React.ReactNode;
  title: string;
  form?: string;
  confirmHandler: () => void;
  confirmText: string;
  hideConfirmBtn?: boolean;
  heightStyle?: string;
};

export default function UIBaseDialog({
  open,
  onClose,
  btn,
  children,
  title,
  confirmText,
  form,
  confirmHandler,
  hideConfirmBtn = false,
  heightStyle,
}: Props) {
  return (
    <>
      {btn && <div>{btn}</div>}

      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50"  onClose={() => {}} static>
          <TransitionChild as={Fragment}>
            <div className="fixed inset-0 z-30 bg-black/25" />
          </TransitionChild>

          <div className="fixed z-30 inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild as={Fragment}>
                <DialogPanel
                  className={`w-full max-w-[750px] ${heightStyle} rounded-2xl bg-white p-10 shadow-xl`}
                >
                  <DialogTitle className="relative text-lg font-bold text-center">
                    {title}
                    <button onClick={onClose} className="absolute left-2">
                      ✕
                    </button>
                  </DialogTitle>

                  <div className="my-10">{children}</div>

                  <div className="flex justify-center gap-4">
                    {!hideConfirmBtn && (
                      <button
                        type={form ? "submit" : "button"}
                        onClick={confirmHandler}
                        form={form}
                        className="base-btn min-w-[200px]"
                      >
                        {confirmText}
                      </button>
                    )}

                    <button onClick={onClose}>الغاء</button>
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
