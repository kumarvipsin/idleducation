
import { CategoryContent } from "./category-content";

const categoryData: { [key: string]: any } = {
  "neet": { 
      name: "NEET", 
      description: "Prepare for the National Eligibility cum Entrance Test with our comprehensive courses.",
      courses: [
        { title: "NEET Crash Course 2025", description: "An intensive program to cover the entire syllabus quickly." },
        { title: "NEET for Class 11", description: "Build a strong foundation for your medical entrance exams." },
        { title: "NEET for Class 12", description: "Advanced topics and extensive mock tests to ace the exam." },
      ]
  },
  "iit-jee": { 
      name: "IIT JEE", 
      description: "Your gateway to the top engineering colleges in India. Master the concepts with our expert faculty.",
      courses: [
        { title: "JEE Main & Advanced 2025", description: "Comprehensive course covering both Main and Advanced syllabus." },
        { title: "JEE Foundation for Class 11", description: "Start early to get a competitive edge." },
        { title: "JEE Dropper's Batch", description: "A dedicated program for students taking a gap year." },
      ]
  },
  "school-preparation": { 
      name: "School Preparation", 
      description: "Strengthen your concepts and score better in your school exams from Class 6 to 12.",
       courses: [
        { title: "Mathematics - Class 10", description: "Master the board syllabus with in-depth lessons." },
        { title: "Science - Class 12", description: "Physics, Chemistry, and Biology for your final school year." },
        { title: "Foundation for Middle School", description: "Covering key subjects for Classes 6 to 8." },
      ]
  },
  "cuet": { 
      name: "CUET", 
      description: "Prepare for the Common University Entrance Test with our structured and detailed courses.",
      courses: []
  },
  "govt-job-exams": { 
      name: "Government Job Exams", 
      description: "Secure your future with a government job. We cover a wide range of exams like SSC, Banking, and more.",
      courses: [
        { title: "SSC CGL Tier I & II", description: "Comprehensive coaching for the Combined Graduate Level exam." },
        { title: "IBPS PO & Clerk", description: "Master quantitative aptitude, reasoning, and English for banking exams." },
        { title: "Teaching Eligibility Tests (TET)", description: "Prepare for state and central level teacher eligibility tests." },
      ]
  },
  "defence": { 
      name: "Defence Exams", 
      description: "Serve the nation by joining the armed forces. We provide coaching for NDA, CDS, AFCAT, and more.",
      courses: [
        { title: "NDA & NA Examination", description: "Prepare for the National Defence Academy entrance exam." },
        { title: "CDS (Combined Defence Services)", description: "Coaching for IMA, INA, AFA, and OTA." },
        { title: "AFCAT (Air Force Common Admission Test)", description: "Your gateway to a career in the Indian Air Force." },
      ]
  },
  "nios": { 
      name: "NIOS", 
      description: "Prepare for the National Institute of Open Schooling exams with our specialized courses.",
      courses: [
        {
            title: "NIOS Class 10",
            description: "Full syllabus coverage for NIOS secondary course.",
            language: "English | Hindi",
            bgColor: "bg-sky-500",
            textColor: "text-white",
            buttons: [{ text: "View Details", href: "#" }],
        },
        {
            title: "NIOS Class 12 - Science",
            description: "Physics, Chemistry, Biology, and Maths for NIOS senior secondary.",
            language: "English | Hindi",
            bgColor: "bg-amber-500",
            textColor: "text-white",
            buttons: [{ text: "View Details", href: "#" }],
        },
        {
            title: "NIOS Class 12 - Commerce",
            description: "Accountancy, Business Studies, Economics for NIOS.",
            language: "English | Hindi",
            bgColor: "bg-emerald-500",
            textColor: "text-white",
            buttons: [{ text: "View Details", href: "#" }],
        },
        {
            title: "NIOS Class 12 - Arts",
            description: "History, Geography, Political Science for NIOS.",
            language: "English | Hindi",
            bgColor: "bg-indigo-500",
            textColor: "text-white",
            buttons: [{ text: "View Details", href: "#" }],
        },
      ]
  },
};

const subCategories: { [key: string]: string[] } = {
  "defence": ["All Batches", "NDA", "CDS AFCAT", "Agniveer", "SSB", "AFCAT Offline", "CDS Offline", "SSB Offline"],
  "iit-jee": ["All Batches", "JEE Main", "JEE Advanced", "Foundation", "Droppers"],
  "neet": ["All Batches", "NEET UG", "NEET PG", "Foundation"],
  "nios": ["All Batches", "Class 10", "Class 12"],
  "default": ["All Batches"]
};


export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const data = categoryData[slug] || { name: "Category", description: "No information available for this category.", courses: [] };
  const subs = subCategories[slug] || subCategories["default"];

  return <CategoryContent data={data} slug={slug} subCategories={subs} />;
}
