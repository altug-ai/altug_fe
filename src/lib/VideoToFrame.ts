export enum VideoToFramesMethod {
  fps,
  totalFrames,
}

export class VideoToFrames {
  /**
   * Extracts frames from the video and returns them as an array of imageData
   * @param videoUrl url to the video file (html5 compatible format) eg: mp4
   * @param amount number of frames per second or total number of frames that you want to extract
   * @param type [fps, totalFrames] The method of extracting frames: Number of frames per second of video or the total number of frames acros the whole video duration. defaults to fps
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
        _player.currentTime = 24 * 60 * 60; //fake big time
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
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

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
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    resolve(canvas.toDataURL());
  }
}
