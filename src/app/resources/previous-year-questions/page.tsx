
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, BookOpen, PanelLeft, Sigma, TestTube2, Landmark, BookText as EnglishIcon, Atom, Dna, FlaskConical } from 'lucide-react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

type Paper = {
  subject: string;
  year: number;
  title: string;
  href: string;
};

const papersByExam: { [key: string]: Paper[] } = {
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
};

const examCategories = Object.keys(papersByExam);

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
};

const SubjectSidebarContent = ({ subjects, selectedSubject, onSelectSubject, onDone }: {
    subjects: string[];
    selectedSubject: string;
    onSelectSubject: (subject: string) => void;
    onDone?: () => void;
}) => (
    <Card className="sticky top-24 shadow-none border-0 p-4 bg-background">
        <CardHeader className="p-0 mb-4">
            <CardTitle className="text-lg text-foreground">Subjects</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            <div className="flex flex-col space-y-2">
                 {subjects.map(subject => (
                    <Button 
                        key={subject}
                        variant="ghost"
                        onClick={() => {
                            onSelectSubject(subject);
                            onDone?.();
                        }}
                        className={cn("justify-start h-auto py-2.5 px-4 text-left rounded-lg transition-all duration-200", 
                            selectedSubject === subject 
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground font-semibold shadow-md"
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                    >
                        {subjectIcons[subject]}
                        <span className="truncate">{subject}</span>
                    </Button>
                 ))}
            </div>
        </CardContent>
    </Card>
);


export default function PreviousYearQuestionsPage() {
  const [selectedExam, setSelectedExam] = useState('CBSE Class 10');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <Dialog>
      <div>
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Previous Year Question Papers</h1>
          <p className="text-muted-foreground">Practice with past exam papers for {selectedExam} to familiarize yourself with the format and question types.</p>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4 mb-8">
          <div className="flex items-center overflow-x-auto space-x-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

        <main className="flex flex-col md:flex-row gap-8">
            <aside className="hidden md:block w-full md:w-1/4 lg:w-1/5">
                <SubjectSidebarContent subjects={subjects} selectedSubject={selectedSubject} onSelectSubject={setSelectedSubject} />
            </aside>

             <div className="md:hidden mb-4">
                <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                    <SheetTrigger asChild>
                         <Button variant="outline">
                            <PanelLeft className="mr-2 h-4 w-4" />
                            Filter by Subject
                        </Button>
                    </SheetTrigger>
                    <SheetContent 
                        side="left" 
                        className="w-[80%] bg-background/80 backdrop-blur-sm p-0"
                    >
                         <SheetHeader>
                            <SheetTitle className="sr-only">Filter by Subject</SheetTitle>
                         </SheetHeader>
                         <SubjectSidebarContent 
                            subjects={subjects} 
                            selectedSubject={selectedSubject} 
                            onSelectSubject={setSelectedSubject}
                            onDone={() => setIsSidebarOpen(false)}
                        />
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex-1">
                {selectedSubject && papersGrouped ? (
                    <Card key={selectedSubject} className="shadow-lg animate-fade-in-up">
                        <CardHeader className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                            <CardTitle>Available Papers for {selectedSubject}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[120px]">Year</TableHead>
                                            <TableHead>Paper Title</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sortedYears.map(year => 
                                            papersGrouped[year].map((paper, index) => (
                                                <TableRow key={`${year}-${index}`} className={index === 0 ? "border-t-4 border-double" : ""}>
                                                    {index === 0 && (
                                                        <TableCell className="font-bold align-top" rowSpan={papersGrouped[year].length}>
                                                            {year}
                                                        </TableCell>
                                                    )}
                                                    <TableCell>{paper.title}</TableCell>
                                                    <TableCell className="text-right space-x-2">
                                                        <DialogTrigger asChild>
                                                            <Button size="sm" variant="outline" onClick={() => setSelectedPaper(paper)}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View
                                                            </Button>
                                                        </DialogTrigger>
                                                        <Button asChild size="sm">
                                                            <Link href={paper.href} target="_blank" rel="noopener noreferrer">
                                                                <Download className="mr-2 h-4 w-4" />
                                                                Download
                                                            </Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="col-span-full text-center py-12">
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

      {selectedPaper && (
        <DialogContent className="sm:max-w-4xl h-[90vh]">
            <DialogHeader>
                <DialogTitle>{`${selectedPaper.subject} - ${selectedPaper.year} (${selectedPaper.title})`}</DialogTitle>
                <DialogDescription>
                    Scroll to view the question paper. You can also download it for offline use.
                </DialogDescription>
            </DialogHeader>
            <div className="h-full w-full flex-grow">
                <iframe
                    src={selectedPaper.href}
                    className="w-full h-full border rounded-md"
                    title="Question Paper Viewer"
                />
            </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
