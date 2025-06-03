
import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import alert from "@/assets/images/alert.png";

type Props = {
  message: string;
  show: boolean;
};


export default function BaseModal(props: Props) {
  const [visible, setVisible] = useState<boolean>(false);

  const footerContent = (
    <div className="flex justify-center items-center">
      <Button
        label="حسنا"
        onClick={() => {
          setVisible(false);
        }}
        className="base-btn w-40"
      />
    </div>
  );

  useEffect(() => {
    setVisible(props.show)
  }, [])
  

  return (
    <div className="card flex justify-content-center my-8">
      {visible? <Dialog
        visible={visible}
        modal
        footer={footerContent}
        style={{ width: "40vw", position:"relative" }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="absolute w-16 h-1 top-5 left-1/2 -translate-x-1/2 bg-foreground/10 rounded-md"></div>
        <button
          type="button"
          className="text-end w-full"
          onClick={() => setVisible(true)}
        ></button>
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
      </Dialog>:""}
      
    </div>
  );
}