// "use client";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

// export default function LangSwitcher({ dict }: { dict: any }) {
//   const pathName = usePathname();
//   const router = useRouter();

//   const [selectedLang, setSelectedLang] = useState<{ name: string; code: string } | null>(null);
//   const languages = [
//     { name: dict.english, code: "en" },
//     { name: dict.arabic, code: "ar" },
//   ];

//   useEffect(() => {
//     const currentLang = Cookies.get("lang") || "en";
//     const langObj = languages.find((lang) => lang.code === currentLang);
//     setSelectedLang(langObj || languages[0]);
//   }, []);

//   const switchLang = (langCode: string) => {
//     Cookies.remove("lang");
//     Cookies.set("lang", langCode, { path: "/" });
//     router.replace(`/${langCode}/${pathName.split("/").splice(2).join("/")}`);
//   };

//   const handleChange = (e: DropdownChangeEvent) => {
//     setSelectedLang(e.value);
//     switchLang(e.value.code);
//   };

//   return (
//     <div className="relative w-fit">
//       <Dropdown
//         value={selectedLang}
//         onChange={handleChange}
//         options={languages}
//         optionLabel="name"
//         placeholder="Select Language"
//         className="w-36 text-sm bg-background ring-0 text-foreground"
//       />
//     </div>
//   );
// }
