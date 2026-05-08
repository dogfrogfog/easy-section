import { Suspense } from "react";
import { Hero } from "@/components/hero";
import { Gallery } from "@/components/gallery";
import {
  getAllSections,
  getAllTags,
  getAllCategories,
  getAllCmsTargets,
  getAllEffects,
  getAllProjects,
} from "@/lib/sections";

export default function HomePage() {
  const sections = getAllSections();
  const facets = {
    tags: getAllTags(),
    categories: getAllCategories(),
    cms: getAllCmsTargets(),
    effects: getAllEffects(),
    projects: getAllProjects(),
  };

  return (
    <>
      <Hero count={sections.length} />
      <Suspense fallback={null}>
        <Gallery sections={sections} facets={facets} />
      </Suspense>
    </>
  );
}
