import { getDictionary } from "../../dictionaries";
import DashSidebar from "@/components/layout/DashSidebar";
import DashNavbar from "@/components/layout/DashNavbar";

export default async function RootLayout({children,params,}: Readonly<{children: React.ReactNode;params: Promise<{ lang: "en" | "ar" }>;}>) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return (
    <>
      <div className="dash-layout flex">
        <aside className="md:w-[274px] ">
          <DashSidebar dict={dict} />
        </aside>

        <div className="flex-1">
          <DashNavbar dict={dict} lang={lang} />
          {children}
        </div>
      </div>
    </>
  );
}
