// import { classifyImage } from '@/app/lib/classifier';

import { NextResponse, NextRequest } from 'next/server';

import { StreamingTextResponse } from 'ai';
import { aiChat } from '@/lib/aiChat';

// Set the runtime to edge for best performance

export const runtime = 'edge';

// add a listener to POST requests

export async function POST(request: NextRequest) {
  // read our file from request data

  const data = await request.formData();

  const prompt: any = data.get('prompt');
  const userName: any = data.get('userName');
  const club: any = data.get('club');
  const player: any = data.get('player');
  const response = await aiChat(prompt, userName, club, player);

  return new StreamingTextResponse(response);
}
