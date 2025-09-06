
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from 'next/navigation'
import { Suspense } from "react";

const notesData: { [key: string]: { en: { title: string, content: string }, hi: { title: string, content: string } } } = {
  'the-cold-war-era': {
    en: {
      title: 'Chapter 1: The Cold War Era',
      content: 'This chapter provides an overview of the Cold War, a period of geopolitical tension between the United States and the Soviet Union and their respective allies. Key topics include the ideological conflict, the arms race, and major international crises.'
    },
    hi: {
      title: 'अध्याय 1: शीतयुद्ध का दौर',
      content: 'यह अध्याय शीत युद्ध का अवलोकन प्रदान करता है, जो संयुक्त राज्य अमेरिका और सोवियत संघ और उनके संबंधित सहयोगियों के बीच भू-राजनीतिक तनाव का काल था। प्रमुख विषयों में वैचारिक संघर्ष, हथियारों की दौड़ और प्रमुख अंतर्राष्ट्रीय संकट शामिल हैं।'
    }
  },
  'the-end-of-bipolarity': {
    en: {
      title: 'Chapter 2: The End of Bipolarity',
      content: 'This chapter discusses the collapse of the Soviet Union and the end of the Cold War, leading to a unipolar world dominated by the United States. It examines the causes and consequences of these historic events.'
    },
    hi: {
      title: 'अध्याय 2: दो ध्रुवीयता का अंत',
      content: 'यह अध्याय सोवियत संघ के पतन और शीत युद्ध की समाप्ति पर चर्चा करता है, जिससे संयुक्त राज्य अमेरिका के प्रभुत्व वाली एकध्रुवीय दुनिया का उदय हुआ। यह इन ऐतिहासिक घटनाओं के कारणों और परिणामों की जांच करता है।'
    }
  },
  // Add other chapters here...
  'default': {
    en: {
      title: 'Notes Not Found',
      content: 'Detailed notes for this chapter will be available soon. Please check back later.'
    },
    hi: {
      title: 'नोट्स नहीं मिले',
      content: 'इस अध्याय के विस्तृत नोट्स जल्द ही उपलब्ध होंगे। कृपया बाद में फिर से देखें।'
    }
  }
};

function NotesContent({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') === 'hi' ? 'hi' : 'en';
  const slug = params.slug;
  
  const chapterNotes = notesData[slug] || notesData['default'];
  const notes = chapterNotes[lang];

  return (
     <div className="container mx-auto py-12 px-4 md:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{notes.title}</CardTitle>
          <CardDescription>Detailed notes for your study and revision.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              {notes.content}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function NotesDetailsPage({ params }: { params: { slug: string } }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NotesContent params={params} />
        </Suspense>
    )
}
