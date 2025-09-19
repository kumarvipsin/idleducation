
import { CategoryContent } from "./category-content";
import { use } from 'react';

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


export default function CategoryPage({ params }: { params: { slug: string } }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const data = categoryData[slug] || { name: "Category", description: "No information available for this category.", courses: [] };
  const subs = subCategories[slug] || subCategories["default"];

  return <CategoryContent data={data} slug={slug} subCategories={subs} />;
}
