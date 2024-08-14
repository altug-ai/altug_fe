import { OpenAI } from 'openai';

import { OpenAIStream } from 'ai';

// create a new OpenAI client using our key from earlier

const openAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const aiChat = async (
  prompt: string,
  userName: string,
  club: string,
  player?: string
) => {
  // encode our file as a base64 string so it can be sent in an HTTP request

  // create an OpenAI request with a prompt

  const completion = await openAi.chat.completions.create({
    model: 'gpt-4-vision-preview',
    messages: [
      {   
        role: 'system',
        content: `You are a helpful coach/professional pplayer assistant that goes by the name ${userName}, your club is ${club}, you offer training or general  football( known as Soccer in America) help , give pre match training skills in the very best professional way, make your persona be unique, be a virtual coach, P.S if you know who the coach(or player, beacause it might be a player) is in real life based on your name, please use the coach/player's philosophy, knowledge, personality to answer the questions.  `,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `${prompt}`,
          },
        ],
      },
    ],

    stream: true,

    max_tokens: 1000,
  });

  // stream the response

  return OpenAIStream(completion);
};
