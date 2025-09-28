
'use client';

import { NotesChapterList } from '@/components/notes-chapter-list';
import type { TSubject } from '@/app/actions/types';

interface NotesDetailsClientProps {
    notes: TSubject;
    importantQuestions: TSubject | null;
    classId: string;
    subjectKey: string;
}

export function NotesDetailsClient({ notes, importantQuestions, classId, subjectKey }: NotesDetailsClientProps) {
    return (
        <NotesChapterList 
            notes={notes} 
            importantQuestions={importantQuestions} 
            classId={classId} 
            subjectKey={subjectKey} 
        />
    );
}
