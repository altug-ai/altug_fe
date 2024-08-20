import { NextRequest } from 'next/server';
import OpenAI from 'openai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY || '',
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  // Parse the request body
  const { threadId } = await req.json(); // Destructure threadId from request body

  if (!threadId) {
    return new Response('Missing thread ID in request body', { status: 400 });
  }

  try {
    const response = await openai.beta.threads.messages.list(threadId, {
      limit: 100,
    });
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return new Response('Error retrieving messages', { status: 500 });
  }
}
