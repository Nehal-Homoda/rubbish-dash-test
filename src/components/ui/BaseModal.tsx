import React, { ReactNode, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

type Props = {
  title?: string;
  openBtnLabel?: string;
  openBtnIcon?: string;
  iconType?: string;
  actionBtn?: string;
  children?: ReactNode;
  action?: any;
  style?: string;
};


export default function BaseModal(props: Props) {
  const [visible, setVisible] = useState<boolean>(false);

  function handleAction() {
    props.action();
    setVisible(false);
  }

  const headerElement = (
    <div className="relative">
      <div className="absolute w-16 h-1 -top-3 left-1/2 -translate-x-1/2 bg-foreground/10 rounded-md"></div>
      <div className="text-center">
        <span className="font-semibold white-space-nowrap">{props.title}</span>
      </div>
    </div>
  );

  const footerContent = (
    <div className="flex justify-center items-center gap-3">
      <Button
        label={props.actionBtn}
        onClick={() => {
          handleAction();
        }}
        className="base-btn w-40"
        style={{ border: "none" }}
      />
      <Button
        label="الغاء"
        onClick={() => {
          setVisible(false);
        }}
        className="btn-secondary w-20"
        style={{ border: "none" }}
      />
    </div>
  );

  return (
    <>
      <button onClick={() => setVisible(true)} className={props.style}>
        {props.openBtnIcon ? (
          props.iconType === "mdi" ? (
            <span className={props.openBtnIcon}></span>
          ) : (
            <i className={props.openBtnIcon}></i>
          )
        ) : (
          props.openBtnLabel
        )}
      </button>
      <Dialog
        visible={visible}
        modal
        header={headerElement}
        footer={footerContent}
        style={{ width: "40vw" }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="mt-10">{props.children}</div>
      </Dialog>
    </>
  );
}
