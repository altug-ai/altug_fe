import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
export const maxDuration = 60;

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY || '',
});

// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: '100mb', // Adjust the size as needed
//     },
//   },
// };

export async function POST(req: NextRequest) {
  const userSession: any = await getServerSession(authOptions);

  if (!userSession?.user?.data?.jwt) {
    return new NextResponse('Method not allowed', { status: 404 });
  }

  try {
    const body = await req.json();
    const { batch } = body;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: batch,
      response_format: { type: 'json_object' },
      max_tokens: 4096,
    });

    return new Response(JSON.stringify(completion), { status: 200 });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
