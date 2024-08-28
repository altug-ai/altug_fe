import { VideoToFrames, VideoToFramesMethod } from '@/lib/VideoToFrame';
import axios from 'axios';
import OpenAI from 'openai';
import { Dispatch, SetStateAction } from 'react';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true,
});

const concatenateDescriptions = (dataArray: any) => {
  // Sort the array by id
  dataArray.sort((a: any, b: any) => a.id - b.id);

  // Initialize an empty string to store concatenated descriptions
  let concatenatedString = '';

  // Loop through the sorted array and concatenate descriptions
  dataArray.forEach((item: any) => {
    concatenatedString += ` ${item.description}\n\n`; // Adjust format as needed
  });

  return concatenatedString;
};

export const getVideoDescription = async (
  setProgress: Dispatch<SetStateAction<number>>,
  setResponse: Dispatch<any>,
  videoUrl: string,
  newDescription: string,
  setInput?: React.Dispatch<React.SetStateAction<string>>,
  input?: string
) => {
  const batchSize = 10; // Number of frames to process per batch
  let extractedFrames;
  setResponse([]);
  setProgress(5);
  let frame = 0.5;

  // const getFirstDesc = await getChallengeDesc(urlVideo, openai, setRes, res, concatenateDescriptions)

  var getDuration = async function (url: any) {
    var _player = new Audio(url);
    return new Promise((resolve) => {
      _player.addEventListener(
        'durationchange',
        function (e) {
          if (this.duration != Infinity) {
            const duration = this.duration;
            _player.remove();
            resolve(duration);
          }
        },
        false
      );
      _player.load();
      _player.currentTime = 24 * 60 * 60; //fake big time
      _player.volume = 0;
      _player.play();
    });
  };
  let duration: any = await getDuration(videoUrl);

  if (duration < 11) {
    frame = 6;
  } else if (duration > 10 && duration < 16) {
    frame = 4;
  } else if (duration > 15 && duration < 31) {
    frame = 1;
  } else if (duration > 30 && duration < 80) {
    frame = 0.8;
  }

  try {
    extractedFrames = await VideoToFrames.getFrames(
      videoUrl,
      frame,
      VideoToFramesMethod.fps
    );
  } catch (error) {
    console.error('Error extracting frames:', error);
    return;
  }

  // Chunk frames into batches of size batchSize
  const frameBatches = [];
  for (let i = 0; i < extractedFrames.length; i += batchSize) {
    const batch = extractedFrames.slice(i, i + batchSize);
    frameBatches.push(batch);
  }

  let done = 0;

  // Process each batch of frames concurrently
  const processBatch = async (batch: any, index: any) => {
    // Prepare messages for this batch
    const batchMessages = await Promise.all(
      batch.map(async (frame: any) => {
        return {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `${frame}`,
              },
            },
          ],
        };
      })
    );

    // Add system message for the batch
    batchMessages.push({
      role: 'system',
      content: `In this video frame, describe what you see"..

Do not include labels such as "frame 1," "frame 2,", "id 0", "id 1" etc., in your response`,
    });

    // Call OpenAI API to process this batch
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: batchMessages,
        max_tokens: 4096,
      });

      const systemResponse = completion.choices.find(
        (choice) => choice.message.role === 'assistant'
      );
      if (systemResponse) {
        done = done + 1;
        const description = systemResponse.message.content;

        let percentCompleted = Math.round((done * 100) / frameBatches?.length);
        setProgress(percentCompleted);
        

        setResponse((prevResponse: any) => {
          let array = [
            ...prevResponse,
            {
              description: description,
            },
          ];
          newDescription = concatenateDescriptions(array); // Assuming `description` is defined
          return array;
        });
      }
    } catch (error) {
      console.error('Error processing batch with OpenAI:', error);
      setResponse([]);
    }
  };

  // Create an array of promises for each batch processing
  const batchPromises = frameBatches.map((batch, index) => {
    return processBatch(batch, index); // Ensure processBatch returns the promise
  });

  // Await all batch processing promises concurrently
  try {
    await Promise.all(batchPromises);
    // Now response state should be populated with descriptions
    setTimeout(() => {
      setResponse([]);
      // console.log('this is the new Description', newDescription);
    }, 2000);

    return newDescription;
  } catch (error) {
    setResponse([]);
    console.error('Error processing batches:', error);
  }
};

