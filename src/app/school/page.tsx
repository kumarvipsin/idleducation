
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
    { chapter: "Prime Time", topics: ["5.1 Common Multiples and Common Factors", "5.2 Prime Numbers", "5.3 Co-prime numbers for safekeeping treasures", "5.4 Prime Factorisation", "5.6 Fun with numbers"] },
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
  description: "The CBSE Class 6 English syllabus is designed to build a strong foundation in language skills through literature, grammar, and writing. It encourages reading comprehension, creative expression, and vocabulary development. Students explore a variety of prose and poetry to enhance their understanding of the world. Check the table below for a detailed breakdown of the syllabus components and learning objectives.",
  units: [
    { name: "Unit 1 - Fables and Folk Tales", topics: ["A Bottle of Dew", "The Raven and the Fox", "Rama to the Rescue"] },
    { name: "Unit 2 - Friendship", topics: ["The Unlikely Best Friends", "A Friend's Prayer", "The Chair"] },
    { name: "Unit 3 - Nurturing Nature", topics: ["Neem Baba", "What a Bird Thought", "Spices that Heal Us"] },
    { name: "Unit 4 - Sports and Wellness", topics: ["Change of Heart", "The Winner", "Yoga—A Way of Life"] },
    { name: "Unit 5 - Culture and Tradition", topics: ["Hamara Bharat—Incredible India!", "The Kites", "Ila Sachani: Embroidering Dreams with her Feet", "National War Memorial"] },
  ]
};

const class6EnglishGrammarSyllabus = {
  description: "The CBSE Class 6 English Grammar syllabus focuses on strengthening the foundation of language through essential grammar topics. Students learn sentence structure, tenses, punctuation, and parts of speech. This builds their writing and comprehension skills effectively. For a detailed overview of all topics included in the syllabus, check the table below.",
  topics: [
    { grammar: "Noun", applied: "Gap Filling / Sentence Completion", writing: "Formal Letter" },
    { grammar: "Pronoun", applied: "Dialogue Completion", writing: "Informal Letter" },
    { grammar: "Verb", applied: "Sentence Reordering", writing: "Diary Entry" },
    { grammar: "Tense", applied: "Editing", writing: "Notice Writing" },
    { grammar: "Voice", applied: "Omission", writing: "Message Writing" },
    { grammar: "Adjective", applied: "Sentence Transformation", writing: "Debate" },
    { grammar: "Adverb", applied: "—", writing: "Speech" },
    { grammar: "Sentence and Phrase", applied: "—", writing: "Article Writing" },
    { grammar: "Subject-Verb Agreement", applied: "—", writing: "Report Writing" },
    { grammar: "Reported Speech", applied: "—", writing: "Story Completion" },
    { grammar: "Framing Questions", applied: "—", writing: "—" },
    { grammar: "Preposition", applied: "—", writing: "—" },
    { grammar: "Conjunction", applied: "—", writing: "—" },
  ],
};

const class7MathsSyllabus = {
    description: "Here is the detailed CBSE Class 7 Maths Syllabus 2025-26, which covers various important concepts and topics to be studied throughout the academic year. The following table provides a clear breakdown of the chapters and their respective topics.",
    chapters: [
        { chapter: "Large Numbers Around Us", topics: ["A Lakh Varieties, Reading and Writing Numbers, Land of Tens, Of Crores and Crores, Exact and Approximate Values, Patterns in Products, Did You Ever Wonder...?"] },
        { chapter: "Arithmetic Expressions", topics: ["Simple Expressions, Reading and Evaluating Complex Expressions, Brackets in Expressions, Terms in Expressions, Swapping and Grouping, Swapping the Order of Things in Everyday Life, Removing Brackets"] },
        { chapter: "A Peek Beyond the Point", topics: ["The Need for Smaller Units, A Tenth Part, A Hundredth Part, Decimal Place Value, Notation, Writing and Reading of Decimal Numbers, Units of Measurement, Locating and Comparing Decimals, Addition and Subtraction of Decimals, More on the Decimal System"] },
        { chapter: "Expressions Using Letter Numbers", topics: ["The Notion of Letter-Numbers, Revisiting Arithmetic Expressions, Omission of the Multiplication Symbol in Algebraic Expressions, Simplification of Algebraic Expressions, Formula Detective, Algebraic Expressions to Describe Patterns, Patterns in a Calendar, Matchstick Patterns"] },
        { chapter: "Parallel and Intersecting Lines", topics: ["Across the Line, Perpendicular Lines, Between Lines, Parallel and Perpendicular Lines in Paper Folding, Transversals, Corresponding Angles, Alternate Angles, Consecutive Angles, Parallel Illusions"] },
        { chapter: "Number Play", topics: ["Numbers Tell Us Things, Picking Parity, Some Explorations in Grids, 3 × 3 & 4 × 4 Magic Square, Nature's Favourite Sequence: The Virahāṅka Fibonacci Numbers, Digits in Disguise"] },
        { chapter: "A Tale of Three Intersecting Lines", topics: ["Triangles, Equilateral Triangles, Constructing a Triangle When its Sides are Given, Triangle Inequality, Visualizing the Construction of Circles, Construction of Triangles When Some Sides and Angles are Given, Angle Sum Property, Exterior Angles Property, Constructions Related to Altitudes of Triangles, Types of Triangles"] },
        { chapter: "Working with Fractions", topics: ["Multiplication of Fractions, Connection Between the Area of a Rectangle and Fraction Multiplication, Simplifying to Lowest Form, Order of Multiplication, Division of Fractions, Some Problems Involving Fractions"] },
    ]
};

