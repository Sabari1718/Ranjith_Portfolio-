import { getPortfolioData } from "@/lib/storage";
import PortfolioLiveClient from "@/components/portfolio/PortfolioLiveClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const data = await getPortfolioData();

  return <PortfolioLiveClient initialData={data} />;
}
