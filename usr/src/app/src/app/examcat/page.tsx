import { CategoryContent } from "@/app/category/[slug]/category-content";
import { getExamCategories } from "@/app/actions/data";
import type { TExamCategory } from "@/app/actions/types";

const categoryData: { [key: string]: any } = {
  "iit-jee": { 
      name: "IIT JEE", 
  },
};

const subCategories: { [key: string]: string[] } = {
  "iit-jee": ["JEE Main", "JEE Advanced", "Foundation", "Droppers"],
  "default": []
};


export default async function ExamcatPage() {
  const slug = "iit-jee";
  const data = categoryData[slug] || { name: "Category", description: "No information available for this category.", courses: [] };
  const subs = subCategories[slug] || subCategories["default"];

  const categoriesResult = await getExamCategories();
  const allCategories = categoriesResult.success ? (categoriesResult.data as TExamCategory[]) : [];
  const competitiveExams = allCategories.filter(c => c.group === 'competitive');

  return <CategoryContent data={data} slug={slug} subCategories={subs} competitiveExams={competitiveExams} />;
}
