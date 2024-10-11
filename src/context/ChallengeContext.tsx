"use client";

import { useToast } from "@/components/ui/use-toast";
import { sendLeaderboardNots } from "@/features/Challenges/functions/function";
import { VideoToFrames, VideoToFramesMethod } from "@/lib/VideoToFrame";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import OpenAI from "openai";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";
import { ChallengeProps } from "./types";
import { usePathname } from 'next/navigation'
import { fetcher } from "@/lib/functions";

// @ts-ignore
export const ChallengeContext = createContext<ChallengeProps>({});



function ChallengeContextProvider(props: any) {
    const [challengeLoader, setChallengeLoader] = useState<boolean>(false)
    const [recording, setRecording] = useState<boolean>(false)
    const [facingMode, setFacingMode] = useState('environment');
    const [route, setRoute] = useState<number>(0);
    const [tab, setTab] = useState<number>(1)
    const [paused, setPaused] = useState<boolean>(false);
    const [videoBlob, setVideoBlob] = useState(null)
    const params = useParams();
    const { slug }: any = params;
    const { toast } = useToast();
    const [score, setScore] = useState<any>()
    const [explanation, setExplanation] = useState<string>("")
    const [videoUrl, setVideoUrl] = useState('');
    const [refetch, setRefetch] = useState<boolean>(false)
    const videoRef = useRef<any>(null)
    const mediaRecorderRef = useRef<any>(null)
    const [error, setError] = useState<boolean>(false)
    const { jwt, profileId, setTotalPoint, totalPoint, stats, setStats } = useContext(AuthContext)
    const [progress, setProgress] = useState(0)
    const [point, setPoint] = useState<string>("");
    const [urlVideo, setUrlVideo] = useState<string>("");
    const [userPoint, setUserPoint] = useState<string>("")
    const [stat, setStat] = useState<string>("");
    const [header, setHeader] = useState<string>("");
    const [descriptionn, setDescriptionn] = useState<string>("");
    const [goal, setGoal] = useState("")
    const [response, setResponse] = useState<any[]>([]);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [res, setRes] = useState<any[]>([]);
    const [chal, setChal] = useState<any>()
    const [lang, setLang] = useState<any>("")
    const t = useTranslations('Home.ChallengePage');
    const pathname = usePathname()
    const maxDuration = 2 * 60 * 1000; // 2 minutes in milliseconds

    useEffect(() => {
        setRoute(0)
        setScore(null)
        setVideoUrl("")
        setVideoBlob(null)
        setExplanation("")
        setProgress(0)
    }, [pathname])


    // handle the data available
    const handleDataAvailable = useCallback(({ data }: any) => {
        if (data?.size > 0) {
            if (elapsedTime < maxDuration) {
                setVideoBlob(data);
                const url = window.URL.createObjectURL(data);
                setVideoUrl(url);
            } else {
                // Stop recording if duration exceeds maxDuration
                handleStopCaptureClick();
                setRoute(1)
            }
        }
    }, [elapsedTime, maxDuration]);

    // function to stat the recording
    const handleStartCaptureClick = useCallback(() => {
        // Reset elapsed time when starting a new recording
        setElapsedTime(0);

        let options: MediaRecorderOptions | undefined;
        if (MediaRecorder.isTypeSupported('video/webm; codecs=vp9')) {
            options = { mimeType: 'video/webm; codecs=vp9' };
        } else if (MediaRecorder.isTypeSupported('video/webm')) {
            options = { mimeType: 'video/webm' };
        } else if (MediaRecorder.isTypeSupported('video/mp4')) {
            options = { mimeType: 'video/mp4', videoBitsPerSecond: 100000 };
        } else {
            console.error("no suitable mimetype found for this device");
        }

        const timer = setInterval(() => {
            setElapsedTime(prev => prev + 1000); // Increment elapsed time every second
        }, 1000);

        navigator.mediaDevices.getUserMedia({
            'video': {
                facingMode: facingMode
            },
            'audio': true,
        })
            .then(stream => {
                videoRef.current.srcObject = stream;
                mediaRecorderRef.current = new MediaRecorder(stream, options);
                mediaRecorderRef.current.ondataavailable = handleDataAvailable;
                mediaRecorderRef.current.start();
                setRecording(true);
            }).catch(error => console.error("Error accessing media devices.", error));

        // Clear interval and stop recording after maxDuration
        setTimeout(() => {
            clearInterval(timer);
            if (mediaRecorderRef.current.state === "recording") {
                handleStopCaptureClick();
                setRoute(1)
            }
        }, maxDuration);
    }, [facingMode]);


    // to pause the recording
    const pauseRecording = () => {
        if (mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.pause();
            setPaused(true)
        }
    }

    // to resume the recording
    const resumeRecording = () => {
        if (mediaRecorderRef.current.state === "paused") {
            mediaRecorderRef.current.resume();
            setPaused(false);
        }
    }

    // stop the videoing
    const handleStopCaptureClick = useCallback(() => {
        mediaRecorderRef.current.stop();;
        setRecording(false);
        setPaused(false)
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track: any) => track.stop());
        videoRef.current.srcObject = null;
    }, [])


    const handleGetComment = async (coach: {
        type: string;
        id: number;
    }, desc: string) => {

        let language = "English"

        if(lang === "tr"){
            language = "Turkish"
        }

        let batch = [
            {
                role: 'system',
                content: `based on the challenge ${header}, ${descriptionn} and ${goal}, in the ${language} languague, give a short comment on the user's video description uploaded for the challenge, make sure the comment is in ${language}
               `,
            },

            {
                role: "user",
                content: `this is the user's video description ${desc}`
            }

        ]

        const completion = await fetcher('/api/get-comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ batch: batch }),
        });


        if (completion?.choices?.length > 0) {
            // console.log("the result", completion?.choices[0]?.message?.content)
            return completion?.choices[0]?.message?.content
        } else {
            return false
        }
    }


    const handleUploadChallengeVideo = async (point: string, coach: {
        type: string;
        id: number;
    } | undefined, desc: any) => {
        setRoute(2);
        setError(false)
        try {
            const body = new FormData()
            if (videoBlob) {
                body.append("files", videoBlob)
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/upload/`,
                body,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                    onUploadProgress: async (progressEvent: any) => {
                        // let percentCompleted = Math.round(
                        //     (progressEvent.loaded * 90) / progressEvent.total
                        // );
                        setProgress(80)
                    },
                }
            );
            let comment;
            if (coach) {
                comment = await handleGetComment(coach, desc)
            }

            let profile: any;

            if (chal?.id) {
                profile = await axios.put(
                    `${process.env.NEXT_PUBLIC_STRAPI_URL}/submitted-challenges/${chal?.id}`,
                    {
                        data: {
                            client_profile: profileId,
                            challenge: slug,
                            video: response.data[0].id,
                            stat: stat,
                            points: point === "" ? 0 : point === null ? 0 : point ? parseInt(point) : 0
                        },
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                );

            } else {
                profile = await axios.post(
                    `${process.env.NEXT_PUBLIC_STRAPI_URL}/submitted-challenges`,
                    {
                        data: {
                            client_profile: profileId,
                            challenge: slug,
                            video: response.data[0].id,
                            stat: stat,
                            points: point === "" ? 0 : point === null ? 0 : point ? parseInt(point) : 0
                        },
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                );
            }


            if (profile?.data?.data?.id) {
                // update the stats and total_point in the client profile
                if (coach) {
                    let newData: any = {
                        data: {
                            comment: comment,
                            submitted_challenge: profile?.data?.data?.id,
                            coach: coach.id
                        }
                    }

                    if (coach?.type === "player") {
                        newData = {
                            data: {
                                comment: comment,
                                submitted_challenge: profile?.data?.data?.id,
                                player: coach.id
                            }
                        }
                    }

                    const submitComment = await axios.post(
                        `${process.env.NEXT_PUBLIC_STRAPI_URL}/comments`,
                        newData,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${jwt}`,
                            },
                        }
                    );
                }
                let data: any = {
                    data: {
                        total_point: (parseInt(totalPoint) + (point === "" ? 0 : point === null ? 0 : point ? parseInt(point) : 0)),
                        // @ts-ignore
                        [stat]: (stats?.[`${stat}`] + (point === "" ? 0 : point === null ? 0 : point ? parseInt(point) : 0))
                    }
                }


                let response = await axios.put(
                    `${process.env.NEXT_PUBLIC_STRAPI_URL}/client-profiles/${profileId}`,
                    data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                );

                if (response?.data?.data?.id) {
                    let newPoint = (point === "" ? 0 : point === null ? 0 : point ? parseInt(point) : 0);

                    let response = await sendLeaderboardNots(jwt, parseInt(totalPoint), newPoint, profileId)
                    setTotalPoint(`${(parseInt(totalPoint)) + newPoint}`)
                    setStats({
                        ...stats,
                        // @ts-ignore
                        [stat]: (stats?.[`${stat}`] + (point === "" ? 0 : point === null ? 0 : point ? parseInt(point) : 0))
                    })
                    const timeout = setTimeout(() => {
                        setChallengeLoader((prev) => !prev);
                    }, 2000);
                    setChal(null)
                    setProgress(100)
                    setRefetch(!refetch)
                    setUserPoint(point === "" ? "0" : point === null ? "0" : point ? point : "0")
                    setScore(null)
                    setVideoUrl("")
                    setVideoBlob(null)
                    setExplanation("")
                    setRoute(3)

                }


            }

        } catch (error) {
            console.error("An error occured", error)
            setError(true)
        }
    }


    // to share the challenge
    const handleShare = async (id: number) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: t("Check"),
                    text: t("Zballer"),
                    url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/challenge/${id}?id=${profileId}`
                })

            } catch (error) {
                console.error("an error occured", error)
            }
        }
    }


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

    function calculateScore(score: any, point: any) {
        // Check if point is a valid number (not NaN or Infinity)
        if (isNaN(point) || point === Infinity) {
            throw new Error("Invalid point value: Please provide a valid number for point.");
        }

        const percentageThreshold = 0.6;
        const minimumScore = point * percentageThreshold;

        return score >= minimumScore ? point : 0;
    }

    const handleRetriveData = async (content: any, coach: {
        type: string;
        id: number;
    } | undefined, desc: any) => {
        try {
            const fixedContent = content.replace(/\n\s*/g, "").trim();
            // Parse the content as JSON
            const data = JSON.parse(fixedContent);

            let score = data.score || null;
            let explanation = data.explanation || null;
            let newScore = calculateScore(parseInt(`${score}`), parseInt(`${point}`))
            // console.log("Score:", score);
            // console.log("Explanation:", explanation);
            setProgress(70)
            setScore(score)
            setExplanation(explanation);

            if (newScore !== 0) {
                handleUploadChallengeVideo(`${newScore}`, coach, desc)
            }
            return { score, explanation };
        } catch (error) {
            setError(true);
            console.error("Error parsing JSON content:", error);
            return { score: null, explanation: null }; // Handle parsing error
        }
    };



    // get the score for the submitted challenge
    const handleDesc = async (description: string, coach?: {
        type: string;
        id: number;
    } | undefined, desc?: any,) => {


        // console.log("here", description)
        try {

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

            let batch = [
                {
                    role: 'system',
                    content: `
       You are a challenge scorer responsible for evaluating user-uploaded videos based on the goal and header of the challenge. The title of the challenge is "${header}" with the description: "${descriptionn}" and the goal : "${goal}". The maximum points for this challenge are ${point}.

