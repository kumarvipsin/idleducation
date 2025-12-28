import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { ElementType } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  icon: ElementType;
}

export default function FeatureCard({
  title,
  description,
  href,
  icon: Icon,
}: FeatureCardProps) {
  return (
    <Link href={href} className="group block">
      <Card className="h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:border-primary">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </div>
          <div>
            <CardTitle className="font-headline text-xl">{title}</CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
