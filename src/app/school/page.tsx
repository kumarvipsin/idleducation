
'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, BookOpen, ArrowRight, Calendar, Users, MessageCircle, Tag, Tv, Zap, UserCheck, BookCopy, FileText, BookCheck as BookCheckIcon, ClipboardEdit } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useSearchParams } from 'next/navigation';
import { TeacherCard } from '@/components/landing/teacher-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useLanguage } from '@/context/language-context';
import Autoplay from "embla-carousel-autoplay";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';


const classes = [
  'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
];

const resourceLinks = [
  { href: '/resources/reference-books', label: 'Reference Books', icon: <BookCopy /> },
  { href: '/resources/previous-year-questions', label: 'Previous Year Question Paper', icon: <FileText /> },
  { href: '/resources/ncert-solutions', label: 'NCERT Solutions', icon: <BookCheckIcon /> },
  { href: '/resources/notes', label: 'Notes', icon: <ClipboardEdit /> },
];

const class5MathsSyllabus = {
  description: "The CBSE class 5 Maths syllabus will cover numbers, measurements, geometry, arithmetic operations, and data handling. Students will learn to solve real-life problems with logical reasoning skills. They will learn to use the BODMAS rule, solve fractions, understand various geometric shapes, and be introduced to mensuration and data handling. The CBSE class 5 syllabus for Maths is as follows:",
  chapters: [
    { chapter: "Chapter 1", name: "The Fish Tale" },
    { chapter: "Chapter 2", name: "Shapes and Angles" },
    { chapter: "Chapter 3", name: "How Many Squares?" },
    { chapter: "Chapter 4", name: "Parts and Wholes" },
    { chapter: "Chapter 5", name: "Does it Look the Same?" },
    { chapter: "Chapter 6", name: "Be My Multiple, I'll Be Your Factor" },
    { chapter: "Chapter 7", name: "Can You See the Pattern?" },
    { chapter: "Chapter 8", name: "Mapping Your Way" },
    { chapter: "Chapter 9", name: "Boxes and Sketches" },
    { chapter: "Chapter 10", name: "Tenths and Hundredths" },
    { chapter: "Chapter 11", name: "Area and its Boundary" },
    { chapter: "Chapter 12", name: "Smart Charts" },
    { chapter: "Chapter 13", name: "Ways to Multiply and Divide" },
    { chapter: "Chapter 14", name: "How Big, How Heavy?" },
  ],
};

const class5EvsSyllabus = {
  description: "The class 5 CBSE EVS syllabus covers topics like understanding ecosystems, natural resources, sustainability, and conservation. They study various food sources, including plants and animals, and learn about balanced diets and healthy eating habits. The curriculum introduces students to different types of houses and shelters worldwide, the properties of magnets, and the basics of electricity. The CBSE class 5 syllabus for EVS is as follows:",
  chapters: [
    { chapter: "Chapter 1", name: "Super Senses" },
    { chapter: "Chapter 2", name: "A Snake Charmer's Story" },
    { chapter: "Chapter 3", name: "From Tasting to Digesting" },
    { chapter: "Chapter 4", name: "Mangoes Round the Year" },
    { chapter: "Chapter 5", name: "Seeds And Seeds" },
    { chapter: "Chapter 6", name: "Every Drop Counts" },
    { chapter: "Chapter 7", name: "Experiments With Water" },
    { chapter: "Chapter 8", name: "A Treat for Mosquitoes" },
    { chapter: "Chapter 9", name: "Up You Go" },
    { chapter: "Chapter 10", name: "Walls Tell Stories" },
    { chapter: "Chapter 11", name: "Sunita In Space" },
    { chapter: "Chapter 12", name: "What If It Finishes" },
    { chapter: "Chapter 13", name: "A Shelter So High" },
    { chapter: "Chapter 14", name: "When The Earth Shook" },
    { chapter: "Chapter 15", name: "Blow Hot Blow Cold" },
    { chapter: "Chapter 16", name: "Who Will Do This Work" },
    { chapter: "Chapter 17", name: "Across The Wall" },
    { chapter: "Chapter 18", name: "No Place for Us" },
    { chapter: "Chapter 19", name: "A Seed Tells a Farmer's Story" },
    { chapter: "Chapter 20", name: "Whose Forests" },
    { chapter: "Chapter 21", name: "Like Father Like Daughter" },
    { chapter: "Chapter 22", name: "On The Move Again" },
  ],
};

