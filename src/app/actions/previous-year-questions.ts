// src/app/actions/previous-year-questions.ts
'use server';
import { db } from "@/lib/firebase";
import { doc, addDoc, updateDoc, deleteDoc, collection, serverTimestamp } from "firebase/firestore";
import { uploadFileToGCS } from '@/lib/gcs';

// Helper to generate a slug from a string
const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

export async function addPreviousYearQuestion(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  
  const questionData: any = {
    title: rawData.title as string,
    exam: rawData.exam as string,
    year: parseInt(rawData.year as string, 10),
    subjects: [],
    createdAt: serverTimestamp(),
  };

  const subjectEntries: { [key: number]: { name?: string; papers: { [key: number]: { title?: string; pdf?: File } } } } = {};

  for (const [key, value] of formData.entries()) {
    const subjectMatch = key.match(/^subjects\[(\d+)\]\[name\]$/);
    if (subjectMatch) {
      const index = parseInt(subjectMatch[1], 10);
      if (!subjectEntries[index]) subjectEntries[index] = { papers: {} };
      subjectEntries[index].name = value as string;
    }

    const paperMatch = key.match(/^subjects\[(\d+)\]\[papers\]\[(\d+)\]\[(title|pdf)\]$/);
    if (paperMatch) {
      const subjectIndex = parseInt(paperMatch[1], 10);
      const paperIndex = parseInt(paperMatch[2], 10);
      const field = paperMatch[3];
      if (!subjectEntries[subjectIndex]) subjectEntries[subjectIndex] = { papers: {} };
      if (!subjectEntries[subjectIndex].papers[paperIndex]) subjectEntries[subjectIndex].papers[paperIndex] = {};
      subjectEntries[subjectIndex].papers[paperIndex][field as 'title' | 'pdf'] = value as any;
    }
  }

  try {
    for (const subjectIndex in subjectEntries) {
      const subjectEntry = subjectEntries[subjectIndex];
      const subjectName = subjectEntry.name;
      if (!subjectName) continue;

      const papers = [];
      for (const paperIndex in subjectEntry.papers) {
        const paperEntry = subjectEntry.papers[paperIndex];
        let pdfUrl = '';
        if (paperEntry.pdf && paperEntry.pdf.size > 0 && paperEntry.title) {
          const destination = `previous-year-questions/${questionData.exam}/${questionData.year}/${generateSlug(subjectName)}/${generateSlug(paperEntry.title)}-${paperEntry.pdf.name}`;
          pdfUrl = await uploadFileToGCS(paperEntry.pdf, destination);
        }
        if (paperEntry.title) {
          papers.push({
            title: paperEntry.title,
            pdfUrl: pdfUrl,
          });
        }
      }
      questionData.subjects.push({ name: subjectName, papers: papers });
    }
    
    await addDoc(collection(db, "previousYearQuestions"), questionData);
    
    return { success: true, message: "Question paper added successfully." };
  } catch (error) {
    console.error("Error adding question paper:", error);
    return { success: false, message: "Failed to add question paper." };
  }
}


export async function editPreviousYearQuestion(id: string, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    
    const questionData: any = {
      title: rawData.title as string,
      exam: rawData.exam as string,
      year: parseInt(rawData.year as string, 10),
      subjects: [],
    };

    const subjectEntries: { [key: number]: { name?: string; papers: { [key: number]: { title?: string; pdf?: File, pdfUrl?:string } } } } = {};
    
    for (const [key, value] of formData.entries()) {
      const subjectMatch = key.match(/^subjects\[(\d+)\]\[name\]$/);
      if (subjectMatch) {
          const index = parseInt(subjectMatch[1], 10);
          if (!subjectEntries[index]) subjectEntries[index] = { papers: {} };
          subjectEntries[index].name = value as string;
      }
      
      const paperMatch = key.match(/^subjects\[(\d+)\]\[papers\]\[(\d+)\]\[(title|pdf|pdfUrl)\]$/);
      if (paperMatch) {
          const subjectIndex = parseInt(paperMatch[1], 10);
          const paperIndex = parseInt(paperMatch[2], 10);
          const field = paperMatch[3];
          if (!subjectEntries[subjectIndex]) subjectEntries[subjectIndex] = { papers: {} };
          if (!subjectEntries[subjectIndex].papers[paperIndex]) subjectEntries[subjectIndex].papers[paperIndex] = {};
          subjectEntries[subjectIndex].papers[paperIndex][field as 'title' | 'pdf' | 'pdfUrl'] = value as any;
      }
    }
    
    try {
      for (const subjectIndex in subjectEntries) {
          const subjectEntry = subjectEntries[subjectIndex];
          const subjectName = subjectEntry.name;
          if (!subjectName) continue;

          const papers = [];
          for (const paperIndex in subjectEntry.papers) {
              const paperEntry = subjectEntry.papers[paperIndex];
              let pdfUrl = paperEntry.pdfUrl || '';

              if (paperEntry.pdf && paperEntry.pdf.size > 0 && paperEntry.title) {
                  const destination = `previous-year-questions/${questionData.exam}/${questionData.year}/${generateSlug(subjectName)}/${generateSlug(paperEntry.title)}-${paperEntry.pdf.name}`;
                  pdfUrl = await uploadFileToGCS(paperEntry.pdf, destination);
              }
              if (paperEntry.title) {
                  papers.push({
                      title: paperEntry.title,
                      pdfUrl: pdfUrl,
                  });
              }
          }
          questionData.subjects.push({ name: subjectName, papers: papers });
      }

      const docRef = doc(db, "previousYearQuestions", id);
      await updateDoc(docRef, questionData);
        
      return { success: true, message: "Question paper updated successfully." };
    } catch (error) {
      console.error("Error updating question paper:", error);
      return { success: false, message: "Failed to update question paper." };
    }
}


export async function deletePreviousYearQuestion(id: string) {
    try {
        const docRef = doc(db, "previousYearQuestions", id);
        await deleteDoc(docRef);
        return { success: true, message: "Question paper deleted successfully." };
    } catch (error) {
        console.error("Error deleting question paper:", error);
        return { success: false, message: "Failed to delete question paper." };
    }
}
