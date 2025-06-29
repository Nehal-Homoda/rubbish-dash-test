import DashSidebar from "@/components/layout/DashSidebar";
import DashNavbar from "@/components/layout/DashNavbar";
import UIDialogAlert from "@/components/ui/UIDialogAlert";
import Template from "./template";

type Props = {
    children: Readonly<React.ReactNode>;
};

export default function RootLayout({ children }: Props) {


    return (
        <>
            <Template>
                <div className="dash-layout">
                    <aside>
                        <DashSidebar/>
                    </aside>
                    <div className="md:ps-[293px] w-[97%] mx-auto">
                        {/* <DashNavbar isOpen={false} openSidebar={() => {}} /> */}
                        {children}
                    </div>
                    <UIDialogAlert></UIDialogAlert>
                </div>
            </Template>
        </>
    );
}
