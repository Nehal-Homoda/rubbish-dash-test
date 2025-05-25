import LangSwitcher from "@/components/shared/LangSwitcher";
import { getDictionary } from "../../dictionaries";
import DashSidebar from "@/components/layout/DashSidebar";
import UIDarkBtn from "@/components/ui/UIDarkBtn";
import UIDashCard from "@/components/ui/UIDashCard";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: "en" | "ar" }>;
}>) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return (
    <>
      <div className="dash-layout flex">
        <aside className="md:w-[274px] ">
          <DashSidebar dict={dict} />
        </aside>

        <div className="flex-1">
          {children}
          <UIDashCard title={"الخريطة"} children={"example"} />
          {/* * <LangSwitcher dict={dict} /> */}
          <UIDarkBtn lang={lang} />
        </div>
      </div>
    </>
  );
}
