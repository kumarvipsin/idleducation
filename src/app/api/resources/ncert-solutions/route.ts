import { NextResponse } from 'next/server';
    import { getCollection } from '@/app/actions/data';
    
    /**
     * API route to fetch NCERT solutions structure.
     */
    export async function GET() {
      try {
        const result = await getCollection('ncertSolutions');
        return NextResponse.json(result);
      } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
      }
    }