export const addMessageLeft = async (id: any, jwt: any, messageLeft: any) => {
  try {
    const updateMessage = await axios.put(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/chats/${id}`,
      {
        data: {
          messagesLeft: messageLeft,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return updateMessage;
  } catch (error) {
    console.error('this is the error', error);
  }
};

function getCurrentFormattedTime() {
  const currentDate = new Date();
  // currentDate.setHours(1, 0, 0, 0);
  const isoDate = currentDate.toISOString();
  return isoDate;
}

export const createChat = async (id: any, jwt: any, profileId: any) => {
  try {
    let idd = parseInt(id);
    const data = {
      data: {
        coach: idd,
        client_profile: profileId,
        last_chated: getCurrentFormattedTime(),
        sent: false,
        paid: false,
      },
    };

    const updateChallenge = await axios.post(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/chats`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return updateChallenge;
  } catch (error) {
    console.error(error);
  }
};

export const UpdateChat = async (
  id: any,
  jwt: any,
  profileId: any,
  chatId: any
) => {
  try {
    let idd = parseInt(id);
    const data = {
      data: {
        coach: idd,
        client_profile: profileId,
        last_chated: getCurrentFormattedTime(),
        sent: false,
      },
    };

    const updateChallenge = await axios.put(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/chats/${chatId}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return updateChallenge;
  } catch (error) {
    console.error(error);
  }
};

export const createChatt = async (id: any, jwt: any, profileId: any) => {
  try {
    let idd = parseInt(id);
    const data = {
      data: {
        player: idd,
        client_profile: profileId,
        last_chated: getCurrentFormattedTime(),
        sent: false,
        paid: false,
      },
    };

    const updateChallenge = await axios.post(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/chats`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return updateChallenge;
  } catch (error) {
    console.error(error);
  }
};

export const UpdateChatt = async (
  id: any,
  jwt: any,
  profileId: any,
  chatId: any
) => {
  try {
    let idd = parseInt(id);
    const data = {
      data: {
        player: idd,
        client_profile: profileId,
        last_chated: getCurrentFormattedTime(),
        sent: false,
      },
    };

    const updateChallenge = await axios.put(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/chats/${chatId}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return updateChallenge;
  } catch (error) {
    console.error(error);
  }
};

export const sentAlready = async (id: any, jwt: any) => {
  try {
    let idd = parseInt(id);
    const data = {
      data: {
        last_chated: getCurrentFormattedTime(),
        sent: true,
      },
    };

    const updateChallenge = await axios.put(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/chats/${id}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return updateChallenge;
  } catch (error) {
    console.error(error);
  }
};

export const sendNo = async (
  id: any,
  jwt: any,
  name: string,
  days: string,
  chat: any,
  type: string,
  iddd: any
) => {
  try {
    let idd = parseInt(id);
    const data = {
      data: {
        text: `you havent talked to ${name} the last ${days} days. Ask him something`,
        type: type,
        coachId: `${iddd}`,
        accepted: [
          {
            id: `${idd}`,
          },
        ],
      },
    };

    const updateChallenge = await axios.post(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/notifications`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    sentAlready(chat, jwt);

    return updateChallenge;
  } catch (error) {
    console.error(error);
  }
};

export function existsIdInArray<T extends { id: unknown }>(
  arr: T[],
  targetId: unknown
): boolean {
  return arr.some((item) => item.id === targetId);
}

export const followCoach = async (id: any, profileId: any, jwt: any) => {
  try {
    const data = {
      data: {
        coaches: {
          connect: [id],
        },
      },
    };

    const followCoach = await axios.put(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/client-profiles/${profileId}?populate[0]=coaches.club.logo&populate[1]=coaches.picture`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return followCoach;
  } catch (error) {
    console.error(error);
  }
};

export const followPlayer = async (id: any, profileId: any, jwt: any) => {
  try {
    const data = {
      data: {
        players: {
          connect: [id],
        },
      },
    };

    const followCoach = await axios.put(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/client-profiles/${profileId}?populate[0]=players.club.logo&populate[1]=players.picture`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return followCoach;
  } catch (error) {
    console.error(error);
  }
};