const class7ScienceSyllabus = {
  description: "Here is the detailed CBSE Class 7 Science Syllabus 2025-26, which covers various important scientific concepts and topics to be studied throughout the academic year. The following table outlines the chapters and their respective subtopics:",
  chapters: [
    { chapter: "The Ever-Evolving World of Science", subTopics: "Introduction to Science, Science in Everyday Life" },
    { chapter: "Exploring Substances: Acidic, Basic, and Neutral", subTopics: "Acids and Bases, Indicators, Neutralisation" },
    { chapter: "Electricity: Circuits and their Components", subTopics: "Introduction to Electricity, Symbols of Electric Components, Electrical Conductors and Insulators" },
    { chapter: "The World of Metals and Non-metals", subTopics: "Properties of Materials, Corrosion, Effects of Air and Water" },
    { chapter: "Changes Around Us: Physical and Chemical", subTopics: "Types of Changes, Chemical Change in Everyday Life, Natural Changes" },
    { chapter: "Adolescence: A Stage of Growth and Change", subTopics: "Adolescence, Puberty, Changes During Puberty, Menstruation, Myths and Taboos, Making Adolescence a Joyful Experience" },
    { chapter: "Heat Transfer in Nature", subTopics: "Conduction, Convection, Radiation, Water Cycle, Seepage of Water Beneath Earth" },
    { chapter: "Measurement of Time and Motion", subTopics: "Types of Motion, Time, Measurement of Time & Speed, Relationship Between Time & Speed" },
    { chapter: "Life Processes in Animals", subTopics: "Nutrition, Alimentary Canal, Human Digestive System, Digestion in Animals, Introduction to Respiration, Breathing & Respiration, Mechanism of Breathing, Process of Respiration, Respiration in Animals" },
    { chapter: "Life Processes in Plants", subTopics: "How Do Plants Grow?, Leaves: Food Factories, Photosynthesis, Transportation in Plants, Respiration in Plants" },
    { chapter: "Light: Shadows and Reflections", subTopics: "Introduction to Light, Light Through Different Materials, Shadow Formation, Reflection of Light, Images Formed in a Plane Mirror, Pinhole Camera, Periscope, Kaleidoscope" },
    { chapter: "Earth, Moon, and the Sun", subTopics: "Rotation of the Earth, Revolution of the Earth, Eclipses" },
  ]
};

const class7SocialScienceSyllabus = {
  description: "Here is the CBSE Class 7 Social Science (SST) Syllabus 2025-26. The syllabus includes various chapters and subtopics covering historical, geographical, political, and economic aspects of India and beyond.",
  chapters: [
    { name: "Geographical Diversity of India", subtopics: ["The Himalayas, The Cold Desert - Ladakh and Gangetic Plains, The Great Indian Desert, Aravalli Hills, Peninsular Plateau, India's Coastline and Islands, Sundarban Delta"] },
    { name: "Understanding the Weather", subtopics: ["Weather and Its Elements, Weather Instruments, Weather Stations"] },
    { name: "Climates of India", subtopics: ["Weather, Seasons and Climate, Types of Climate in India, Factors Determining Climate, The Monsoons, Climate and Our Lives, Climate and Disaster, Climate Change"] },
    { name: "New Beginnings: Cities and States", subtopics: ["Janpads and Mahajanpads, Early Democratic Traditions, More Innovations, The Varna-Jati System"] },
    { name: "The Rise of Empires", subtopics: ["What is Empire, Trade Routes and Guilds, The Rise of Magadha, Arrival of Greeks, The Mighty Mauryas"] },
    { name: "The Age of Reorganisation", subtopics: ["Introduction, Surge of the Shungas, The Satvahanas, Coming of Chedi, Invasions of Indo Greeks, Emergence of Kushanas, Kingdom and Life in South - Cholas, Cheras, and Pandayas"] },
    { name: "The Gupta Era: An Age of Tireless Creativity", subtopics: ["Introduction, New Power Emerges, A Traveller's Account, Glimpse of Gupta Empire, Decline of Guptas"] },
    { name: "How Land Became Sacred", subtopics: ["What is Sacredness, Pilgrimages, Sacred Geography and Ecology, Mountains and Forests"] },
    { name: "From Pilgrimage to Trades, Beyond India", subtopics: ["From Pilgrimage to Trades, Beyond India"] },
    { name: "From the Rulers to Ruled: Types of Government", subtopics: ["Government and Its Functions, What Makes Government Different, Democratic Governments Around the World, Forms of Government, Other Forms of Government"] },
    { name: "The Constitution of India", subtopics: ["What is Constitution, Writing of Indian Constitution, What Shaped Indian Constitution, Learning from World, Key Features, Understanding the Preamble"] },
    { name: "From Barter to Money", subtopics: ["Introduction, Why Do We Need Money, The Journey of Money"] },
    { name: "Understanding Markets", subtopics: ["What is Market, Prices and Markets, Market Around Us, Role of Market in People's Lives"] },
  ],
};

