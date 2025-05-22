import { getDictionary } from "@/app/dictionaries";

export default async function Home({ params }: { params: Promise<{ lang: "en" | "ar" }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
  return (
    <>
        <div className="home-page">{ dict.home }</div>
    </>
  );
}
