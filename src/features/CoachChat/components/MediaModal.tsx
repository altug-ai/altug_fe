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
import { Message } from "ai";
import { AssistantStatus } from "ai/react";
import Image from "next/image";
import OpenAI from 'openai';
import { useEffect, useState } from "react";
import { MdOutlineAttachment } from "react-icons/md";
import { getImageDescription, getVideoDescription } from "../functions/functions";

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
}

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
    dangerouslyAllowBrowser: true,
});

const MediaModal = ({ submitMessage, messages, setFileId, fileId, handleInputChange, input, status, setInput, setMessages, setLoad, load }: Props) => {
    const [imagesrc, setImagesrc] = useState<string>("");
    const [videosrc, setVideosrc] = useState<string>("")
    const [filesrc, setFilesrc] = useState<any>()
    const [response, setResponse] = useState<any>([])
    const [progress, setProgress] = useState(0)

    const [error, setError] = useState<string>("");
    const [prompt, setPrompt] = useState<string>("")

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setVideosrc("");
            setImagesrc("");
            setError("");
            const fileType = file.type;

            if (fileType.startsWith("image/")) {
                if (file.size > 5 * 1024 * 1024) {
                    // File size is greater than 5 MB
                    setError('Image should not exceed 5 MB.');
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

                    let duration: any = await getDuration(event.target.result as string);
                    if (duration > 125) {
                        setError("Video cannot be more than 2 minutes.");
                        return; // Stop further execution if the video duration exceeds 125 seconds
                    }

                    setVideosrc(event.target.result as string); // Assuming you have a setVideosrc function
                };

                reader.readAsDataURL(file);
            } else {
                // Handle other file types if necessary
                setError("Unsupported file type")
                console.log("Unsupported file type");
            }

            setFilesrc(file); // Assuming you have a setFilesrc function
        }
    };


    useEffect(() => {
        if (input !== "" && load) {
            document.getElementById('closeDialog')?.click();
            submitMessage();
            setLoad(false);
        }
    }, [input])



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
                            <Input id="picture" accept="image/*,video/*" type="file" onChange={handleFileChange} />
                        </div>
                        {
                            imagesrc !== "" && (
                                <Image src={imagesrc} alt="the image src" width={900} height={900} className="rounded-md my-10 max-h-[250px] object-cover object-top" />
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
                                    <h1 className='absolute top-1 right-20 whitespace-nowrap text-[16px] text-white font-medium text-center'>Analyzing</h1>
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
                                        let description = await getImageDescription(setProgress, imagesrc, prompt)
                                        setMessages([...messages, { id: "id", content: imagesrc, role: "tool" }])
                                        let desc = `this  is the description of the image uploaded : ${description}, do not say based on your description or something along the line and this is the prompt of the user: $@@ ` + prompt
                                        setInput(desc)

                                    }
                                    if (videosrc !== "") {
                                        setLoad(true)
                                        let newDescription = '';
                                        setMessages([...messages, { id: "id", content: videosrc, role: "data" }])
                                        let description = await getVideoDescription(setProgress, setResponse, videosrc, newDescription)
                                        let desc = `this  is the description of the video uploaded : ${description}, do not say based on your description or something along the line and this is the prompt of the user: $@@` + prompt
                                        setInput(desc);

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