const class7EnglishSyllabus = {
  description: "Here is the CBSE Class 7 English Syllabus 2025-26. The syllabus consists of various units and lessons focusing on developing language skills and broadening knowledge through storytelling, poetry, and human values.",
  chapters: [
    { unit: "Learning Together", lessonName: "The Day the River Spoke" },
    { unit: "", lessonName: "Try Again" },
    { unit: "", lessonName: "Three Days to See" },
    { unit: "Wit and Humour", lessonName: "Animals, Birds, and Dr. Dolittle" },
    { unit: "", lessonName: "A Funny Man" },
    { unit: "", lessonName: "Say the Right Thing" },
    { unit: "Dreams and Discoveries", lessonName: "My Brother's Great Invention" },
    { unit: "", lessonName: "Paper Boats" },
    { unit: "", lessonName: "North, South, East, West" },
    { unit: "Travel and Adventure", lessonName: "The Tunnel" },
    { unit: "", lessonName: "Travel" },
    { unit: "", lessonName: "Conquering the Summit" },
    { unit: "Bravehearts", lessonName: "A Homage to Our Brave Soldiers" },
    { unit: "", lessonName: "My Dear Soldiers" },
    { unit: "", lessonName: "Rani Abbakka" },
  ],
};

const class8MathsSyllabus = {
  description: "Here is the CBSE Class 8 Mathematics syllabus for the academic session 2025-26. This syllabus covers a wide range of mathematical concepts, from basic number systems to more advanced topics like algebraic expressions, mensuration, and graphs. It helps students develop problem-solving and analytical skills that are essential for future learning.",
  chapters: [
    { chapter: "Chapter 1", name: "Rational Numbers", topics: ["1.1 Introduction", "1.2 Properties of Rational Numbers", "1.3 Representation of Rational Numbers on the Number Line", "1.4 Rational Numbers between Two Rational Numbers"] },
    { chapter: "Chapter 2", name: "Linear Equations in One Variable", topics: ["2.1 Introduction", "2.2 Solving Equations which have Linear Expressions on one Side and Numbers on the other Side", "2.3 Some Applications", "2.4 Solving Equations having the Variable on both Sides", "2.5 Some More Applications", "2.6 Reducing Equations to Simpler Form", "2.7 Equations Reducible to the Linear Form"] },
    { chapter: "Chapter 3", name: "Understanding Quadrilaterals", topics: ["3.1 Introduction", "3.2 Polygons", "3.3 Sum of the Measures of the Exterior Angles of a Polygon", "3.4 Kinds of Quadrilaterals", "3.5 Some Special Parallelograms"] },
    { chapter: "Chapter 4", name: "Data Handling", topics: ["4.1 Looking for Information", "4.2 Organising Data", "4.3 Grouping Data", "4.4 Circle Graph or Pie Chart", "4.5 Chance and Probability"] },
    { chapter: "Chapter 5", name: "Squares and Square Roots", topics: ["5.1 Introduction", "5.2 Properties of Square Numbers", "5.3 Some More Interesting Patterns", "5.4 Finding the Square of a Number", "5.5 Square Roots", "5.6 Square Roots of Decimals", "5.7 Estimating Square Root"] },
    { chapter: "Chapter 6", name: "Cubes and Cube Roots", topics: ["6.1 Introduction", "6.2 Cubes", "6.3 Cube Roots"] },
    { chapter: "Chapter 7", name: "Comparing Quantities", topics: ["7.1 Recalling Ratios and Percentages", "7.2 Finding the Increase or Decrease Percent", "7.3 Finding Discounts", "7.4 Prices Related to Buying and Selling (Profit and Loss)", "7.5 Sales Tax/Value Added Tax/Goods and Services Tax", "7.6 Compound Interest", "7.7 Deducing a Formula for Compound Interest", "7.8 Rate Compounded Annually or Half Yearly (Semi Annually)", "7.9 Applications of Compound Interest Formula"] },
    { chapter: "Chapter 8", name: "Algebraic Expressions and Identities", topics: ["8.1 What are Expressions?", "8.2 Terms, Factors and Coefficients", "8.3 Monomials, Binomials and Polynomials", "8.4 Like and Unlike Terms", "8.5 Addition and Subtraction of Algebraic Expressions", "8.6 Multiplication of Algebraic Expressions: Introduction", "8.7 Multiplying a Monomial by a Monomial", "8.8 Multiplying a Monomial by a Polynomial", "8.9 Multiplying a Polynomial by a Polynomial", "8.10 What is an Identity?", "8.11 Standard Identities", "8.12 Applying Identities"] },
    { chapter: "Chapter 9", name: "Mensuration", topics: ["9.1 Introduction", "9.2 Let us Recall", "9.3 Area of a Trapezium", "9.4 Area of a General Quadrilateral", "9.5 Area of a Polygon", "9.6 Solid Shapes", "9.7 Surface Area of Cube, Cuboid and Cylinder", "9.8 Volume of Cube, Cuboid and Cylinder", "9.9 Volume and Capacity"] },
    { chapter: "Chapter 10", name: "Exponents and Powers", topics: ["10.1 Introduction", "10.2 Powers with Negative Exponents", "10.3 Laws of Exponents", "10.4 Use of Exponents to Express Small Numbers in Standard Form"] },
    { chapter: "Chapter 11", name: "Direct and Inverse Proportions", topics: ["11.1 Introduction", "11.2 Direct Proportion", "11.3 Inverse Proportion"] },
    { chapter: "Chapter 12", name: "Factorisation", topics: ["12.1 Introduction", "12.2 What is Factorisation?", "12.3 Division of Algebraic Expressions", "12.4 Division of a Monomial by another Monomial", "12.5 Division of a Polynomial by a Monomial", "12.6 Division of a Polynomial by a Polynomial", "12.7 Can you Find the Error?"] },
    { chapter: "Chapter 13", name: "Introduction to Graphs", topics: ["13.1 Introduction", "13.2 A Bar Graph", "13.3 A Pie Graph (or a Circle Graph)", "13.4 A Histogram", "13.5 A Line Graph", "13.6 Linear Graphs", "13.7 Some Applications"] },
  ],
};

