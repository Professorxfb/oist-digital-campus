import { SiteFooter } from "@/components/public-site/SiteFooter";
import { SiteHeader } from "@/components/public-site/SiteHeader";
import {
  getMenuByLocation,
  getSiteSettings,
} from "@/services/cms";

export async function PublicSiteShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [siteSettings, headerMenu, footerMenu, quickLinks] = await Promise.all([
    getSiteSettings(),
    getMenuByLocation("header"),
    getMenuByLocation("footer"),
    getMenuByLocation("quick_links"),
  ]);

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-950">
      <SiteHeader settings={siteSettings.data} menuItems={headerMenu.data.items} />
      {children}
      <SiteFooter
        settings={siteSettings.data}
        footerMenuItems={footerMenu.data.items}
        quickLinks={quickLinks.data.items}
      />
    </main>
  );
}
