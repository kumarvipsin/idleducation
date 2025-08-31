
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
      courses: [
        {
          mode: "ONLINE",
          modeColor: "bg-blue-600",
          image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
          imageHint: "students collaborating",
          title: "Pravesh CUET Commerce 2026",
          tags: ["NEW", "Hinglish"],
          target: "Targeted Batch for CUET Commerce 2026",
          startDate: "25 Aug, 2025",
          endDate: "31 May, 2026",
          price: "2,799",
          originalPrice: "8,000",
          discount: "65% applied",
          features: { text: "", badge: "INFINITY" },
        },
        {
          mode: "ONLINE",
          modeColor: "bg-blue-600",
          image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
          imageHint: "students learning",
          title: "Pravesh CUET Science 2026",
          tags: ["NEW", "Hinglish"],
          target: "For CUET 2026 Aspirants",
          startDate: "18 Aug, 2025",
          endDate: "30 Jun, 2026",
          price: "3,499",
          originalPrice: "3,999",
          discount: "13% applied",
          features: { text: "", badge: "PRO" },
        },
        {
          mode: "OFFLINE",
          modeColor: "bg-red-600",
          image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
          imageHint: "teacher with students",
          title: "Superclass - Pravesh CUET 2026",
          tags: ["NEW", "Hinglish"],
          target: "Targeted Batch for CUET 2026",
          startDate: "2 May, 2025",
          endDate: "30 Jun, 2026",
          price: "999",
          originalPrice: null,
          discount: null,
          features: null,
        }
      ]
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
};

const subCategories: { [key: string]: string[] } = {
  "defence": ["All Batches", "NDA", "CDS AFCAT", "Agniveer", "SSB", "AFCAT Offline", "CDS Offline", "SSB Offline"],
  "iit-jee": ["All Batches", "JEE Main", "JEE Advanced", "Foundation", "Droppers"],
  "neet": ["All Batches", "NEET UG", "NEET PG", "Foundation"],
  "default": ["All Batches"]
};


export default function CategoryPage({ params: { slug } }: { params: { slug: string } }) {
  const data = categoryData[slug] || { name: "Category", description: "No information available for this category.", courses: [] };
  const subs = subCategories[slug] || subCategories["default"];

  return <CategoryContent data={data} slug={slug} subCategories={subs} />;
}
