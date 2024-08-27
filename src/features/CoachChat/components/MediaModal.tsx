"use client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { MdOutlineAttachment } from "react-icons/md"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react";
import OpenAI from 'openai';
import Image from "next/image";
import { Message } from "ai";
import { AssistantStatus } from "ai/react";
import { Progress } from "@/components/ui/progress";
import { getVideoDescription } from "../functions/functions";

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
}

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
    dangerouslyAllowBrowser: true,
});

const MediaModal = ({ submitMessage, messages, setFileId, fileId, handleInputChange, input, status, setInput, setMessages }: Props) => {
    const [imagesrc, setImagesrc] = useState<string>("");
    const [videosrc, setVideosrc] = useState<string>("")
    const [filesrc, setFilesrc] = useState<any>()
    const [response, setResponse] = useState<any>([])
    const [progress, setProgress] = useState(0)
    const [load, setLoad] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [loadn, setLoadn] = useState<boolean>(false)

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setVideosrc("")
            setImagesrc("")
            setError("")
            const fileType = file.type;

            if (fileType.startsWith("image/")) {
                // The file is an image
                const reader = new FileReader();
                reader.onload = (event: any) => {
                    setImagesrc(event.target.result as string);
                    let result: any = event.target.result as string

                };
                reader.readAsDataURL(file);
            } else if (fileType.startsWith("video/")) {
                // The file is a video
                const reader = new FileReader();
                reader.onload = (event: any) => {
                    setVideosrc(event.target.result as string); // Assuming you have a setVideosrc function
                };
                reader.readAsDataURL(file);
            } else {
                // Handle other file types if necessary
                console.log("Unsupported file type");
            }

            setFilesrc(file);
        }
    };

    // function to delete the file uploaded
    const deleteFile = async () => {
        try {
            if (fileId) {
                const file = await openai.files.del(fileId);
                setFileId(undefined)
            }
        } catch (error) {
            console.log("error ", error);
        }
    }

    useEffect(() => {
        if (fileId) {
            document.getElementById('closeDialog')?.click();
            submitMessage()
        }
    }, [fileId])

    // useEffect(() => {
    //     if (loadn) {
    //         document.getElementById('closeDialog')?.click();
    //         submitMessage()
    //         setLoadn(false)
    //     }
    // }, [input])


    // useEffect(() => {
    //     if (fileId) {
    //         document.getElementById('closeDialog')?.click();
    //         submitMessage()
    //     }
    // }, [input, loadn])

    useEffect(() => {
        if (status !== "in_progress" && fileId) {
            // delete the file from the backend 
            deleteFile()
            setLoad(false)
        }
    }, [status])



    const uploadFileToOpenai = async () => {
        setLoad(true)
        try {
            console.log("the filesrc", filesrc)
            const file: any = await openai.files.create({
                file: filesrc,
                purpose: "assistants",
            });
            console.log("the file id", file?.id)
            await setFileId(file?.id);
            setMessages([...messages, { id: "id", content: imagesrc, role: "tool" }])

        } catch (error) {
            setLoad(false)
            setError("Please try again")
            console.log("error ", error);
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
                            <Input id="picture" type="file" onChange={handleFileChange} />
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
                            (videosrc !== "" && load) && (
                                <div className='w-full relative max-w-[388px] mt-10 gap-[12px]'>
                                    <Progress value={progress} />
                                    <h1 className='absolute top-1 right-20 whitespace-nowrap text-[16px] text-white font-medium text-center'>Analyzing Video</h1>
                                </div>
                            )
                        }



                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-col">
                    {/* enter prompt to ask about the media uploaded */}
                    <div className='w-full flex justify-center'>
                        <div className='relative w-full max-w-[335px] rounded-[49px]  h-12 bg-white border border-slate-600'>

                            <Input disabled={load} onChange={(e) => { setError(""); handleInputChange(e); }} value={input} required className='rounded-l-[49px] w-[80%] h-full text-[16px] focus-visible:ring-0' placeholder='Enter Questions about the media uploaded' />

                            <div className='flex space-x-2 items-center absolute right-0 top-0'>
                                <button onClick={async () => {
                                    if (input === "") {
                                        setError("Enter a prompt");
                                        return;
                                    }
                                    if (imagesrc === "" && videosrc === "") {
                                        setError("Enter a media");
                                        return
                                    }
                                    if (imagesrc !== "") {
                                        setInput("based on the image uploaded :" + input)
                                        uploadFileToOpenai()
                                    }
                                    if (videosrc !== "") {
                                        setLoad(true)
                                        let newDescription = '';
                                        setMessages([...messages, { id: "id", content: videosrc, role: "data" }])
                                        let description = await getVideoDescription(setProgress, setResponse, videosrc, newDescription)
                                        setInput("yessss" + input)
                                        setInput(`$@@ this  is the description of the video uploaded : ${newDescription} and this is the prompt of the user: $@@` + input);
                                        setTimeout(() => {
                                            document.getElementById('closeDialog')?.click();
                                            submitMessage()
                                        }, 3000);
                                        setLoad(false)
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