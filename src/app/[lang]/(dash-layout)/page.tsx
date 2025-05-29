import { getDictionary } from "@/app/dictionaries";
import CardNada from "@/components/ui/CardNada";
import DashCard from "@/components/ui/CardNada";

export default async function Home({ params, }: { params: Promise<{ lang: "en" | "ar" }>; }) {
  
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return (
    <>
      <div className="home-page">
        <CardNada>content</CardNada>
      </div>

    </>
  );
}
