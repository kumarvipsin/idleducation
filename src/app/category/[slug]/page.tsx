
import { CategoryContent } from "./category-content";
import { getExamCategories } from "@/app/actions/data";
import type { TExamCategory } from "@/app/actions/types";

const categoryData: { [key: string]: any } = {
  "neet": { 
      name: "NEET", 
  },
  "iit-jee": { 
      name: "IIT JEE", 
  },
  "school-preparation": { 
      name: "School Preparation", 
  },
  "cuet": { 
      name: "CUET", 
  },
  "govt-job-exams": { 
      name: "Government Job Exams", 
  },
  "defence": { 
      name: "Defence Exams", 
  },
  "nios": { 
      name: "NIOS", 
  },
  "gate": {
      name: "GATE",
  },
  "ssc": {
      name: "SSC",
  },
  "delhi-police": {
      name: "Delhi Police",
  }
};

const subCategories: { [key: string]: string[] } = {
  "defence": ["NDA", "CDS AFCAT", "Agniveer", "SSB", "AFCAT Offline", "CDS Offline", "SSB Offline"],
  "iit-jee": ["JEE Main", "JEE Advanced", "Foundation", "Droppers"],
  "neet": ["NEET UG", "NEET PG", "Foundation"],
  "nios": [],
  "default": []
};


export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const data = categoryData[slug] || { name: "Category", description: "No information available for this category.", courses: [] };
  const subs = subCategories[slug] || subCategories["default"];

  const categoriesResult = await getExamCategories();
  const allCategories = categoriesResult.success ? (categoriesResult.data as TExamCategory[]) : [];
  
  const competitiveExams = allCategories.filter(c => c.group === 'competitive');
  const foundationExams = allCategories.filter(c => c.group === 'foundation');

  return <CategoryContent data={data} slug={slug} subCategories={subs} competitiveExams={competitiveExams} foundationExams={foundationExams} />;
}