const class8ScienceSyllabus = {
  description: "Here is the detailed CBSE Class 8 Science syllabus for the academic session 2025-26. The syllabus covers a variety of important scientific topics, providing students with an in-depth understanding of the natural world and its processes.",
  chapters: [
    { chapter: "Chapter 1", name: "Crop Production and Management", topics: ["1.1 Agricultural Practices", "1.2 Basic Practices of Crop Production", "1.3 Preparation of Soil", "1.4 Sowing", "1.5 Adding Manure and Fertilisers", "1.6 Irrigation", "1.7 Protection from Weeds", "1.8 Harvesting", "1.9 Storage", "1.10 Food from Animals"] },
    { chapter: "Chapter 2", name: "Microorganisms: Friend and Foe", topics: ["2.1 Microorganisms", "2.2 Where do Microorganisms Live?", "2.3 Microorganisms and Us", "2.4 Friendly Microorganisms", "2.5 Harmful Microorganisms", "2.6 Food Preservation", "2.7 Nitrogen Fixation", "2.8 Nitrogen Cycle"] },
    { chapter: "Chapter 3", name: "Coal and Petroleum", topics: ["3.1 Inexhaustible and Exhaustible Natural Resources", "3.2 Coal", "3.3 Petroleum", "3.4 Natural Gas", "3.5 Some Natural Resources are Limited"] },
    { chapter: "Chapter 4", name: "Combustion and Flame", topics: ["4.1 What is Combustion?", "4.2 How Do We Control Fire?", "4.3 Types of Combustion", "4.4 Flame", "4.5 Structure of a Flame", "4.6 What is a Fuel?", "4.7 Fuel Efficiency"] },
    { chapter: "Chapter 5", name: "Conservation of Plants and Animals", topics: ["5.1 Deforestation and Its Causes", "5.2 Consequences of Deforestation", "5.3 Conservation of Forest and Wildlife", "5.4 Biosphere Reserve", "5.5 Flora and Fauna", "5.6 Endemic Species", "5.7 Wildlife Sanctuary", "5.8 National Park", "5.9 Red Data Book", "5.10 Migration", "5.11 Recycling of Paper", "5.12 Reforestation"] },
    { chapter: "Chapter 6", name: "Reproduction in Animals", topics: ["6.1 Modes of Reproduction", "6.2 Sexual Reproduction", "6.3 Asexual Reproduction", "6.4 Cloning"] },
    { chapter: "Chapter 7", name: "Reaching the Age of Adolescence", topics: ["7.1 Adolescence and Puberty", "7.2 Changes at Puberty", "7.3 Secondary Sexual Characters", "7.4 Role of Hormones in Initiating Reproductive Function", "7.5 Reproductive Phase of Life in Humans", "7.6 How is the Sex of the Baby Determined?", "7.7 Hormones other than Sex Hormones", "7.8 Role of Hormones in Completing the Life History of Insects and Frogs", "7.9 Reproductive Health"] },
    { chapter: "Chapter 8", name: "Force and Pressure", topics: ["8.1 Force: A Push or a Pull", "8.2 Forces are due to an Interaction", "8.3 Exploring Forces", "8.4 A Force can Change the State of Motion", "8.5 Force can Change the Shape of an Object", "8.6 Contact Forces", "8.7 Non-contact Forces", "8.8 Pressure", "8.9 Pressure Exerted by Liquids and Gases", "8.10 Atmospheric Pressure"] },
    { chapter: "Chapter 9", name: "Friction", topics: ["9.1 Force of Friction", "9.2 Factors affecting Friction", "9.3 Friction: A Necessary Evil", "9.4 Increasing and Reducing Friction", "9.5 Wheels Reduce Friction", "9.6 Fluid Friction"] },
    { chapter: "Chapter 10", name: "Sound", topics: ["10.1 Sound is Produced by a Vibrating Body", "10.2 Sound Produced by Humans", "10.3 Sound Needs a Medium for Propagation", "10.4 We Hear Sound through Our Ears", "10.5 Amplitude, Time Period and Frequency of a Vibration", "10.6 Audible and Inaudible Sounds", "10.7 Noise and Music", "10.8 Noise Pollution"] },
    { chapter: "Chapter 11", name: "Chemical Effects of Electric Current", topics: ["11.1 Do Liquids Conduct Electricity?", "11.2 Chemical Effects of Electric Current", "11.3 Electroplating"] },
    { chapter: "Chapter 12", name: "Some Natural Phenomena", topics: ["12.1 Lightning", "12.2 Charging by Rubbing", "12.3 Types of Charges and Their Interaction", "12.4 Transfer of Charge", "12.5 The Story of Lightning", "12.6 Lightning Safety", "12.7 Earthquakes"] },
    { chapter: "Chapter 13", name: "Light", topics: ["13.1 What makes Things Visible", "13.2 Laws of Reflection", "13.3 Regular and Diffused Reflection", "13.4 Reflected Light Can be Reflected Again", "13.5 Multiple Images", "13.6 Sunlight – White or Coloured", "13.7 What is inside Our Eyes?", "13.8 Care of the Eyes", "13.9 Visually Impaired Persons Can Read and Write", "13.10 What is the Braille System?"] },
  ]
};

