export enum VideoToFramesMethod {
  fps,
  totalFrames,
}

export class VideoToFrames {
  /**
   * Extracts frames from the video and returns them as an array of imageData
   * @param videoUrl url to the video file (html5 compatible format) eg: mp4
   * @param amount number of frames per second or total number of frames that you want to extract
   * @param type [fps, totalFrames] The method of extracting frames: Number of frames per second of video or the total number of frames across the whole video duration. defaults to fps
   */
  public static async getFrames(
    videoUrl: string,
    amount: number,
    type: VideoToFramesMethod = VideoToFramesMethod.fps
  ): Promise<string[]> {
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
        _player.currentTime = 24 * 60 * 60; // fake big time
        _player.volume = 0;
        _player.play();
      });
    };

    return new Promise(
      async (
        resolve: (frames: string[]) => void,
        reject: (error: string) => void
      ) => {
        let frames: string[] = [];
        let canvas: HTMLCanvasElement = document.createElement('canvas');
        let context: any = canvas.getContext('2d');
        let duration: any;

        let video = document.createElement('video');
        video.crossOrigin = 'anonymous'; // Allow cross-origin access
        duration = await getDuration(videoUrl); // Await the duration

        video.preload = 'auto';
        let that = this;
        video.addEventListener('loadeddata', async function () {
          // Set the canvas resolution to 224x224 pixels
          canvas.width = 224;
          canvas.height = 224;

          let totalFrames: number = amount;
          if (type === VideoToFramesMethod.fps) {
            totalFrames = duration * amount;
          }

          for (let time = 0; time < duration; time += duration / totalFrames) {
            frames.push(await that.getVideoFrame(video, context, canvas, time));
          }
          resolve(frames);
        });
        video.src = videoUrl;
        video.load();
      }
    );
  }

  private static getVideoFrame(
    video: HTMLVideoElement,
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    time: number
  ): Promise<string> {
    return new Promise(
      (resolve: (frame: string) => void, reject: (error: string) => void) => {
        let eventCallback = () => {
          video.removeEventListener('seeked', eventCallback);
          this.storeFrame(video, context, canvas, resolve);
        };
        video.addEventListener('seeked', eventCallback);
        video.currentTime = time;
      }
    );
  }

  private static storeFrame(
    video: HTMLVideoElement,
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    resolve: (frame: string) => void
  ) {
    // Draw the video frame onto the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    let quality = 0.7; // Start with a medium-high quality
    let dataUrl = canvas.toDataURL('image/jpeg', quality);

    // Adjust the quality until the frame is under 100KB
    while (this.getBase64Size(dataUrl) > 200 && quality > 0.1) {
      quality -= 0.1; // Reduce the quality by 0.1
      dataUrl = canvas.toDataURL('image/jpeg', quality);
    }

    resolve(dataUrl);
  }

  private static getBase64Size(base64: string): number {
    // Calculate the size of the base64 string in kilobytes
    const sizeInBytes =
      base64.length * (3 / 4) -
      (base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0);
    return sizeInBytes / 1024;
  }
}
