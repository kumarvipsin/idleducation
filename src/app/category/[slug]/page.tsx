
import { CategoryContent } from "./category-content";
import { getExamCategories, getTeachers } from "@/app/actions/data";
import type { TExamCategory } from "@/app/actions/types";
import { notFound } from 'next/navigation';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  const categoriesResult = await getExamCategories();
  const allCategories = categoriesResult.success ? (categoriesResult.data as TExamCategory[]) : [];
  
  const category = allCategories.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === slug);

  if (!category) {
    notFound();
  }
  
  const competitiveExams = allCategories.filter(c => c.group === 'competitive');
  const foundationExams = allCategories.filter(c => c.group === 'foundation');

  const teachersResult = await getTeachers();
  const allTeachers = teachersResult.success ? teachersResult.data : [];

  const teachersForCategory = category.teacherIds
    ? allTeachers.filter((teacher: any) => category.teacherIds?.includes(teacher.id))
    : [];

  return <CategoryContent data={category} slug={slug} competitiveExams={competitiveExams} foundationExams={foundationExams} teachers={teachersForCategory} />;
}
