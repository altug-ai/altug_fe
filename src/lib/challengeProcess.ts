import { OpenAI } from 'openai';
import { OpenAIStream } from 'ai';
import { VideoToFrames, VideoToFramesMethod } from './VideoToFrame';

// create a new OpenAI client using our key from earlier
const openAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const challengeProcess = async (
  url: any,
  header: any,
  description: any,
  point: any
) => {
  const frameRate = 5; // Reduced frame rate
  const resizeWidth = 256; // Resize width for thumbnails
  // encode our file as a base64 string so it can be sent in an HTTP request
  let frames : any = [];

  // Asynchronous function to extract frames
  const extractFrames = async () => {
    try {
      const extractedFrames = await VideoToFrames.getFrames(
        url,
        1,
        VideoToFramesMethod.totalFrames
      );

      frames = extractedFrames;
    } catch (error) {
      console.error('Error extracting frames:', error);
    }
  };

  // // Await the extraction of frames
  await extractFrames();

  // Process the frames
  const processedMessages = await Promise.all(
    frames.map(async (mess: any) => {
      return {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${mess}`,
            },
          },
        ],
      };
    })
  );

  // Create an OpenAI request with a prompt
  console.log('Processed messages:', frames);

  const completion = await openAi.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a challenge scorer, you score user uploaded videos for a challenge based on the goal and the heading of the challenge. Uploaded now is a frame of the user video. This is the title of the challenge: ${header}, this is the challenge goal: ${description}, this is the maximum point the challenge can give: ${point}. Based on the user's uploaded video and the challenge requirements, return a score for the user over the maximum point given.`,
      },
      ...processedMessages,
    ],
    stream: true,
    max_tokens: 1000,
  });

  // Stream the response
  return OpenAIStream(completion);
};