const class5EnglishSyllabus = {
  description: "The CBSE class 5 English syllabus aims to improve language skills by focusing on reading, writing, grammar, vocabulary, and comprehension. Introducing students to different forms of literature enhances their appreciation of storytelling and hones their communication abilities. The 5th class CBSE syllabus for English also teaches students the importance of proper spelling, punctuation, and sentence structure. The CBSE 5 standard syllabus for English is as follows:",
  chapters: [
    { chapter: "Chapter 1", name: "Ice-cream Man" },
    { chapter: "Chapter 2", name: "Wonderful Waste!" },
    { chapter: "Chapter 3", name: "Teamwork" },
    { chapter: "Chapter 4", name: "Flying Together" },
    { chapter: "Chapter 5", name: "My Shadow" },
    { chapter: "Chapter 6", name: "Robinson Crusoe Discovers a Footprint" },
    { chapter: "Chapter 7", name: "Crying" },
    { chapter: "Chapter 8", name: "My Elder Brother" },
    { chapter: "Chapter 9", name: "The Lazy Frog" },
    { chapter: "Chapter 10", name: "Rip Van Winkle" },
    { chapter: "Chapter 11", name: "Class Discussion" },
    { chapter: "Chapter 12", name: "The Talkative Barber" },
    { chapter: "Chapter 13", name: "Topsy-turvy Land" },
    { chapter: "Chapter 14", name: "Gulliver's Travels" },
    { chapter: "Chapter 15", name: "Nobody's Friend" },
    { chapter: "Chapter 16", name: "The Little Bully" },
    { chapter: "Chapter 17", name: "Sing a Song of People" },
    { chapter: "Chapter 18", name: "Malu Bhalu" },
    { chapter: "Chapter 19", name: "Who Will be Ningthou?" },
  ],
};

const class6MathsSyllabus = {
  description: "The CBSE Class 6 Maths syllabus is designed to build a strong foundation in basic mathematical concepts and problem-solving skills. Students are encouraged to understand and apply concepts through practical examples and exercises. Check the table below for a detailed breakdown of the syllabus.",
  chapters: [
    { chapter: "Pattern In Mathematics", topics: ["1.1 What is Mathematics?", "1.2 Patterns in Numbers", "1.3 Visualising Number Sequences", "1.4 Relations among Number Sequences", "1.5 Patterns In Shapes", "1.6 Relation to Number Sequences"] },
    { chapter: "Lines and Angles", topics: ["2.1 Point", "2.2 Line Segment", "2.3 Line", "2.4 Ray", "2.5 Angle", "2.6 Comparing Angles", "2.7 Making Rotating Arms", "2.8 Special Types of Angles", "2.9 Measuring Angles", "2.10 Drawing Angles", "2.11 Types of Angles and their Measures"] },
    { chapter: "Number Play", topics: ["3.1 Numbers can Tell us Things", "3.2 Supercells", "3.3 Patterns of Numbers on the Number Line", "3.4 Playing with Digits", "3.5 Pretty Palindromic Patterns", "3.6 The Magic Number of Kaprekar", "3.7 Clock and Calendar Numbers", "3.8 Mental Math", "3.9 Playing with Number Patterns", "3.10 An Unsolved Mystery — the Collatz Conjecture", "3.11 Simple Summation", "3.12 Games and Winning Strategies"] },
    { chapter: "Data Handling and Presentation", topics: ["4.1 Collecting and Organising Data", "4.2 Pictographs", "4.3 Bar Graphs", "4.4 Drawing a Bar Graph", "4.5 Artistic and Aesthetic Considerations"] },
    { chapter: "Prime Time", topics: ["5.1 Common Multiples and Common Factors", "5.2 Prime Numbers", "5.3 Co-prime numbers for safekeeping treasures", "5.4 Prime Factorisation", "5.5 Divisibility Tests", "5.6 Fun with numbers"] },
    { chapter: "Perimeter and Area", topics: ["6.1 Perimeter", "6.2 Area", "6.3 Area of a Triangle"] },
    { chapter: "Fractions", topics: ["7.1 Fractional Units and Equal Shares", "7.2 Fractional Units as Parts of a Whole", "7.3 Measuring Using Fractional Units", "7.4 Marking Fraction Lengths on the Number Line", "7.5 Mixed Fractions", "7.6 Equivalent Fractions", "7.7 Comparing Fractions", "7.8 Addition and Subtraction of Fractions", "7.9 A Pinch of History"] },
    { chapter: "Play with Construction", topics: ["8.1 Artwork", "8.2 Squares and Rectangles", "8.3 Constructing Squares and Rectangles", "8.4 An Exploration in Rectangles", "8.5 Exploring Diagonals of Rectangles and Squares", "8.6 Points Equidistant from Two Given Points"] },
    { chapter: "Symmetry", topics: ["9.1 Line of Symmetry", "9.2 Rotational Symmetry"] },
    { chapter: "The Other Side of Zero", topics: ["10.1 Bela's Building of Fun", "10.2 The Token Model", "10.3 Integers in Other Places", "10.4 Explorations with Integers", "10.5 A Pinch of History"] }
  ]
};