You have been provided with a sequence of frame descriptions, where each frame (ignoring IDs or frame number) details what happens next in the video. The frames are part of a larger video, and they represent a continuous sequence with no change in scene or participants. Your task is to ensure the user's video aligns with the challenge requirements.
if the goal/desciption involves counting then look at the number of times the action is performed in the provided frames description to count. 
Pay attention to details:

For example, if the challenge is for dribbling and the user is just juggling, then mark the user low.
Check if the actions  align with the overall goal/description of the challenge. 
if the challenge involves a count, like score 3 goals , there wouldn't be any definitive success counts in the frames, you will be the one that will count the number of times the user does the action based on the frames description.
Also note that the user can start or do the challenge at any part of the video, just look through and check for the user doing the actual challenge, ignore any activities done that does not include the challenge, any activities that does not involve the challenge should be ignored, just make sure the user eventually does the challenge
Score the user based on how well their uploaded video/frames description matches the challenge header, description, and goal. The maximum score achievable for this challenge is ${point} points.when returning the score and explanation  just return the score and explanation for the user in a json object, for example if it is 0 return score : 0, if it is 1, return score :1 etc, then give an explanation for the score in the same object , just return it as a pure object, do not add anythinbg like ${"```json"} etc, just a pure object, do not add any thing that will be hard to change to Json REMEMBER return it in json like for example ${"{ \n 'score':3, \n 'explanation' : 'yesss'}"}}`,
                },

                {
                    role: "user",
                    content: `this is the description of the various frames of the user video ${description}`
                }

            ]

            const completion = await fetcher('/api/get-score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ batch: batch }),
            });


            if (completion?.choices?.length > 0) {
                // console.log("the result", completion?.choices[0]?.message?.content)
                handleRetriveData(completion?.choices[0]?.message?.content, coach, description)
            }
        } catch (error) {
            setError(true);
        }
    }


    // get the challenge video description
    const handleChat = async (
        coach: {
            type: string;
            id: number;
        } | undefined
    ) => {
        setError(false);
        const batchSize = 10; // Number of frames to process per batch
        let extractedFrames;
        let newDescription = ""
        setRoute(2)
        setResponse([])
        setProgress(5)
        let frame = 0.5

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
            frame = 10
        }
        else if (duration > 10 && duration < 16) {
            frame = 10
        } else if (duration > 15 && duration < 31) {
            frame = 5
        } else if (duration > 30 && duration < 80) {
            frame = 5
        }

        try {
            extractedFrames = await VideoToFrames.getFrames(videoUrl, frame, VideoToFramesMethod.fps);
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
            const batchMessages = await Promise.all(batch.map(async (frame: any) => {
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
            }));

            // Add system message for the batch
            batchMessages.push({
                role: 'system',
                content: `In the video frames, describe the actions performed by the user., if an action is performed by the user, say all that is being done, no summary, all. 
