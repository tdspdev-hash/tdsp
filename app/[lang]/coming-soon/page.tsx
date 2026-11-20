import { comingSoonRoute } from "@/lib/coming-soon-route";

// Reusable "Coming Soon" page for any future section. It is not linked from the
// site and is excluded from search engines; it also keeps the approved
// Coming Soon design under test now that every public section is built.
const route = comingSoonRoute((d) => d.status.comingSoon.title);
export async function generateMetadata(props: Parameters<typeof route.generateMetadata>[0]) {
  return { ...(await route.generateMetadata(props)), robots: { index: false, follow: false } };
}
export default route.Page;