const class8SocialScienceSyllabus = {
  description: "Here is the CBSE Class 8 Social Science syllabus for the academic session 2025-26. The syllabus is divided into three sections: History, Social and Political Life, and Geography. It aims to provide students with a broad understanding of historical events, social structures, political systems, and geographical concepts.",
  history: [
    { chapter: "Chapter 1", name: "Introduction: How, When and Where" },
    { chapter: "Chapter 2", name: "From Trade to Territory: The Company Establishes Power" },
    { chapter: "Chapter 3", name: "Ruling the Countryside" },
    { chapter: "Chapter 4", name: "Tribals, Dikus, and the Vision of a Golden Age" },
    { chapter: "Chapter 5", name: "When People Rebel 1857 and After" },
    { chapter: "Chapter 6", name: "Civilising the “Native”, Educating the Nation" },
    { chapter: "Chapter 7", name: "Women, Caste and Reform" },
    { chapter: "Chapter 8", name: "The Making of the National Movement: 1870s–1947" },
  ],
  socialAndPoliticalLife: [
    { chapter: "Chapter 1", name: "The Indian Constitution" },
    { chapter: "Chapter 2", name: "Understanding Secularism" },
    { chapter: "Chapter 3", name: "Parliament and the Making of Laws" },
    { chapter: "Chapter 4", name: "Judiciary" },
    { chapter: "Chapter 5", name: "Understanding Marginalisation" },
    { chapter: "Chapter 6", name: "Confronting Marginalisation" },
    { chapter: "Chapter 7", name: "Public Facilities" },
    { chapter: "Chapter 8", name: "Law and Social Justice" },
  ],
  geography: [
    { chapter: "Chapter 1", name: "Resources" },
    { chapter: "Chapter 2", name: "Land, Soil, Water, Natural Vegetation and Wildlife Resources" },
    { chapter: "Chapter 3", name: "Agriculture" },
    { chapter: "Chapter 4", name: "Industries" },
    { chapter: "Chapter 5", name: "Human Resources" },
  ]
};

const class8EnglishSyllabus = {
  description: "Here’s the breakdown of the CBSE Class 8 English Syllabus for both Honeydew and Its So Happened books. The chapters are designed to enhance students’ reading, writing, and analytical skills through engaging prose and poetry.",
  honeydew: [
    { chapter: "Chapter 1", prose: "The Best Christmas Present in the World", poem: "The Ant and the Cricket" },
    { chapter: "Chapter 2", prose: "The Tsunami", poem: "Geography Lesson" },
    { chapter: "Chapter 3", prose: "Glimpses of the Past", poem: "" },
    { chapter: "Chapter 4", prose: "Bepin Choudhury’s Lapse of Memory", poem: "The Last Bargain" },
    { chapter: "Chapter 5", prose: "The Summit Within", poem: "The School Boy" },
    { chapter: "Chapter 6", prose: "This is Jody’s Fawn", poem: "" },
    { chapter: "Chapter 7", prose: "A Visit to Cambridge", poem: "" },
    { chapter: "Chapter 8", prose: "A Short Monsoon Diary", poem: "On the Grasshopper and Cricket" },
  ],
  itSoHappened: [
    { chapter: "Chapter 1", name: "How the Camel Got His Hump" },
    { chapter: "Chapter 2", name: "Children at Work" },
    { chapter: "Chapter 3", name: "The Selfish Giant" },
    { chapter: "Chapter 4", name: "The Treasure Within" },
    { chapter: "Chapter 5", name: "Princess September" },
    { chapter: "Chapter 6", name: "The Fight" },
    { chapter: "Chapter 7", name: "Jalebis" },
  ]
};

