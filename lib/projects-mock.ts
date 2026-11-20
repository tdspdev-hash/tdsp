/**
 * MOCK / PLACEHOLDER project records.
 *
 * These three projects come from the design mockup and are NOT verified TDSP
 * records. The page shows a visible note saying so. Replace this list with
 * real, TDSP-approved projects (and their wording in the dictionaries under
 * projectsPage.list.items) before launch. Do not add other projects here.
 */
export const projectsAreMock = true;

export type MockProject = {
  id: "irrigation" | "poultry" | "training";
  status: "ongoing" | "completed";
  period: string;
  location: string;
  image: string;
};

export const MOCK_PROJECTS: MockProject[] = [
  { id: "irrigation", status: "ongoing", period: "2025–2027", location: "Morogoro", image: "/pm-irrigation.jpg" },
  { id: "poultry", status: "ongoing", period: "2025–2026", location: "Dodoma", image: "/pm-poultry.jpg" },
  { id: "training", status: "completed", period: "2023–2024", location: "Iringa", image: "/pm-training.jpg" },
];
