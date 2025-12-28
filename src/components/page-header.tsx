import type { FC } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader: FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="space-y-1.5">
      <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="max-w-2xl text-lg text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
};

export default PageHeader;