const class6ScienceSyllabus = {
  description: "The CBSE Class 6 Science syllabus is designed to spark curiosity and develop scientific thinking in young learners. It covers a range of topics from food, materials, and living organisms to motion, measurement, and electricity. Check the table below for a detailed overview of the chapters included in the Class 6 Science syllabus for the academic year.",
  chapters: [
    { chapter: "Chapter 1", name: "The Wonderful World of Science" },
    { chapter: "Chapter 2", name: "Diversity in Living World" },
    { chapter: "Chapter 3", name: "Mindful Eating: A Path to a Healthy Body" },
    { chapter: "Chapter 4", name: "Exploring Magnets" },
    { chapter: "Chapter 5", name: "Measurement of Length and Motion" },
    { chapter: "Chapter 6", name: "Material Around Us" },
    { chapter: "Chapter 7", name: "Temperature and its Measurement" },
    { chapter: "Chapter 8", name: "A Journey through States of Water" },
    { chapter: "Chapter 9", name: "Methods of Separation in Everyday Life" },
    { chapter: "Chapter 10", name: "Living Creatures: Exploring their Characteristics" },
    { chapter: "Chapter 11", name: "Nature's Treasures" },
    { chapter: "Chapter 12", name: "Beyond Earth" },
  ],
};

const class6SocialScienceSyllabus = {
  description: "Check the table below for the detailed CBSE Class 6 Social Science syllabus. It covers topics from History, Geography, and Civics, designed to build a strong foundation in understanding society, the environment, and past civilizations. This syllabus encourages students to think critically and explore how historical and social processes shape the world around them.",
  themes: [
    { theme: "Theme A — India and the World: Land and the People", topics: ["Locating Places on Earth", "Oceans and Continents", "Landforms and Life"] },
    { theme: "Theme B — Tapestry of the Past", topics: ["Timelines and Sources of History", "India, That is Bharat", "Beginnings of Indian Civilisation"] },
    { theme: "Theme C — Our Cultural Heritage and Knowledge Traditions", topics: ["Indian Cultural Roots", "Unity in Diversity, or ‘Many in the One’"] },
    { theme: "Theme D — Governance and Democracy", topics: ["Family and Community", "Grassroots Democracy - Part 1: Governance", "Grassroots Democracy - Part 2: Local Government in Rural Areas", "Grassroots Democracy - Part 3: Local Government in Urban Areas", "Unity in Diversity, or ‘Many in the One’"] },
    { theme: "Theme E — Economic Life Around Us", topics: ["The Value of Work", "Economic Activities Around Us"] }
  ]
};

