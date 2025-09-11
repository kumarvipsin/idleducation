
'use client';

export const NotesContentRenderer = ({ content }: { content: string }) => {
  const lines = content.split('\n');

  return (
    <div className="space-y-4 prose prose-lg dark:prose-invert max-w-none">
      {lines.map((line, index) => {
        if (line.startsWith('### ')) {
          return (
            <h3 
              key={index} 
              className="text-xl font-bold mt-8 mb-4 pb-2 border-b-2 border-primary/20"
            >
              {line.substring(4)}
            </h3>
          );
        }
        if (line.startsWith('- ')) {
          const parts = line.substring(2).split(':');
          if (parts.length > 1) {
            return (
              <li key={index} className="flex items-start ml-4">
                <span className="text-primary mr-3 mt-1">&#9679;</span>
                <span className="text-foreground/90">
                  <strong className="font-semibold text-foreground">{parts[0]}:</strong>
                  {parts.slice(1).join(':')}
                </span>
              </li>
            );
          }
          return (
            <li key={index} className="flex items-start ml-4">
              <span className="text-primary mr-3 mt-1">&#9679;</span>
              <span className="text-foreground/90">{line.substring(2)}</span>
            </li>
          );
        }
        if (line.trim() === '') {
          return null;
        }
        const boldedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground/90">$1</strong>');
        return <p key={index} className="text-foreground/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: boldedLine }} />;
      })}
    </div>
  );
};
