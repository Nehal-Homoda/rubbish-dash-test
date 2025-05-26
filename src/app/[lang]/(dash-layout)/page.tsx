import { getDictionary } from "@/app/dictionaries";
import DashCard from "@/components/ui/DashCard";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: "en" | "ar" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return (
    <>
      <div className="home-page">
        <DashCard>hi</DashCard>
      </div>
      <input type="time" />
    </>
  );
}
