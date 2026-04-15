import { Datepicker } from "flowbite-react";

import React from "react";
type Props = {
  selectedDate: Date
  sendSelectedDate: () => void
}
export default function DatePicker({ selectedDate, sendSelectedDate }: Props) {
  return (
    <div>
      <div className="w-full ">
        <Datepicker datepicker-format="yyyy-MM-dd" value={selectedDate} onChange={sendSelectedDate} title="Flowbite Datepicker" />
      </div>
    </div>
  );
}

// import React, { useRef, useState } from "react";
// import { Calendar } from "primereact/calendar";
// import { Nullable } from "primereact/ts-helpers";
// import { addLocale } from "primereact/api";

// interface DatePickerFieldProps {
//   label: string;
//   required?: boolean;
//   errorMessage?: string;
//   value: Date;
//   onChange: (date: Date) => void;
//   lang?: "en" | "ar";
// }
// export default function DatePicker(props: DatePickerFieldProps) {
//   const datePickerRef = useRef<any>(null);

//   const handleIconClick = () => {
//     if (datePickerRef.current) {
//       datePickerRef.current.show();
//     }
//   };
//   if (props.lang === "ar") {
//     addLocale("ar", {
//       firstDayOfWeek: 6,
//       dayNames: [
//         "الأحد",
//         "الاثنين",
//         "الثلاثاء",
//         "الأربعاء",
//         "الخميس",
//         "الجمعة",
//         "السبت",
//       ],
//       dayNamesShort: ["أحد", "اثن", "ثلا", "أرب", "خمي", "جمع", "سبت"],
//       dayNamesMin: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
//       monthNames: [
//         "يناير",
//         "فبراير",
//         "مارس",
//         "أبريل",
//         "مايو",
//         "يونيو",
//         "يوليو",
//         "أغسطس",
//         "سبتمبر",
//         "أكتوبر",
//         "نوفمبر",
//         "ديسمبر",
//       ],
//       monthNamesShort: [
//         "ينا",
//         "فبر",
//         "مار",
//         "أبر",
//         "ماي",
//         "يون",
//         "يول",
//         "أغس",
//         "سبت",
//         "أكت",
//         "نوف",
//         "ديس",
//       ],
//       today: "اليوم",
//       clear: "مسح",
//     });
//   }

//   return (
//     <>
//       <div className="border-[1px] mt-9  border-surface-light-600 bg-background relative p-3 rounded-xl">
//         <label
//           htmlFor=""
//           className="absolute bg-background -top-4 capitalize text-base text-foreground px-2"
//         >
//           {props.label}
//           {props.required && <span className="text-red-600 text-lg">*</span>}
//         </label>
//         <div className="w-full datePicker flex items-center">
//           <span
//             className="mdi mdi-calendar-month-outline text-lg text-foreground/50 cursor-pointer"
//             onClick={handleIconClick}
//           ></span>
//           <Calendar
//             value={props.value}
//             ref={datePickerRef}
//             readOnlyInput
//             dateFormat="dd MM yy"
//             onChange={(e) => props.onChange(e.value as Date)}
//             className={`w-full  ps-1 `}
//             inputStyle={{ boxShadow: "none", border:"none",backgroundColor:"transparent" , padding:"0",fontSize:"14px"}}
//             locale={props.lang}
//             nextIcon={
//               props.lang === "ar" ? (
//                 <span className="mdi mdi-chevron-left text-2xl"></span>
//               ) : (
//                 <span className="mdi mdi-chevron-right text-2xl"></span>
//               )
//             }
//             prevIcon={
//               props.lang === "ar" ? (
//                 <span className="mdi mdi-chevron-right text-2xl"></span>
//               ) : (
//                 <span className="mdi mdi-chevron-left text-2xl"></span>
//               )
//             }
//           />

//           <span
//             className="mdi mdi-chevron-down text-foreground/50 text-lg cursor-pointer"
//             onClick={handleIconClick}
//           ></span>
//         </div>
//       </div>
//       {props.errorMessage && (
//         <p className="err-msg text-red-600 text-sm">{props.errorMessage}</p>
//       )}{" "}
//     </>
//   );
// }
