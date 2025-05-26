"use client";
import React, { useState } from "react";
import Input from "./form/TextFieldYara";
interface UIDashCardProps {
  title?: string;
  children: React.ReactNode;
  shadowClassName?: string;
}
export default function UIDashCard({
  title,
  children,
  shadowClassName = "shadow-[0_0_0.25rem_0.5625rem_rgb(0,0,0,0.07)]",
}: UIDashCardProps) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <>
      <div
        className={`rounded-2xl bg-background p-5 w-full ${shadowClassName}`} //handling various shadows
      >
        {title && (
          <div className="card-title text-foreground text-lg font-semibold capitalize mb-4">
            {title}
          </div>
        )}
        <div className="mb-7">{children}</div>
        <div className="inputs  flex gap-7">
          <Input
            label="اسم المستخدم"
            type="text"
            iconType="mdi"
            appendIcon="mdi-account-outline"
            prependIcon="mdi-account-outline"
            required={true}
            placeholder="ادخل اسمك"
            value={name}
            onChange={handleNameChange}
            // errorMessage="error"
          />
          <Input
            label="الرقم السري"
            type="password"
            iconType="mdi"
            prependIcon="mdi-lock-outline"
            openedEye="mdi-eye-outline"
            closedEye=" mdi-eye-off-outline"
            required={false}
            placeholder="ادخل رقمك السري"
            value={password}
            onChange={handlePasswordChange}
            // errorMessage="error"
          />
        </div>
      </div>
    </>
  );
}
