"use client";
import React, { useState } from "react";

import { useLangAndDictionary } from "@/utils/lang";

interface UIDashCardProps {
  title?: string;
  children: React.ReactNode;
  shadow?: string;
}
export default function UIDashCard({
  title,
  children,
  shadow = "shadow-[0_0_0.25rem_0.5625rem_rgb(0,0,0,0.07)]",
}: UIDashCardProps) {
  const { lang, dict } = useLangAndDictionary();

  return (
    <>
      <div
        className={`rounded-2xl bg-background p-5 w-full ${shadow}`} 
      >
        {title && (
          <div className="card-title text-foreground text-lg font-semibold capitalize mb-4">
            {title}
          </div>
        )}
        <div className="mb-7">{children}</div>
      </div>
    </>
  );
}