const syllabusData: any = {
    'Class 9': {
      maths: {
        description: "The CBSE Class 9 Maths syllabus lays the groundwork for higher mathematics. It covers number systems, algebra, geometry, and statistics.",
        chapters: [
          { name: "Number Systems", topics: ["1.1 Introduction", "1.2 Irrational Numbers", "1.3 Real Numbers and their Decimal Expansions", "1.4 Representing Real Numbers on the Number Line", "1.5 Operations on Real Numbers", "1.6 Laws of Exponents for Real Numbers"] },
          { name: "Polynomials", topics: ["2.1 Introduction", "2.2 Polynomials in One Variable", "2.3 Zeros of a Polynomial", "2.4 Remainder Theorem", "2.5 Factorisation of Polynomials", "2.6 Algebraic Identities"] },
        ],
      },
      science: {
        description: "Class 9 Science introduces fundamental concepts in Physics, Chemistry, and Biology, building a base for future studies.",
        chapters: [
          { name: "Matter in Our Surroundings", topics: [] },
          { name: "Atoms and Molecules", topics: [] },
        ],
      },
      social: {
        description: "The Social Science syllabus for Class 9 covers History, Geography, Political Science, and Economics.",
        chapters: [
          { name: "The French Revolution", topics: [] },
          { name: "India - Size and Location", topics: [] },
        ],
      },
      english: {
        description: "The English syllabus for Class 9 aims to develop strong communication skills through literature and grammar.",
        chapters: [
          { name: "The Fun They Had", topics: [] },
          { name: "The Road Not Taken", topics: [] },
        ],
      },
    },
    'Class 10': {
       maths: {
        description: "The CBSE Class 10 Maths syllabus is crucial for board examinations, focusing on algebra, geometry, trigonometry, and statistics.",
        chapters: [
          { name: "Real Numbers", topics: [] },
          { name: "Polynomials", topics: [] },
        ],
      },
      science: {
        description: "Class 10 Science covers key topics in Physics, Chemistry, and Biology to prepare students for their board exams.",
        chapters: [
          { name: "Chemical Reactions and Equations", topics: [] },
          { name: "Life Processes", topics: [] },
        ],
      },
       social: {
        description: "The Social Science syllabus for Class 10 is designed to give students a comprehensive understanding of historical and contemporary India and the world.",
        chapters: [
          { name: "The Rise of Nationalism in Europe", topics: [] },
          { name: "Resources and Development", topics: [] },
        ],
      },
      english: {
        description: "The English syllabus for Class 10 focuses on enhancing literary comprehension and writing skills for the board exams.",
        chapters: [
          { name: "A Letter to God", topics: [] },
          { name: "Dust of Snow", topics: [] },
        ],
      },
    },
     'Class 11': {
       maths: {
        description: "The CBSE Class 11 Maths syllabus introduces advanced topics like sets, relations, functions, and calculus.",
        chapters: [
          { name: "Sets", topics: [] },
          { name: "Trigonometric Functions", topics: [] },
        ],
      },
      science: {
        description: "Class 11 Science is divided into Physics, Chemistry, and Biology, each with a detailed and advanced curriculum.",
        chapters: [
          { name: "Units and Measurements (Physics)", topics: [] },
          { name: "Some Basic Concepts of Chemistry (Chemistry)", topics: [] },
          { name: "The Living World (Biology)", topics: [] },
        ],
      },
       social: {
        description: "The Social Science stream in Class 11 includes subjects like History, Geography, Political Science, and Economics.",
        chapters: [
          { name: "The Central Islamic Lands (History)", topics: [] },
          { name: "India - Location (Geography)", topics: [] },
        ],
      },
       english: {
        description: "The English syllabus for Class 11 focuses on advanced literature, comprehension, and writing skills.",
        chapters: [
          { name: "The Portrait of a Lady", topics: [] },
          { name: "A Photograph", topics: [] },
        ],
      },
    },
     'Class 12': {
       maths: {
        description: "The CBSE Class 12 Maths syllabus is designed for the final board examination, covering topics like calculus, vectors, and probability.",
        chapters: [
          { name: "Relations and Functions", topics: [] },
          { name: "Matrices", topics: [] },
        ],
      },
      science: {
        description: "Class 12 Science includes in-depth study of Physics, Chemistry, and Biology, preparing students for competitive exams.",
        chapters: [
          { name: "Electric Charges and Fields (Physics)", topics: [] },
          { name: "The Solid State (Chemistry)", topics: [] },
          { name: "Reproduction in Organisms (Biology)", topics: [] },
        ],
      },
       social: {
        description: "The Social Science stream in Class 12 covers advanced topics in History, Geography, Political Science, and Economics.",
        chapters: [
          { name: "Bricks, Beads and Bones (History)", topics: [] },
          { name: "Human Geography: Nature and Scope (Geography)", topics: [] },
        ],
      },
       english: {
        description: "The English syllabus for Class 12 is aimed at mastering literary analysis and advanced writing skills for the board exams.",
        chapters: [
          { name: "The Last Lesson", topics: [] },
          { name: "My Mother at Sixty-Six", topics: [] },
        ],
      },
    }
};