const class6EnglishSyllabus = {
  description: "The CBSE Class 6 English syllabus is designed to build a strong foundation in language skills through literature, grammar, and writing. It encourages reading comprehension, creative expression, and vocabulary development. Students explore a variety of prose and poetry to enhance their understanding. Check the table below for a detailed breakdown of the syllabus components and learning objectives.",
  units: [
    { name: "Unit 1 - Fables and Folk Tales", topics: ["A Bottle of Dew", "The Raven and the Fox", "Rama to the Rescue"] },
    { name: "Unit 2 - Friendship", topics: ["The Unlikely Best Friends", "A Friend's Prayer", "The Chair"] },
    { name: "Unit 3 - Nurturing Nature", topics: ["Neem Baba", "What a Bird Thought", "Spices that Heal Us"] },
    { name: "Unit 4 - Sports and Wellness", topics: ["Change of Heart", "The Winner", "Yoga—A Way of Life"] },
    { name: "Unit 5 - Culture and Tradition", topics: ["Hamara Bharat—Incredible India!", "The Kites", "Ila Sachani: Embroidering Dreams with her Feet", "National War Memorial"] },
  ]
};


function SchoolPageContent() {
  const searchParams = useSearchParams();
  const classParam = searchParams.get('class');
  const [activeClass, setActiveClass] = useState('Class 6');
  const [animationKey, setAnimationKey] = useState(0);
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  const autoplayPlugin = useRef(
    Autoplay({ delay: 1000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [activeClass]);

  const teamMembers = [
    {
        name: t('team.member5.name'),
        designation: t('team.member5.designation'),
        experience: t('team.member5.experience'),
        avatar: "/vijay.jpg",
        avatarHint: "Vijay Verma"
    },
    {
        name: t('team.member2.name'),
        designation: t('team.member2.designation'),
        experience: t('team.member2.experience'),
        avatar: "/manish.jpg",
        avatarHint: "Manish Sharma"
    },
    {
        name: t('team.member4.name'),
        designation: t('team.member4.designation'),
        experience: t('team.member4.experience'),
        avatar: "/vidhi.jpg",
        avatarHint: "Vidhi Sharma"
    },
    {
        name: t('team.member3.name'),
        designation: t('team.member3.designation'),
        experience: t('team.member3.experience'),
        avatar: "/chandu.jpg",
        avatarHint: "Chandra Prakash"
    },
    {
        name: t('team.member1.name'),
        designation: t('team.member1.designation'),
        experience: t('team.member1.experience'),
        avatar: "/amod.jpg",
        avatarHint: "Amod Sharma"
    },
    {
        name: t('team.member6.name'),
        designation: t('team.member6.designation'),
        experience: t('team.member6.experience'),
        avatar: "/vikash.jpg",
        avatarHint: "Vikas Kumar"
    }
  ];

  useEffect(() => {
    if (classParam && classes.includes(classParam)) {
      setActiveClass(classParam);
    }
  }, [classParam]);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
       <section className="mb-8">
        <Card className="overflow-hidden shadow-lg">
          <div className="relative w-full aspect-[16/4]">
            <Image
              src="/result.jpg"
              alt="Our Toppers"
              data-ai-hint="student success"
              fill
              className="object-cover"
            />
          </div>
        </Card>
      </section>

      <div className="mb-8">
        <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex justify-start md:justify-center items-center gap-2 whitespace-nowrap px-4 sm:px-0">
            {classes.map((className) => (
              <button
                key={className}
                onClick={() => setActiveClass(className)}
                className={`py-2 px-4 whitespace-nowrap text-sm font-medium transition-colors border
                  ${activeClass === className 
                    ? 'border-primary text-primary bg-primary/10 rounded-md' 
                    : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-md'}`}
              >
                {className}
              </button>
            ))}
          </div>
        </div>
      </div>
      
       {activeClass && (
        <section key={animationKey} className="w-full pb-12 md:pb-24 animate-fade-in-up">
            <div className="container mx-auto px-4 md:px-[10%]">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">
                  <span className="text-black dark:text-white">Know Your </span>
                  <span style={{ color: '#ced4da' }}>Teachers</span>
                </h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                  Our dedicated team of educators is here to guide you on your learning journey.
                </p>
              </div>
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                plugins={[autoplayPlugin.current]}
                className="w-full max-w-6xl mx-auto"
              >
                <CarouselContent className="-ml-4">
                  {teamMembers.map((member, index) => (
                    <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <TeacherCard {...member} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </section>
        )}

      <section className="w-full pb-12 md:pb-24 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="container mx-auto px-4 md:px-[10%]">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">
                  {`${activeClass} Online Coaching 2025-2026`}
                </h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Everything you need to know about the curriculum, exams, and resources.
                </p>
            </div>
            <Card className="shadow-lg">
                <CardContent className="p-6 space-y-8">
                    <div>
                        <h3 className="font-bold text-xl mb-2 text-primary border-b pb-2">Syllabus & Study Strategy</h3>
                        {activeClass === 'Class 5' && (
                          <div className="space-y-8">
                              <Card className="mb-8">
                                <CardContent className="p-6">
                                  <h4 className="font-bold text-lg mb-4">Table of Content:</h4>
                                  <ul className="list-disc pl-5 space-y-2">
                                    <li>
                                      <a href="#maths-syllabus" className="text-primary hover:underline">CBSE Class 5 Maths Syllabus</a>
                                    </li>
                                    <li>
                                      <a href="#evs-syllabus" className="text-primary hover:underline">Class 5 CBSE EVS Syllabus</a>
                                    </li>
                                    <li>
                                      <a href="#english-syllabus" className="text-primary hover:underline">CBSE Class 5 English Syllabus</a>
                                    </li>
                                  </ul>
                                </CardContent>
                              </Card>
                              <div className="space-y-4">
                                  <h4 id="maths-syllabus" className="font-semibold text-lg">CBSE Class 5 Maths Syllabus</h4>
                                  <p className="text-muted-foreground">{class5MathsSyllabus.description}</p>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="w-[150px]">Chapter No.</TableHead>
                                        <TableHead>Chapter Name</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {class5MathsSyllabus.chapters.map(item => (
                                        <TableRow key={item.chapter}>
                                          <TableCell className="font-medium">{item.chapter}</TableCell>
                                          <TableCell>{item.name}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                              </div>
                               <Separator />
                              <div className="space-y-4">
                                  <h4 id="evs-syllabus" className="font-semibold text-lg">Class 5 CBSE EVS Syllabus</h4>
                                  <p className="text-muted-foreground">{class5EvsSyllabus.description}</p>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="w-[150px]">Chapter No.</TableHead>
                                        <TableHead>Chapter Name</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {class5EvsSyllabus.chapters.map(item => (
                                        <TableRow key={item.chapter}>
                                          <TableCell className="font-medium">{item.chapter}</TableCell>
                                          <TableCell>{item.name}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                              </div>
                              <Separator />
                              <div className="space-y-4">
                                  <h4 id="english-syllabus" className="font-semibold text-lg">CBSE Class 5 English Syllabus</h4>
                                  <p className="text-muted-foreground">{class5EnglishSyllabus.description}</p>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="w-[150px]">Chapter No.</TableHead>
                                        <TableHead>Literature Syllabus</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {class5EnglishSyllabus.chapters.map(item => (
                                        <TableRow key={item.chapter}>
                                          <TableCell className="font-medium">{item.chapter}</TableCell>
                                          <TableCell>{item.name}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                              </div>
                          </div>
                        )}
                        {activeClass === 'Class 6' && (
                            <div className="space-y-8">
                                <Card className="mb-8">
                                    <CardContent className="p-6">
                                        <h4 className="font-bold text-lg mb-4">Table of Content:</h4>
                                        <ul className="list-disc pl-5 space-y-2">
                                            <li>
                                                <a href="#maths-syllabus-6" className="text-primary hover:underline">CBSE Class 6 Maths Syllabus</a>
                                            </li>
                                            <li>
                                                <a href="#science-syllabus-6" className="text-primary hover:underline">CBSE Class 6 Science Syllabus</a>
                                            </li>
                                            <li>
                                                <a href="#social-science-syllabus-6" className="text-primary hover:underline">CBSE Class 6 Social Science Syllabus</a>
                                            </li>
                                            <li>
                                                <a href="#english-syllabus-6" className="text-primary hover:underline">CBSE Class 6 English Syllabus</a>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>
                                <div className="space-y-4">
                                    <h4 id="maths-syllabus-6" className="font-semibold text-lg">CBSE Class 6 Maths Syllabus 2025-26</h4>
                                    <p className="text-muted-foreground">{class6MathsSyllabus.description}</p>
                                    <Table>
                                        <TableHeader>
                                        <TableRow>
                                            <TableHead>Chapters</TableHead>
                                            <TableHead>Topics</TableHead>
                                        </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                        {class6MathsSyllabus.chapters.map(item => (
                                            <TableRow key={item.chapter}>
                                            <TableCell className="font-medium">{item.chapter}</TableCell>
                                            <TableCell>
                                                <ul className="list-disc pl-5">
                                                    {item.topics.map(topic => <li key={topic}>{topic}</li>)}
                                                </ul>
                                            </TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <Separator />
                                <div className="space-y-4">
                                    <h4 id="science-syllabus-6" className="font-semibold text-lg">CBSE Class 6 Science Syllabus 2025-26</h4>
                                    <p className="text-muted-foreground">{class6ScienceSyllabus.description}</p>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead className="w-[150px]">Chapter Number</TableHead>
                                          <TableHead>Chapter Name</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {class6ScienceSyllabus.chapters.map(item => (
                                          <TableRow key={item.chapter}>
                                            <TableCell className="font-medium">{item.chapter}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                </div>
                                <Separator />
                                <div className="space-y-4">
                                    <h4 id="social-science-syllabus-6" className="font-semibold text-lg">CBSE Class 6 Social Science Syllabus 2025-26</h4>
                                    <p className="text-muted-foreground">{class6SocialScienceSyllabus.description}</p>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Theme</TableHead>
                                                <TableHead>Topics</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {class6SocialScienceSyllabus.themes.map(item => (
                                                <TableRow key={item.theme}>
                                                    <TableCell className="font-medium">{item.theme}</TableCell>
                                                    <TableCell>
                                                        <ul className="list-disc pl-5">
                                                            {item.topics.map(topic => <li key={topic}>{topic}</li>)}
                                                        </ul>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                 <Separator />
                                <div className="space-y-4">
                                    <h4 id="english-syllabus-6" className="font-semibold text-lg">CBSE Class 6 English Syllabus 2025-26</h4>
                                    <p className="text-muted-foreground">{class6EnglishSyllabus.description}</p>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Unit Name</TableHead>
                                                <TableHead>Topics</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {class6EnglishSyllabus.units.map(item => (
                                                <TableRow key={item.name}>
                                                    <TableCell className="font-medium">{item.name}</TableCell>
                                                    <TableCell>
                                                        <ul className="list-disc pl-5">
                                                            {item.topics.map(topic => <li key={topic}>{topic}</li>)}
                                                        </ul>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}
                        {activeClass !== 'Class 5' && activeClass !== 'Class 6' && (
                          <p className="text-muted-foreground">Detailed syllabus and study strategies for {activeClass} will be updated here soon. Our curriculum is designed to cover all topics comprehensively, ensuring you are well-prepared for your exams. We focus on building a strong conceptual foundation and provide ample practice through assignments and tests.</p>
                        )}
                    </div>
                    <Separator />
                    <div>
                        <h3 className="font-bold text-xl mb-2 text-primary border-b pb-2">Exam Pattern & Key Dates</h3>
                        <p className="text-muted-foreground">Information about the exam pattern, marking scheme, and important dates for {activeClass} will be made available here. Stay tuned for updates on registration deadlines, admit card availability, and exam schedules.</p>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="font-bold text-xl mb-4 text-primary border-b pb-2">Essential Resources</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {resourceLinks.map(link => (
                                <Button asChild variant="outline" key={link.href} className="justify-start">
                                    <Link href={link.href}>
                                        {link.icon}
                                        <span className="ml-2">{link.label}</span>
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
          </div>
      </section>

    </div>
  );
}

export default function SchoolPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SchoolPageContent />
    </Suspense>
  );
}
