import { VideoToFrames, VideoToFramesMethod } from '@/lib/VideoToFrame';

export const getChallengeDesc = async (
  urlVideo: any,
  openai: any,
  setResponse: any,
  response: any,
  concatenateDescriptions: any
) => {
  let frame = 0.5;
  const batchSize = 10; // Number of frames to process per batch
  let extractedFrames;
  let newDescription = '';

  console.log('this is the urlVideo :', urlVideo);

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
  let duration: any = await getDuration(urlVideo);
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
      urlVideo,
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
      content: `You are an AI video transcriber with a keen eye for detail, tasked with accurately describing the content of video frames. You have been given a batch of frames from a larger video submitted for a challenge.

Your task is to describe the actions and activities of the person or people in each frame. Ensure your descriptions are clear and detailed. Just state what the user is doing, without adding any context or embellishments like "with great ball control and agility," etc. Simply describe the actions as they occur in the video.

Do not include labels such as "frame 1," "frame 2," etc., in your response. Just provide a continuous description of what the user is doing across the frames`,
    });

    // Call OpenAI API to process this batch
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: batchMessages,
        max_tokens: 4096,
      });

      const systemResponse = completion.choices.find(
        (choice: any) => choice.message.role === 'assistant'
      );
      if (systemResponse) {
        done = done + 1;
        const description = systemResponse.message.content;

        let percentCompleted = Math.round((done * 60) / frameBatches?.length);

        setResponse((prevResponse: any) => {
          let array = [
            ...prevResponse,
            {
              id: index, // Assuming `index` is defined somewhere in your code
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
    setResponse([]);
    setTimeout(() => {
      return newDescription;
    }, 2000);
  } catch (error) {
    console.error('Error processing batches:', error);
    setResponse([]);
  }
};
