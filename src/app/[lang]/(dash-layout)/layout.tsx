// "use client"
import { getDictionary } from "../../dictionaries";
import DashSidebar from "@/components/layout/DashSidebar";
import UICard from "@/components/ui/UICardYara";
import DashNavbar from "@/components/layout/DashNavbar";

export default async function RootLayout({children,params,}: Readonly<{children: React.ReactNode;params: Promise<{ lang: "en" | "ar" }>;}>) {
  // const [isOpen, setIsOpen] = useState(false)
  const { lang } = await params;
  const dict = await getDictionary(lang);

  // function openSidebar() {
  //   setIsOpen(true)
  //   console.log(isOpen);
  // }
  return (
    <>
      <div className="dash-layout">
        <aside>
          <DashSidebar dict={dict} />
        </aside>

        <div className="md:ps-[16.9rem] w-[97%] mx-auto">
          <DashNavbar
            lang={lang}
            dict={dict}
            // isOpen={isOpen}
            // openSidebar={openSidebar}
          />
          {children}
          <UICard title={"الخريطة"} lang={lang} dict={dict}>example</UICard>

        </div>
      </div>
    </>
  );
}
