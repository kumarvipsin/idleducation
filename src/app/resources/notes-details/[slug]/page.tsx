
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from 'next/navigation'
import { Suspense, use } from "react";

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
      content: `### What was the Soviet System?
- The Union of Soviet Socialist Republics (USSR) came into being after the Socialist Revolution in Russia in 1917, inspired by the ideals of socialism and opposing capitalism.
- It was a one-party system, dominated by the Communist Party, with a state-controlled and planned economy.
- After WWII, many Eastern European countries came under Soviet influence, forming the 'socialist bloc' or the Second World, held together by the Warsaw Pact military alliance.
- The Soviet economy was highly developed with vast energy resources, a complex communication network, and a domestic industry that produced everything from pins to cars. The state ensured a minimum standard of living for all citizens through subsidies.
- However, the system became authoritarian and bureaucratic, lacking democracy and freedom of speech. Over time, it stagnated economically and failed to meet the political and economic aspirations of its people.

### Gorbachev and the Disintegration
- Mikhail Gorbachev, who became General Secretary of the Communist Party in 1985, initiated reforms to democratize and revitalize the stagnant Soviet system.
- His key policies were **Perestroika** (restructuring) and **Glasnost** (openness), aimed at reforming the economy and political system.
- These reforms, however, had unintended consequences. They unleashed forces and expectations that were difficult to control.
- A wave of nationalism and desire for sovereignty rose within various republics of the Soviet Union, including Russia, the Baltic republics (Estonia, Latvia, and Lithuania), Ukraine, and Georgia.
- A coup occurred in 1991, encouraged by Communist Party hardliners, which failed but further weakened Gorbachev's authority and accelerated the collapse. Boris Yeltsin emerged as a national hero for opposing the coup.
- In December 1991, under the leadership of Boris Yeltsin (Russia), Leonid Kravchuk (Ukraine), and Stanislav Shushkevich (Belarus), the Soviet Union was formally dissolved. The Commonwealth of Independent States (CIS) was formed as a loose successor entity.

### Reasons for the Soviet Collapse
1.  **Economic Stagnation:** For many years, the Soviet economy lagged behind the West. Severe shortages of consumer goods, coupled with the massive military spending to keep up with the US in the arms race, crippled the economy.
2.  **Political and Administrative Stagnation:** The single-party system became unaccountable and corrupt. The centralized authority was insensitive to the needs of the people in the 15 constituent republics. Rampant corruption and the inability of the system to correct its mistakes were significant factors.
3.  **Gorbachev’s Reforms:** While intended to save the system, the policies of Glasnost and Perestroika provided more freedom, which allowed long-suppressed nationalist feelings and discontent to surface. The pace of reform was too slow for some and too fast for others, creating instability.
4.  **Rise of Nationalism:** The desire for sovereignty among various republics was a primary catalyst. People from different regions felt neglected and often suppressed by the dominance of Russia.

### Consequences of Disintegration
1.  **End of the Cold War:** The collapse of the Soviet Union marked the end of the Cold War, the arms race, and the ideological confrontation between communism and capitalism.
2.  **Shift in World Power:** The bipolar world order ended, leaving the United States as the sole superpower, leading to a unipolar or multipolar world where the US held significant influence.
3.  **Emergence of New Countries:** Many new countries emerged with their own independent aspirations, particularly in Eastern Europe and the former Soviet republics.
4.  **Shock Therapy:** Most of these newly independent countries transitioned from state-controlled socialism to democratic capitalism. This process, known as 'Shock Therapy', involved a rapid and radical shift to a market-based economy, which led to immense economic hardship for the general population in the initial years.
`
    },
    hi: {
      title: 'अध्याय 2: दो ध्रुवीयता का अंत',
      content: 'यह अध्याय सोवियत संघ के पतन और शीत युद्ध की समाप्ति पर चर्चा करता है, जिससे संयुक्त राज्य अमेरिका के प्रभुत्व वाली एकध्रुवीय दुनिया का उदय हुआ। यह इन ऐतिहासिक घटनाओं के कारणों और परिणामों की जांच करता है।'
    }
  },
    'us-hegemony-in-world-politics': {
    en: {
      title: 'Chapter 3: US Hegemony in World Politics',
      content: 'This chapter analyzes the period of American dominance in global politics after the Cold War. It explores the nature of US hegemony and its impact on international relations.'
    },
    hi: {
      title: 'अध्याय 3: समकालीन विश्व में अमरीकी वर्चस्व',
      content: 'यह अध्याय शीत युद्ध के बाद वैश्विक राजनीति में अमेरिकी प्रभुत्व के काल का विश्लेषण करता है। यह अमेरिकी वर्चस्व की प्रकृति और अंतरराष्ट्रीय संबंधों पर इसके प्रभाव की पड़ताल करता है।'
    }
  },
  'alternative-centres-of-power': {
    en: {
      title: 'Chapter 4: Alternative Centres of Power',
      content: 'This chapter examines the rise of alternative centers of power that challenge the unipolar world order. It focuses on the European Union, ASEAN, and the rise of China as significant global players.'
    },
    hi: {
      title: 'अध्याय 4: सत्ता के वैकल्पिक केंद्र',
      content: 'यह अध्याय सत्ता के वैकल्पिक केंद्रों के उदय की जांच करता है जो एकध्रुवीय विश्व व्यवस्था को चुनौती देते हैं। यह यूरोपीय संघ, आसियान और चीन के महत्वपूर्ण वैश्विक खिलाड़ियों के रूप में उदय पर केंद्रित है।'
    }
  },
  'contemporary-south-asia': {
    en: {
      title: 'Chapter 5: Contemporary South Asia',
      content: 'This chapter provides an overview of the political dynamics in South Asia. It covers the experiences of democracy, conflict, and cooperation among the countries in the region.'
    },
    hi: {
      title: 'अध्याय 5: समकालीन दक्षिण एशिया',
      content: 'यह अध्याय दक्षिण एशिया में राजनीतिक गतिशीलता का अवलोकन प्रदान करता है। इसमें क्षेत्र के देशों के बीच लोकतंत्र, संघर्ष और सहयोग के अनुभवों को शामिल किया गया है।'
    }
  },
  'international-organisations': {
    en: {
      title: 'Chapter 6: International Organisations',
      content: 'This chapter discusses the role of international organizations in world politics, with a special focus on the United Nations. It assesses their relevance and effectiveness in the contemporary world.'
    },
    hi: {
      title: 'अध्याय 6: अंतर्राष्ट्रीय संगठन',
      content: 'यह अध्याय विश्व राजनीति में अंतरराष्ट्रीय संगठनों की भूमिका पर चर्चा करता है, जिसमें संयुक्त राष्ट्र पर विशेष ध्यान दिया गया है। यह समकालीन दुनिया में उनकी प्रासंगिकता और प्रभावशीलता का आकलन करता है।'
    }
  },
  'security-in-the-contemporary-world': {
    en: {
      title: 'Chapter 7: Security in the Contemporary World',
      content: 'This chapter explores the concept of security in the contemporary world, covering both traditional and non-traditional threats. It discusses issues like terrorism, human rights, and global poverty.'
    },
    hi: {
      title: 'अध्याय 7: समकालीन विश्व में सुरक्षा',
      content: 'यह अध्याय पारंपरिक और गैर-पारंपरिक दोनों खतरों को कवर करते हुए समकालीन दुनिया में सुरक्षा की अवधारणा की पड़ताल करता है। इसमें आतंकवाद, मानवाधिकार और वैश्विक गरीबी जैसे मुद्दों पर चर्चा की गई है।'
    }
  },
  'environment-and-natural-resources': {
    en: {
      title: 'Chapter 8: Environment and Natural Resources',
      content: 'This chapter deals with the growing significance of environmental issues and natural resources in global politics. It highlights global environmental concerns and efforts to address them.'
    },
    hi: {
      title: 'अध्याय 8: पर्यावरण और प्राकृतिक संसाधन',
      content: 'यह अध्याय वैश्विक राजनीति में पर्यावरणीय मुद्दों और प्राकृतिक संसाधनों के बढ़ते महत्व से संबंधित है। यह वैश्विक पर्यावरणीय चिंताओं और उन्हें दूर करने के प्रयासों पर प्रकाश डालता है।'
    }
  },
  'globalisation': {
    en: {
      title: 'Chapter 9: Globalisation',
      content: 'This chapter explains the concept of globalization, its causes, and its consequences in various spheres. It critically assesses the impact of globalization on different parts of the world.'
    },
    hi: {
      title: 'अध्याय 9: वैश्वीकरण',
      content: 'यह अध्याय वैश्वीकरण की अवधारणा, इसके कारणों और विभिन्न क्षेत्रों में इसके परिणामों की व्याख्या करता है। यह दुनिया के विभिन्न हिस्सों पर वैश्वीकरण के प्रभाव का आलोचनात्मक मूल्यांकन करता है।'
    }
  },
    'challenges-of-nation-building': {
    en: {
      title: 'Chapter 1: Challenges of Nation Building',
      content: 'This chapter focuses on the challenges faced by India immediately after independence, including partition, integration of princely states, and reorganization of states.'
    },
    hi: {
      title: 'अध्याय 1: राष्ट्र-निर्माण की चुनौतियाँ',
      content: 'यह अध्याय स्वतंत्रता के तुरंत बाद भारत द्वारा सामना की गई चुनौतियों पर केंद्रित है, जिसमें विभाजन, रियासतों का एकीकरण और राज्यों का पुनर्गठन शामिल है।'
    }
  },
  'era-of-one-party-dominance': {
    en: {
      title: 'Chapter 2: Era of One-Party Dominance',
      content: 'This chapter discusses the dominance of the Congress party in the first three general elections in India. It analyzes the factors responsible for this dominance and the nature of opposition parties.'
    },
    hi: {
      title: 'अध्याय 2: एक दल के प्रभुत्व का दौर',
      content: `### लोकतंत्र स्थापित करने की चुनौती
पहली समस्या का सामना करने के बाद भारत के सामने दूसरी मुख्य समस्या लोकतंत्र स्थापित करने की थी। 15 अगस्त 1947 में आज़ादी प्राप्त करने के बाद भारत ने संविधान निर्माण की प्रक्रिया को पूरा किया।

- **संविधान निर्माण:** भारतीय संविधान को बनने में 2 साल 11 महीने और 18 दिनों का समय लगा।
- **लागू होना:** भारतीय संविधान 26 नवंबर 1949 को बन कर पूरा हुआ और 26 जनवरी 1950 को लागू कर दिया गया।

संविधान लागु होने के बाद सबसे बड़ा काम था लोकतंत्र की स्थापना करना।

### चुनाव आयोग की स्थापना
जनवरी 1950 में चुनाव आयोग की स्थापना की गई और सुकुमार सेन देश के पहले चुनाव आयुक्त बने।

### चुनाव करवाने की चुनौतियाँ
देश में चुनाव करवाना किसी चुनौती से कम नहीं था। ऐसा इसीलिए था क्योंकि:
- **साक्षरता:** देश में केवल 16 प्रतिशत लोग ही पढ़े लिखे थे।
- **गरीबी:** देश की अधिकांश जनसँख्या गरीबी से जूझ रही थी।
- **संसाधनों का आभाव:** संचार के साधनों एवं प्रौद्योगिकी का आभाव था।
- **विशाल मतदाता:** 17 करोड़ मतदाताओं द्वारा 3200 विधायक और 489 सांसद चुने जाने थे।
- **चुनाव क्षेत्रों का निर्धारण:** चुनाव क्षेत्रों का निर्धारण किया जाना था।

### भारत का पहला आम चुनाव (1952)
देश में पहले आम चुनाव करवाने के लिए:
- लगभग 3 लाख लोगो को प्रशिक्षित किया गया।
- चुनाव क्षेत्रों का सीमांकन किया गया।
- मतदाता सूची बनाई गई (प्रत्येक व्यक्ति जो 21 वर्ष से अधिक आयु का था)।
- देश में चुनाव प्रचार शुरू हुआ।`
    }
  },
  'politics-of-planned-development': {
    en: {
      title: 'Chapter 3: Politics of Planned Development',
      content: 'This chapter examines India\'s strategy of planned development after independence, focusing on the debates around economic models and the role of the Planning Commission.'
    },
    hi: {
      title: 'अध्याय 3: नियोजित विकास की राजनीति',
      content: 'यह अध्याय स्वतंत्रता के बाद भारत की नियोजित विकास की रणनीति की जांच करता है, जिसमें आर्थिक मॉडल और योजना आयोग की भूमिका के आसपास की बहसों पर ध्यान केंद्रित किया गया है।'
    }
  },
  'indias-external-relations': {
    en: {
      title: 'Chapter 4: India’s External Relations',
      content: 'This chapter provides an overview of India\'s foreign policy principles and its relations with other countries, particularly during the Cold War era.'
    },
    hi: {
      title: 'अध्याय 4: भारत के विदेश संबंध',
      content: 'यह अध्याय भारत की विदेश नीति के सिद्धांतों और अन्य देशों के साथ इसके संबंधों का अवलोकन प्रदान करता है, विशेष रूप से शीत युद्ध के युग के दौरान।'
    }
  },
  'challenges-to-and-restoration-of-the-congress-system': {
    en: {
      title: 'Chapter 5: Challenges to and Restoration of the Congress System',
      content: 'This chapter analyzes the political challenges faced by the Congress party in the 1960s and its subsequent restoration to power under Indira Gandhi.'
    },
    hi: {
      title: 'अध्याय 5: कांग्रेस प्रणाली: चुनौतियाँ और पुनर्स्थापना',
      content: 'यह अध्याय 1960 के दशक में कांग्रेस पार्टी द्वारा सामना की गई राजनीतिक चुनौतियों और इंदिरा गांधी के अधीन सत्ता में उसकी बाद की बहाली का विश्लेषण करता है।'
    }
  },
  'the-crisis-of-democratic-order': {
    en: {
      title: 'Chapter 6: The Crisis of Democratic Order',
      content: 'This chapter discusses the political turmoil of the 1970s, culminating in the imposition of the Emergency. It examines the causes and consequences of this period.'
    },
    hi: {
      title: 'अध्याय 6: लोकतांत्रिक व्यवस्था का संकट',
      content: 'यह अध्याय 1970 के दशक की राजनीतिक उथल-पुथल पर चर्चा करता है, जिसकी परिणति आपातकाल लागू होने में हुई। यह इस अवधि के कारणों और परिणामों की जांच करता है।'
    }
  },
  'rise-of-popular-movements': {
    en: {
      title: 'Chapter 7: Rise of Popular Movements',
      content: 'This chapter highlights the emergence of various popular movements in India during the 1970s and 1980s, reflecting social and political discontent.'
    },
    hi: {
      title: 'अध्याय 7: जन आंदोलनों का उदय',
      content: 'यह अध्याय 1970 और 1980 के दशक के दौरान भारत में विभिन्न लोकप्रिय आंदोलनों के उद्भव पर प्रकाश डालता है, जो सामाजिक और राजनीतिक असंतोष को दर्शाता है।'
    }
  },
  'regional-aspirations': {
    en: {
      title: 'Chapter 8: Regional Aspirations',
      content: 'This chapter examines the rise of regional aspirations and movements in different parts of India, and the response of the central government to these demands.'
    },
    hi: {
      title: 'अध्याय 8: क्षेत्रीय आकांक्षाएँ',
      content: 'यह अध्याय भारत के विभिन्न हिस्सों में क्षेत्रीय आकांक्षाओं और आंदोलनों के उदय और इन मांगों पर केंद्र सरकार की प्रतिक्रिया की जांच करता है।'
    }
  },
  'recent-developments-in-indian-politics': {
    en: {
      title: 'Chapter 9: Recent Developments in Indian Politics',
      content: 'This chapter covers the major political developments in India since the late 1980s, including the rise of coalition politics, Mandal Commission, and economic reforms.'
    },
    hi: {
      title: 'अध्याय 9: भारतीय राजनीति: नए बदलाव',
      content: 'यह अध्याय 1980 के दशक के अंत से भारत में प्रमुख राजनीतिक विकास को शामिल करता है, जिसमें गठबंधन की राजनीति का उदय, मंडल आयोग और आर्थिक सुधार शामिल हैं।'
    }
  },
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