function SchoolPageContent() {
  const searchParams = useSearchParams();
  const classParam = searchParams.get('class');
  const [activeClass, setActiveClass] = useState('Class 8');
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
        avatar: "https://picsum.photos/seed/prof1/400/500",
        avatarHint: "male professional"
    },
    {
        name: t('team.member2.name'),
        designation: t('team.member2.designation'),
        experience: t('team.member2.experience'),
        avatar: "https://picsum.photos/seed/prof2/400/500",
        avatarHint: "male teacher"
    },
    {
        name: t('team.member4.name'),
        designation: t('team.member4.designation'),
        experience: t('team.member4.experience'),
        avatar: "https://picsum.photos/seed/prof3/400/500",
        avatarHint: "female teacher"
    },
    {
        name: t('team.member3.name'),
        designation: t('team.member3.designation'),
        experience: t('team.member3.experience'),
        avatar: "https://picsum.photos/seed/prof4/400/500",
        avatarHint: "male professional"
    },
    {
        name: t('team.member1.name'),
        designation: t('team.member1.designation'),
        experience: t('team.member1.experience'),
        avatar: "https://picsum.photos/seed/prof5/400/500",
        avatarHint: "male teacher"
    },
    {
        name: t('team.member6.name'),
        designation: t('team.member6.designation'),
        experience: t('team.member6.experience'),
        avatar: "https://picsum.photos/seed/prof6/400/500",
        avatarHint: "male teacher"
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
            <div className="px-4 md:px-[10%]">
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
                    <CarouselItem key={index} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
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
                                            <li>
                                                <a href="#english-grammar-syllabus-6" className="text-primary hover:underline">CBSE Class 6 English Grammar Syllabus</a>
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
                                <Separator />
                                <div className="space-y-4">
                                    <h4 id="english-grammar-syllabus-6" className="font-semibold text-lg">CBSE Class 6 English Grammar Syllabus 2025-26</h4>
                                    <p className="text-muted-foreground">{class6EnglishGrammarSyllabus.description}</p>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Grammar Topics</TableHead>
                                                <TableHead>Applied Grammar</TableHead>
                                                <TableHead>Writing Section</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {class6EnglishGrammarSyllabus.topics.map(item => (
                                                <TableRow key={item.grammar}>
                                                    <TableCell>{item.grammar}</TableCell>
                                                    <TableCell>{item.applied}</TableCell>
                                                    <TableCell>{item.writing}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}
                        {activeClass === 'Class 7' && (
                            <div className="space-y-8">
                                <Card className="mb-8">
                                    <CardContent className="p-6">
                                        <h4 className="font-bold text-lg mb-4">Table of Content:</h4>
                                        <ul className="list-disc pl-5 space-y-2">
                                            <li><a href="#maths-syllabus-7" className="text-primary hover:underline">CBSE Class 7 Maths Syllabus</a></li>
                                            <li><a href="#science-syllabus-7" className="text-primary hover:underline">CBSE Class 7 Science Syllabus</a></li>
                                            <li><a href="#social-science-syllabus-7" className="text-primary hover:underline">CBSE Class 7 Social Science Syllabus</a></li>
                                            <li><a href="#english-syllabus-7" className="text-primary hover:underline">CBSE Class 7 English Syllabus</a></li>
                                        </ul>
                                    </CardContent>
                                </Card>
                                <div className="space-y-4">
                                    <h4 id="maths-syllabus-7" className="font-semibold text-lg">CBSE Class 7 Maths Syllabus 2025-26</h4>
                                    <p className="text-muted-foreground">{class7MathsSyllabus.description}</p>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Chapter</TableHead>
                                                <TableHead>Topics</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {class7MathsSyllabus.chapters.map(item => (
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
                                  <h4 id="science-syllabus-7" className="font-semibold text-lg">CBSE Class 7 Science Syllabus</h4>
                                  <p className="text-muted-foreground">{class7ScienceSyllabus.description}</p>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Chapter</TableHead>
                                        <TableHead>Sub Topics</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {class7ScienceSyllabus.chapters.map(item => (
                                        <TableRow key={item.chapter}>
                                          <TableCell className="font-medium">{item.chapter}</TableCell>
                                          <TableCell>{item.subTopics}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                                <Separator />
                                <div className="space-y-4">
                                    <h4 id="social-science-syllabus-7" className="font-semibold text-lg">CBSE Class 7 Social Science Syllabus</h4>
                                    <p className="text-muted-foreground">{class7SocialScienceSyllabus.description}</p>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Chapter Name</TableHead>
                                          <TableHead>Subtopics</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {class7SocialScienceSyllabus.chapters.map(item => (
                                          <TableRow key={item.name}>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell>
                                              <ul className="list-disc pl-5">
                                                {item.subtopics.map(subtopic => <li key={subtopic}>{subtopic}</li>)}
                                              </ul>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                </div>
                                <Separator />
                                <div className="space-y-4">
                                    <h4 id="english-syllabus-7" className="font-semibold text-lg">CBSE Class 7 English Syllabus</h4>
                                    <p className="text-muted-foreground">{class7EnglishSyllabus.description}</p>
                                     <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Unit</TableHead>
                                          <TableHead>Lesson Name</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {class7EnglishSyllabus.chapters.map((item, index) => (
                                          <TableRow key={index}>
                                            <TableCell className="font-medium">{item.unit}</TableCell>
                                            <TableCell>{item.lessonName}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}
                        {activeClass === 'Class 8' && (
                          <div className="space-y-8">
                            <Card className="mb-8">
                                <CardContent className="p-6">
                                    <h4 className="font-bold text-lg mb-4">Table of Content:</h4>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><a href="#maths-syllabus-8" className="text-primary hover:underline">CBSE Class 8 Maths Syllabus</a></li>
                                        <li><a href="#science-syllabus-8" className="text-primary hover:underline">CBSE Class 8 Science Syllabus</a></li>
                                        <li><a href="#social-science-syllabus-8" className="text-primary hover:underline">CBSE Class 8 Social Science Syllabus</a></li>
                                        <li><a href="#english-syllabus-8" className="text-primary hover:underline">CBSE Class 8 English Syllabus</a></li>
                                    </ul>
                                </CardContent>
                            </Card>
                            <div className="space-y-4">
                                <h4 id="maths-syllabus-8" className="font-semibold text-lg">CBSE Class 8 Maths Syllabus 2025-26</h4>
                                <p className="text-muted-foreground">{class8MathsSyllabus.description}</p>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[150px]">Chapter No.</TableHead>
                                            <TableHead>Chapter Name</TableHead>
                                            <TableHead>Topics</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {class8MathsSyllabus.chapters.map(item => (
                                            <TableRow key={item.chapter}>
                                                <TableCell className="font-medium">{item.chapter}</TableCell>
                                                <TableCell>{item.name}</TableCell>
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
                                <h4 id="science-syllabus-8" className="font-semibold text-lg">CBSE Class 8 Science Syllabus 2025-26</h4>
                                <p className="text-muted-foreground">{class8ScienceSyllabus.description}</p>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[150px]">Chapter No.</TableHead>
                                            <TableHead>Chapter Name</TableHead>
                                            <TableHead>Topics</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {class8ScienceSyllabus.chapters.map(item => (
                                            <TableRow key={item.chapter}>
                                                <TableCell className="font-medium">{item.chapter}</TableCell>
                                                <TableCell>{item.name}</TableCell>
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
                                <h4 id="social-science-syllabus-8" className="font-semibold text-lg">CBSE Class 8 Social Science Syllabus 2025-26</h4>
                                <p className="text-muted-foreground">{class8SocialScienceSyllabus.description}</p>
                                <div className='space-y-4'>
                                    <h5 className='font-semibold'>CBSE Class 8th History Syllabus</h5>
                                    <Table>
                                        <TableHeader>
                                            <TableRow><TableHead className="w-[150px]">Chapter No.</TableHead><TableHead>Unit</TableHead></TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {class8SocialScienceSyllabus.history.map(item => (<TableRow key={item.chapter}><TableCell className="font-medium">{item.chapter}</TableCell><TableCell>{item.name}</TableCell></TableRow>))}
                                        </TableBody>
                                    </Table>
                                    <h5 className='font-semibold'>CBSE Class 8th Social and Political Life Syllabus</h5>
                                    <Table>
                                        <TableHeader>
                                            <TableRow><TableHead className="w-[150px]">Chapter No.</TableHead><TableHead>Unit</TableHead></TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {class8SocialScienceSyllabus.socialAndPoliticalLife.map(item => (<TableRow key={item.chapter}><TableCell className="font-medium">{item.chapter}</TableCell><TableCell>{item.name}</TableCell></TableRow>))}
                                        </TableBody>
                                    </Table>
                                    <h5 className='font-semibold'>CBSE Class 8th Geography Syllabus</h5>
                                    <Table>
                                        <TableHeader>
                                            <TableRow><TableHead className="w-[150px]">Chapter No.</TableHead><TableHead>Unit</TableHead></TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {class8SocialScienceSyllabus.geography.map(item => (<TableRow key={item.chapter}><TableCell className="font-medium">{item.chapter}</TableCell><TableCell>{item.name}</TableCell></TableRow>))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-4">
                                <h4 id="english-syllabus-8" className="font-semibold text-lg">CBSE Class 8 English Syllabus 2025-26</h4>
                                <p className="text-muted-foreground">{class8EnglishSyllabus.description}</p>
                                <h5 className='font-semibold'>Honeydew (Prose and Poems)</h5>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Chapter No.</TableHead>
                                            <TableHead>Prose</TableHead>
                                            <TableHead>Poem</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {class8EnglishSyllabus.honeydew.map(item => (
                                            <TableRow key={item.chapter}>
                                                <TableCell>{item.chapter}</TableCell>
                                                <TableCell>{item.prose}</TableCell>
                                                <TableCell>{item.poem}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <h5 className='font-semibold'>Its So Happened (Stories)</h5>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Chapter No.</TableHead>
                                            <TableHead>Chapter Name</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {class8EnglishSyllabus.itSoHappened.map(item => (
                                            <TableRow key={item.chapter}>
                                                <TableCell>{item.chapter}</TableCell>
                                                <TableCell>{item.name}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                          </div>
                        )}
                        {['Class 9', 'Class 10', 'Class 11', 'Class 12'].includes(activeClass) && (
                            <Tabs defaultValue="maths" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="maths">Maths</TabsTrigger>
                                    <TabsTrigger value="science">Science</TabsTrigger>
                                    <TabsTrigger value="social">Social Science</TabsTrigger>
                                    <TabsTrigger value="english">English</TabsTrigger>
                                </TabsList>
                                <TabsContent value="maths" className="pt-4">
                                    <p className="text-muted-foreground">{syllabusData[activeClass].maths.description}</p>
                                    <Table>
                                        <TableHeader>
                                            <TableRow><TableHead>Chapter</TableHead><TableHead>Topics</TableHead></TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {syllabusData[activeClass].maths.chapters.map((item: any) => (
                                                <TableRow key={item.name}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell>
                                                        {item.topics.length > 0 ? (
                                                            <ul className="list-disc pl-5">
                                                                {item.topics.map((topic: string) => <li key={topic}>{topic}</li>)}
                                                            </ul>
                                                        ) : 'Topics will be updated soon.'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TabsContent>
                                <TabsContent value="science" className="pt-4">
                                    <p className="text-muted-foreground">{syllabusData[activeClass].science.description}</p>
                                     <Table>
                                        <TableHeader>
                                            <TableRow><TableHead>Chapter</TableHead><TableHead>Topics</TableHead></TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {syllabusData[activeClass].science.chapters.map((item: any) => (
                                                <TableRow key={item.name}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell>
                                                        {item.topics.length > 0 ? (
                                                            <ul className="list-disc pl-5">
                                                                {item.topics.map((topic: string) => <li key={topic}>{topic}</li>)}
                                                            </ul>
                                                        ) : 'Topics will be updated soon.'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TabsContent>
                                <TabsContent value="social" className="pt-4">
                                    <p className="text-muted-foreground">{syllabusData[activeClass].social.description}</p>
                                     <Table>
                                        <TableHeader>
                                            <TableRow><TableHead>Chapter</TableHead><TableHead>Topics</TableHead></TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {syllabusData[activeClass].social.chapters.map((item: any) => (
                                                <TableRow key={item.name}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell>
                                                        {item.topics.length > 0 ? (
                                                            <ul className="list-disc pl-5">
                                                                {item.topics.map((topic: string) => <li key={topic}>{topic}</li>)}
                                                            </ul>
                                                        ) : 'Topics will be updated soon.'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TabsContent>
                                 <TabsContent value="english" className="pt-4">
                                    <p className="text-muted-foreground">{syllabusData[activeClass].english.description}</p>
                                     <Table>
                                        <TableHeader>
                                            <TableRow><TableHead>Chapter</TableHead><TableHead>Topics</TableHead></TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {syllabusData[activeClass].english.chapters.map((item: any) => (
                                                <TableRow key={item.name}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell>
                                                        {item.topics.length > 0 ? (
                                                            <ul className="list-disc pl-5">
                                                                {item.topics.map((topic: string) => <li key={topic}>{topic}</li>)}
                                                            </ul>
                                                        ) : 'Topics will be updated soon.'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TabsContent>
                            </Tabs>
                        )}
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

    