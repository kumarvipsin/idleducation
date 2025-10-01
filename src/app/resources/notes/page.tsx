
// This file is now redundant and can be removed.
// The new page is at /resources/notes_new
// For now, let's redirect to the new page to avoid breaking changes.
import { redirect } from 'next/navigation'

export default function NotesRedirectPage() {
  redirect('/resources/notes_new')
}
