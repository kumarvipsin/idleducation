
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, BookOpen, PanelLeft, Sigma, TestTube2, Landmark, BookText as EnglishIcon, Atom, Dna, FlaskConical } from 'lucide-react';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

type Paper = {
  subject: string;
  year: number;
  title: string;
  href: string;
};

const papersByExam: { [key: string]: Paper[] } = {
  'CUET': [
    { subject: 'General Test', year: 2023, title: 'Mock Paper 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  ],
  'CBSE Class 10': [
    // 2025
    { subject: 'Science', year: 2025, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Science', year: 2025, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Science', year: 2025, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Science', year: 2025, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Science', year: 2025, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Science', year: 2025, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Standard)', year: 2025, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Standard)', year: 2025, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Standard)', year: 2025, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Standard)', year: 2025, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Standard)', year: 2025, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Standard)', year: 2025, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Basic)', year: 2025, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Basic)', year: 2025, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Basic)', year: 2025, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Basic)', year: 2025, title: 'Compartment Set 1', href: 'https://drive.google.com/file/d/1XOXoV6ctaRjQRmpWlAHRkGDhzDW-PIhv/view?usp=sharing' },
    { subject: 'Maths (Basic)', year: 2025, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Basic)', year: 2025, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Social Studies', year: 2025, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Social Studies', year: 2025, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Social Studies', year: 2025, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Social Studies', year: 2025, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Social Studies', year: 2025, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Social Studies', year: 2025, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2025, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2025, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2025, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2025, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2025, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2025, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    
    // 2024
    { subject: 'Science', year: 2024, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Science', year: 2024, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Science', year: 2024, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Science', year: 2024, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Science', year: 2024, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Science', year: 2024, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Standard)', year: 2024, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Standard)', year: 2024, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Standard)', year: 2024, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Standard)', year: 2024, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Standard)', year: 2024, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Standard)', year: 2024, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Basic)', year: 2024, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Basic)', year: 2024, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Basic)', year: 2024, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Basic)', year: 2024, title: 'Compartment Set 1', href: 'https://drive.google.com/file/d/1XOXoV6ctaRjQRmpWlAHRkGDhzDW-PIhv/view?usp=sharing' },
    { subject: 'Maths (Basic)', year: 2024, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Basic)', year: 2024, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Social Studies', year: 2024, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Social Studies', year: 2024, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Social Studies', year: 2024, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Social Studies', year: 2024, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Social Studies', year: 2024, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Social Studies', year: 2024, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2024, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2024, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2024, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2024, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2024, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2024, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },

    // 2023
    { subject: 'Science', year: 2023, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Science', year: 2023, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Science', year: 2023, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Science', year: 2023, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Science', year: 2023, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Science', year: 2023, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Standard)', year: 2023, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Standard)', year: 2023, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Standard)', year: 2023, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Standard)', year: 2023, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Standard)', year: 2023, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Standard)', year: 2023, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Basic)', year: 2023, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Basic)', year: 2023, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Basic)', year: 2023, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Basic)', year: 2023, title: 'Compartment Set 1', href: 'https://drive.google.com/file/d/1XOXoV6ctaRjQRmpWlAHRkGDhzDW-PIhv/view?usp=sharing' },
    { subject: 'Maths (Basic)', year: 2023, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Basic)', year: 2023, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Social Studies', year: 2023, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Social Studies', year: 2023, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Social Studies', year: 2023, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Social Studies', year: 2023, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Social Studies', year: 2023, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Social Studies', year: 2023, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2023, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2023, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2023, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2023, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2023, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2023, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },

    // 2022
    { subject: 'Science', year: 2022, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Science', year: 2022, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Science', year: 2022, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Science', year: 2022, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Science', year: 2022, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Science', year: 2022, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Standard)', year: 2022, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Standard)', year: 2022, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Standard)', year: 2022, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Standard)', year: 2022, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Standard)', year: 2022, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Standard)', year: 2022, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Basic)', year: 2022, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Basic)', year: 2022, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Basic)', year: 2022, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Basic)', year: 2022, title: 'Compartment Set 1', href: 'https://drive.google.com/file/d/1XOXoV6ctaRjQRmpWlAHRkGDhzDW-PIhv/view?usp=sharing' },
    { subject: 'Maths (Basic)', year: 2022, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Basic)', year: 2022, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Social Studies', year: 2022, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Social Studies', year: 2022, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Social Studies', year: 2022, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Social Studies', year: 2022, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Social Studies', year: 2022, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Social Studies', year: 2022, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2022, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2022, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2022, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2022, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2022, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2022, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  ],
  'CBSE Class 12': [
    // 2025
    { subject: 'Physics', year: 2025, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Physics', year: 2025, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Physics', year: 2025, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Physics', year: 2025, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Physics', year: 2025, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Physics', year: 2025, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Chemistry', year: 2025, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Chemistry', year: 2025, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Chemistry', year: 2025, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Chemistry', year: 2025, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Chemistry', year: 2025, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Chemistry', year: 2025, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths', year: 2025, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths', year: 2025, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths', year: 2025, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths', year: 2025, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths', year: 2025, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths', year: 2025, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Biology', year: 2025, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Biology', year: 2025, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Biology', year: 2025, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Biology', year: 2025, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Biology', year: 2025, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Biology', year: 2025, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2025, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2025, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2025, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2025, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2025, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2025, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    
    // 2024
    { subject: 'Physics', year: 2024, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Physics', year: 2024, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Physics', year: 2024, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Physics', year: 2024, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Physics', year: 2024, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Physics', year: 2024, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Chemistry', year: 2024, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Chemistry', year: 2024, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Chemistry', year: 2024, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Chemistry', year: 2024, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Chemistry', year: 2024, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Chemistry', year: 2024, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths', year: 2024, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths', year: 2024, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths', year: 2024, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths', year: 2024, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths', year: 2024, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths', year: 2024, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Biology', year: 2024, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Biology', year: 2024, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Biology', year: 2024, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Biology', year: 2024, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Biology', year: 2024, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Biology', year: 2024, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2024, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2024, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2024, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2024, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2024, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2024, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },

    // 2023
    { subject: 'Physics', year: 2023, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Physics', year: 2023, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Physics', year: 2023, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Physics', year: 2023, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Physics', year: 2023, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Physics', year: 2023, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Chemistry', year: 2023, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Chemistry', year: 2023, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Chemistry', year: 2023, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Chemistry', year: 2023, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Chemistry', year: 2023, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Chemistry', year: 2023, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths', year: 2023, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths', year: 2023, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths', year: 2023, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths', year: 2023, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths', year: 2023, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths', year: 2023, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Biology', year: 2023, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Biology', year: 2023, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Biology', year: 2023, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Biology', year: 2023, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Biology', year: 2023, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Biology', year: 2023, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2023, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2023, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2023, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2023, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2023, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2023, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },

    // 2022
    { subject: 'Physics', year: 2022, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Physics', year: 2022, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Physics', year: 2022, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Physics', year: 2022, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Physics', year: 2022, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Physics', year: 2022, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Chemistry', year: 2022, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Chemistry', year: 2022, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Chemistry', year: 2022, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Chemistry', year: 2022, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Chemistry', year: 2022, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Chemistry', year: 2022, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths', year: 2022, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths', year: 2022, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths', year: 2022, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths', year: 2022, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths', year: 2022, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths', year: 2022, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Biology', year: 2022, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Biology', year: 2022, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Biology', year: 2022, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Biology', year: 2022, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Biology', year: 2022, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Biology', year: 2022, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2022, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2022, title: 'Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2022, title: 'Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2022, title: 'Compartment Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2022, title: 'Compartment Set 2', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2022, title: 'Compartment Set 3', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  ],
  'NIOS Class 10': [
    { subject: 'Science', year: 2025, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Standard)', year: 2025, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths (Basic)', year: 2025, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Social Studies', year: 2025, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2025, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  ],
  'NIOS Class 12': [
    { subject: 'Physics', year: 2025, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Chemistry', year: 2025, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Maths', year: 2025, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'Biology', year: 2025, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { subject: 'English', year: 2025, title: 'Set 1', href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  ],
  'JEE': [],
  'NEET': [],
  'CLAT': [],
  'GATE': [],
  'SSC': [],
  'DELHI POLICE': [],
};

const examCategories = [
  'CBSE Class 10',
  'CBSE Class 12',
  'NIOS Class 10',
  'NIOS Class 12',
  'JEE',
  'NEET',
  'CLAT',
  'GATE',
  'SSC',
  'DELHI POLICE'
];

type GroupedPapersByYear = {
  [year: number]: Paper[];
};

const subjectIcons: { [key: string]: React.ReactNode } = {
  'Science': <TestTube2 className="w-5 h-5 mr-3 shrink-0" />,
  'Maths (Standard)': <Sigma className="w-5 h-5 mr-3 shrink-0" />,
  'Maths (Basic)': <Sigma className="w-5 h-5 mr-3 shrink-0" />,
  'Maths': <Sigma className="w-5 h-5 mr-3 shrink-0" />,
  'Social Studies': <Landmark className="w-5 h-5 mr-3 shrink-0" />,
  'English': <EnglishIcon className="w-5 h-5 mr-3 shrink-0" />,
  'Physics': <Atom className="w-5 h-5 mr-3 shrink-0" />,
  'Chemistry': <FlaskConical className="w-5 h-5 mr-3 shrink-0" />,
  'Biology': <Dna className="w-5 h-5 mr-3 shrink-0" />,
  'General Test': <BookOpen className="w-5 h-5 mr-3 shrink-0" />,
};

export default function PreviousYearQuestionsPage() {
  const [selectedExam, setSelectedExam] = useState('CBSE Class 10');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  
  const subjects = Array.from(new Set(papersByExam[selectedExam]?.map(p => p.subject))).sort();
  
  // Set the first subject as default when the exam changes
  if (selectedSubject === '' || !subjects.includes(selectedSubject)) {
      if(subjects.length > 0) setSelectedSubject(subjects[0]);
  }

  const papersGrouped: GroupedPapersByYear = papersByExam[selectedExam]
    ?.filter(p => p.subject === selectedSubject)
    .reduce((acc, paper) => {
        const { year } = paper;
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(paper);
        acc[year].sort((a, b) => a.title.localeCompare(b.title));
        return acc;
    }, {} as GroupedPapersByYear);

  const sortedYears = papersGrouped ? Object.keys(papersGrouped).map(Number).sort((a, b) => b - a) : [];

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Previous Year Question Papers</h1>
        <p className="text-muted-foreground">Practice with past exam papers for {selectedExam} to familiarize yourself with the format and question types.</p>
      </div>
      
      <div className="bg-muted/50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-center overflow-x-auto space-x-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {examCategories.map((examName) => (
            <button
              key={examName}
              onClick={() => { setSelectedExam(examName); setSelectedSubject(''); }}
              className={`py-2 px-4 whitespace-nowrap text-sm font-medium transition-colors border
                ${selectedExam === examName 
                  ? 'border-primary text-primary bg-primary/10 rounded-md' 
                  : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-md'}`}
            >
              {examName}
            </button>
          ))}
        </div>
      </div>
      
      <div className="bg-muted/50 rounded-lg p-4 mb-8">
        <div className="flex items-center overflow-x-auto space-x-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`py-2 px-4 whitespace-nowrap text-sm font-medium transition-colors border
                ${selectedSubject === subject 
                  ? 'border-primary text-primary bg-primary/10 rounded-md' 
                  : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-md'}`}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1">
          <div className="flex-1">
              {selectedSubject && papersGrouped ? (
                  <Card key={selectedSubject} className="shadow-lg animate-fade-in-up bg-background">
                      <CardHeader className="p-4 border-b border-primary/10">
                          <CardTitle className="text-lg font-semibold text-primary flex items-center gap-2">
                            {subjectIcons[selectedSubject]}
                            {`Available Papers for ${selectedSubject}`}
                          </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <Accordion type="multiple" defaultValue={sortedYears.slice(0, 1).map(String)} className="w-full">
                           {sortedYears.map(year => (
                                <AccordionItem value={String(year)} key={year}>
                                    <AccordionTrigger className="text-lg font-semibold">
                                        Year {year}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="divide-y">
                                            {papersGrouped[year].map((paper, index) => (
                                                <div key={index} className="flex items-center justify-between py-3">
                                                    <div>
                                                        <p className="font-medium">{paper.title}</p>
                                                    </div>
                                                    <Button asChild size="sm">
                                                        <Link href={paper.href} target="_blank" rel="noopener noreferrer">
                                                            <Download className="mr-2 h-4 w-4" />
                                                            Download
                                                        </Link>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                           ))}
                        </Accordion>
                      </CardContent>
                  </Card>
              ) : (
                  <div className="col-span-full text-center py-12 animate-fade-in-up">
                      <Card className="p-8 inline-block">
                          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground font-semibold">Select a subject</p>
                          <p className="text-sm text-muted-foreground">Choose a subject from the left to see available papers.</p>
                      </Card>
                  </div>
              )}
          </div>
      </main>
    </div>
  );
}
