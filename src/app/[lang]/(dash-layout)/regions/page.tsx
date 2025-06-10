"use client";
import RegionsDataTable from "@/components/data-tables/RegionsDataTable";
import UIDashCard from "@/components/ui/UIDashCard";
import { useLangAndDictionary } from "@/utils/lang";
import React from "react";

export default function regions() {
  const { lang, dict } = useLangAndDictionary();

  return (
    <>
      <div>
        <UIDashCard shadow="shadow-xl">
          <RegionsDataTable lang={lang} dict={dict} />
        </UIDashCard>
      </div>
    </>
  );
}