also this is the description and goal of the challenge ${descriptionn}, ${goal} given to the user, do not allow the description and goal of the challenge cloud your descriptions, for example if the user is just tapping the ball and not juggling, say they are tapping the ball eteec, do not say things like "in an attempt to juggle" or things in that nature, just say the actions exactly as it is, if you see the user performing an action that relates to the challenge description or goal please say, or any action relating to the description or goal. do not hallucinate result , or say the user is doing the goal/description of the challenge when they are not.
if the challenge involves a count, please state the count, for example do not say something like "the user is repeatedly tapping the ball", say something like, the user just tapped the ball with his foot, they just tapped the ball again, just did again, etec, state all action clearly no matter how small. state what the user is doing and what part of the body the user is using etec. make it extremely detailed
                Do not include labels such as "frame 1," "frame 2,", "id 0", "id 1", first image", secong image" etc., in your response. also pay attention on the ball if there is, for example if the challenge is to hit the crossbar, if you see the ball hit the crossbar then say it,say the position of the ball, where it is hiting etc. Also do not say anything that does not align with the challenge description/goal, only generate the description of actions done that will help in the scoring of the challenge, things like description the user's cloth, the grass etc that isn't relevant to the challenge should not be generated/it should be ignored.only say actions that will help in scoring the user for the challenge, if the user is doing nothing, do not say it etc. `,
            });

            // Call OpenAI API to process this batch
            try {
                // const completion = await openai.chat.completions.create({
                //     model: 'gpt-4o',
                //     messages: batchMessages,
                //     max_tokens: 4096,
                // });
                const completion = await fetcher('/api/get-frame-description', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ batch: batchMessages }),
                });

                const systemResponse = completion.choices.find((choice: any) => choice.message.role === 'assistant');
                if (systemResponse) {
                    done = done + 1
                    const description = systemResponse.message.content;

                    let percentCompleted = Math.round(
                        (done * 60) / frameBatches?.length
                    );
                    setProgress(percentCompleted)
                    setResponse(prevResponse => {
                        let array = [
                            ...prevResponse,
                            {
                                description: description,
                            }
                        ];
                        newDescription = concatenateDescriptions(array); // Assuming `description` is defined

                        return array
                    });
                }
            } catch (error) {
                console.error('Error processing batch with OpenAI:', error);
                // setResponse([])
                // setError(true);
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
                setResponse([])
                handleDesc(newDescription, coach)
            }, 2000);

        } catch (error) {
            setResponse([])
            console.error('Error processing batches:', error);
            setError(true);
        }
    };

    console.log("the response", response)
    return (
        <ChallengeContext.Provider
            value={{
                challengeLoader,
                setChallengeLoader,
                goal,
                setGoal,
                recording,
                chal,
                setChal,
                setRecording,
                videoBlob,
                setVideoBlob,
                videoUrl,
                setVideoUrl,
                videoRef,
                mediaRecorderRef,
                handleStartCaptureClick,
                handleStopCaptureClick,
                paused,
                setPaused,
                setProgress,
                pauseRecording,
                resumeRecording,
                descriptionn,
                setUrlVideo,
                urlVideo,
                header,
                setHeader,
                setDescriptionn,
                error,
                setError,
                route,
                setRoute,
                handleUploadChallengeVideo,
                handleShare,
                facingMode,
                setFacingMode,
                setTab,
                handleChat,
                response,
                point,
                setPoint,
                setStat,
                stat,
                setResponse,
                tab,
                userPoint,
                score,
                explanation,
                setExplanation,
                setScore,
                progress,
                refetch, setRefetch,
                lang,
                setLang
            }}
        >
            {props.children}
        </ChallengeContext.Provider>
    );
}

export { ChallengeContextProvider };

