'use client';

// A simple markdown-like renderer
export function NotesContentRenderer({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <div className="prose dark:prose-invert max-w-none">
      {lines.map((line, index) => {
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold mt-4 mb-2">{line.substring(4)}</h3>;
        }
        if (line.startsWith('- **')) {
          const boldEnd = line.indexOf('**', 4);
          const boldText = line.substring(4, boldEnd);
          const restOfText = line.substring(boldEnd + 2);
          return <p key={index} className="mb-2 ml-4"><strong>{boldText}</strong>{restOfText}</p>;
        }
        if (line.startsWith('- - ')) {
          return <p key={index} className="mb-2 ml-8 text-muted-foreground">{line.substring(4)}</p>;
        }
        if (line.startsWith('- ')) {
          return <p key={index} className="mb-2 ml-4">{line.substring(2)}</p>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="mb-2">{line}</p>;
      })}
    </div>
  );
}
