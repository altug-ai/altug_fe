import { experimental_AssistantResponse } from 'ai';
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

  const input = await req.json();

  // Create a thread if needed
  const threadId = input?.userThreadId
    ? input?.userThreadId
    : input.threadId ?? (await openai.beta.threads.create({})).id;

  let data: any = {
    role: 'user',
    content: input.message,
  };

  if (input.fileId) {
    data = {
      role: 'user',
      content: input.message,
      attachments: [
        {
          file_id: input.fileId,
          tools: [{ type: 'code_interpreter' }],
        },
      ],
    };
  }
  // Add a message to the thread
  const createdMessage = await openai.beta.threads.messages.create(
    threadId,
    data
  );

  return experimental_AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ({ forwardStream, sendDataMessage }) => {
      const runStream = await openai.beta.threads.runs.stream(threadId, {
        assistant_id:
          input.assistantId ??
          (() => {
            throw new Error('ASSISTANT_ID is not set');
          })(),
      });

      let runResult: any = await forwardStream(runStream);

      runResult = await forwardStream(
        openai.beta.threads.runs.submitToolOutputsStream(
          threadId,
          runResult.id,
          // @ts-ignore
          { tool_outputs }
        )
      );
    }
  );
}
