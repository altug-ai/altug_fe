"use client";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { AuthContext } from "@/context/AuthContext";
import { fetcher } from "@/lib/functions";
import { Message } from "ai";
import { AssistantStatus } from "ai/react";
import axios from "axios";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { MdOutlineAttachment } from "react-icons/md";
import { compressAndResizeImageFile, getVideoDescription } from "../functions/functions";

type Props = {
    submitMessage: (event?: React.FormEvent<HTMLFormElement>, requestOptions?: {
        data?: Record<string, string>;
    }) => Promise<void>;
    messages: Message[];
    setFileId: React.Dispatch<React.SetStateAction<undefined>>;
    fileId: undefined;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
    input: string;
    status: AssistantStatus;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    setLoad: React.Dispatch<React.SetStateAction<boolean>>;
    load: boolean;
    threadId: string;
    open(): void;
    messagesLeft: number;
    paid: boolean;
    tier: any;
    coach?: any;
    handleChat: () => Promise<void>
}



const MediaModal = ({ threadId, submitMessage, messages, coach, setFileId, fileId, handleChat, handleInputChange, input, status, setInput, setMessages, setLoad, load, messagesLeft, open, paid, tier }: Props) => {
    const [imagesrc, setImagesrc] = useState<string>("");
    const [videosrc, setVideosrc] = useState<string>("")
    const [filesrc, setFilesrc] = useState<any>()
    const [response, setResponse] = useState<any>([])
    const [progress, setProgress] = useState(0)
    const { jwt } = useContext(AuthContext)
    const [error, setError] = useState<string>("");
    const [prompt, setPrompt] = useState<string>("")


    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setVideosrc("");
            setImagesrc("");
            setError("");
            const fileType = file.type;
            if (fileType.startsWith("image/png")
                || fileType.startsWith("image/jpeg")
                || fileType.startsWith("image/gif")
                || fileType.startsWith("image/webp")) {
                if (file.size > 10 * 1024 * 1024) {
                    // File size is greater than 5 MB
                    setError('Image should not exceed 10MB.');
                    return; // Stop further execution if there's an error
                }
                // The file is an image
                const reader = new FileReader();
                reader.onload = (event: any) => {
                    setImagesrc(event.target.result as string);
                };
                reader.readAsDataURL(file);
            } else if (fileType.startsWith("video/")) {
                // The file is a video

                const reader = new FileReader();

                reader.onload = async (event: any) => {

                    var getDuration = async function (url: any) {
                        var _player = new Audio(url);
                        return new Promise((resolve) => {
                            _player.addEventListener(
                                'durationchange',
                                function (e) {
                                    if (this.duration !== Infinity) {
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
                    const videoObjectUrl = URL.createObjectURL(file);
                    let duration: any = await getDuration(videoObjectUrl);
                    if (duration > 125) {
                        setError("Video cannot be more than 2 minutes.");
                        return; // Stop further execution if the video duration exceeds 125 seconds
                    }
                    // console.log("the video", event.target.result)

                    setVideosrc(videoObjectUrl); // Assuming you have a setVideosrc function
                };

                reader.readAsDataURL(file);
            } else {
                // Handle other file types if necessary
                setError("Unsupported file type")
            }

            setFilesrc(file); // Assuming you have a setFilesrc function
        }
    };

    const resetAll = () => {
        document.getElementById('closeDialog')?.click();
        setProgress(0)
        setImagesrc("");
        setVideosrc("");
        setPrompt("")
        setLoad(false);
    }

    useEffect(() => {
        const getMessage = async () => {
            if (input !== "" && load) {
                resetAll()
                let response = await submitMessage();
                handleChat();
            }
        }
        getMessage()
    }, [input])




    const uploadMediaToOpenAi = async (data: any) => {

        const createdMessage = await fetcher('/api/upload-media', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: data, threadId: threadId }),
        });


        return createdMessage
    }

    const uploadToStrapi = async () => {
        const body = new FormData();

        try {
            // Compress the image and wait for it to complete
            const compressedImage = await compressAndResizeImageFile(filesrc, 150);

            // Append the compressed image to the FormData
            body.append("files", compressedImage);

            // Upload to Strapi
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/upload/`,
                body,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );

            setProgress(100); // Update progress to 100%
            return response;  // Return the response from the server

        } catch (error) {
            setError("Something went wrong, please try again.");
            setProgress(0);  // Reset progress on error
            setLoad(false);  // Stop any loading indicators
            return "Error";
        }
    };


    const uploadVideoToStrapi = async () => {
        const body = new FormData();

        try {
            // Append the compressed image to the FormData
            body.append("files", filesrc);

            // Upload to Strapi
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/upload/`,
                body,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );

            setProgress(100); // Update progress to 100%
            return response;  // Return the response from the server

        } catch (error) {
            setError("Something went wrong, please try again.");
            setProgress(0);  // Reset progress on error
            setLoad(false);  // Stop any loading indicators
            return "Error";
        }
    };



    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <MdOutlineAttachment className='text-[#357EF8] text-lg cursor-pointer' />
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[80%]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Enter the media you will like to get information about</AlertDialogTitle>
                    <AlertDialogDescription>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="picture">Media</Label>
                            <Input
                                id="picture"
                                accept="image/png, image/jpeg, image/gif, image/webp, video/*"
                                type="file"
                                onChange={handleFileChange}
                            />
                        </div>
                        {
                            imagesrc !== "" && (
                                <Image src={imagesrc} alt="the image src" width={900} height={900} className="rounded-md my-10 max-h-[250px] object-contain" />
                            )
                        }

                        {
                            videosrc !== "" && (
                                <video className='h-[192.52px] w-full object-cover rounded-md grid place-items-center my-7' controls preload="none">
                                    <source src={videosrc} type="video/mp4" />
                                </video>
                            )
                        }
                        {
                            (load) && (
                                <div className='w-full relative max-w-[388px] mt-10 gap-[12px]'>
                                    <Progress value={progress} />
                                    <h1 className='absolute top-1 right-[40%] whitespace-nowrap text-[16px] text-white font-medium text-center'>Analyzing</h1>
                                </div>
                            )
                        }



                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-col">
                    {/* enter prompt to ask about the media uploaded */}
                    <div className='w-full flex justify-center'>
                        <div className='relative w-full max-w-[335px] rounded-[49px]  h-12 bg-white border border-slate-600'>

                            <Input disabled={load} onChange={(e) => { setError(""); setPrompt(e.target.value); }} value={prompt} required className='rounded-l-[49px] w-[80%] h-full text-[16px] focus-visible:ring-0' placeholder='Enter Questions about the media uploaded' />

                            <div className='flex space-x-2 items-center absolute right-0 top-0'>
                                <button onClick={async () => {
                                    if (messagesLeft < 1 && tier === "premium" && !paid) {
                                        resetAll()
                                        open()
                                        return
                                    }
                                    if (load) {
                                        return
                                    }
                                    if (prompt === "") {
                                        setError("Enter a prompt");
                                        return;
                                    }
                                    if (imagesrc === "" && videosrc === "") {
                                        setError("Enter a media");
                                        return
                                    }

                                    if (imagesrc !== "") {
                                        setLoad(true)
                                        setMessages([...messages, { id: "id", content: imagesrc, role: "tool" }])

                                        let res: any = await uploadToStrapi()
                                        if (res?.data && res?.data?.length > 0) {

                                            let upload = await uploadMediaToOpenAi({
                                                role: 'user',
                                                content: [
                                                    {
                                                        type: 'image_url',
                                                        image_url: {
                                                            url: res?.data[0]?.url,
                                                        },
                                                    },
                                                ],
                                            },)
                                            setInput(prompt)
                                            // let desc = `this  is the description of the image uploaded : ${description}, do not say based on your description or something along the line and this is the prompt of the user: $@@ ` + prompt
                                            // setInput(desc)
                                        }


                                    }
                                    if (videosrc !== "") {
                                        setLoad(true)
                                        let newDescription = '';
                                        let description = await getVideoDescription(setProgress, setResponse, videosrc, newDescription)
                                        setMessages([...messages, { id: "id", content: videosrc, role: "data" }])
                                        let res: any = await uploadVideoToStrapi()
                                        if (res?.data && res?.data?.length > 0) {

                                            let upload = await uploadMediaToOpenAi({
                                                role: 'user',
                                                content: `{type:"video",url:${res?.data[0]?.url}`
                                            },)
                                            let desc = `this  is the description of the video uploaded : ${description}, do not say based on your description or something along the line and this is the prompt of the user: $@@` + prompt
                                            setInput(desc);
                                        }


                                    }
                                }} type='button'>
                                    <Image src={"/onboard/send.png"} alt='send icon' width={500} height={500} className={`h-[48px] ${(status === "in_progress" || load) && "animate-pulse"} w-[48px] cursor-pointer `} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <h1 className="text-center text-red-500 font-medium">{error}</h1>

                    <AlertDialogCancel id="closeDialog">Close</AlertDialogCancel>


                    {/* <AlertDialogAction>Continue</AlertDialogAction> */}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default MediaModal