import LangSwitcher from '@/components/shared/LangSwitcher'
import { getDictionary } from "../../dictionaries";


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
      <div className="dash-layout">
        <LangSwitcher dict={ dict } />
            {children}
        </div>
    </>
  )
}