const ContentRenderer = ({ content }: { content: string }) => {
  const lines = content.split('\n');

  return (
    <div className="space-y-4">
      {lines.map((line, index) => {
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold mt-6 mb-2 pb-2 border-b">{line.substring(4)}</h3>;
        }
        if (line.startsWith('- ')) {
          const boldMatch = line.match(/\*\*(.*?)\*\*/);
          if (boldMatch) {
            const parts = line.substring(2).split(`**${boldMatch[1]}**`);
            return (
              <li key={index} className="flex items-start">
                <span className="mr-2 mt-1">&#8226;</span>
                <span>{parts[0]}<strong className="font-semibold">{boldMatch[1]}</strong>{parts[1]}</span>
              </li>
            );
          }
          return (
            <li key={index} className="flex items-start">
              <span className="mr-2 mt-1">&#8226;</span>
              <span>{line.substring(2)}</span>
            </li>
          );
        }
        if (line.trim() === '') {
          return null;
        }
        return <p key={index} className="text-foreground/80 leading-relaxed">{line}</p>;
      })}
    </div>
  );
};


function NotesContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') === 'hi' ? 'hi' : 'en';
  
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
          <ContentRenderer content={notes.content} />
        </CardContent>
      </Card>
    </div>
  )
}

export default function NotesDetailsPage({ params }: { params: { slug: string } }) {
    const { slug } = use(params);
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NotesContent slug={slug} />
        </Suspense>
    )
}
