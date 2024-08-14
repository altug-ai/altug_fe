import { NextResponse, NextRequest } from 'next/server';

import { StreamingTextResponse } from 'ai';
import { challengeProcess } from '@/lib/challengeProcess';

// Set the runtime to edge for best performance

export const runtime = 'edge';

// add a listener to POST requests

export async function POST(request: NextRequest) {
  // read our file from request data

  const data = await request.formData();

  const videoUrl: any = data.get('url');
  const header: any = data.get('header');
  const description: any = data.get('description');
  const point: any = data.get('point');
  // if (!file) {
  //   return NextResponse.json(
  //     { message: 'File not present in body' },

  //     { status: 400, statusText: 'Bad Request' }
  //   );
  // }

  //call our classify function and stream to the client

  const response = await challengeProcess(videoUrl, header, description, point);

  return new StreamingTextResponse(response);
}
