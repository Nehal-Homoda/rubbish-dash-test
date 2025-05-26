import { getDictionary } from "../../dictionaries";
import DashSidebar from "@/components/layout/DashSidebar";
import UICard from "@/components/ui/UICardYara";
import DashNavbar from "@/components/layout/DashNavbar";
import Input from "@/components/ui/form/TextFieldYara";

export default async function RootLayout({children,params,}: Readonly<{children: React.ReactNode;params: Promise<{ lang: "en" | "ar" }>;}>) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <div className="dash-layout">
        <aside>
          <DashSidebar dict={dict} />
        </aside>


        <div className="md:ps-[16.9rem] w-[97%] mx-auto">
          <DashNavbar lang={lang} dict={dict} />
          {children}
          <UICard title={"الخريطة"}>example</UICard>
        </div>
      </div>
    </>
  );
}
