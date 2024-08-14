"use client";
import { Input } from '@/components/ui/input';
import { OnboardingContext } from '@/context/Onboarding';
import Image from 'next/image'
import React, { useContext, useRef, useState } from 'react'
import { IoMdClose } from "react-icons/io";
type Props = {
    onClick?: any;
}
type Keywords = Array<string>;

const KeywordInputs = ({ onClick }: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [keywords, setKeywords] = useState<Keywords>([]);
    const { form, setForm, formIndex } = useContext(OnboardingContext)

    const handleEvent = async (newKeyword: string, event: any) => {
        if (!keywords.includes(newKeyword)) {
            setKeywords([...keywords, newKeyword]);
        }
        (event.target as HTMLInputElement).value = ""; // Clear the input field after adding
    }


    const handleDeleteKeyword = (index: number) => {
        // Guard clause to prevent out-of-bounds errors
        if (index < 0 || index >= keywords.length) {
            return; // Silently handle invalid index
        }
        const newKeywords = [...keywords]; // Create a copy to avoid mutation
        let bug = newKeywords.splice(index, 1); // Remove the element at the specified index

        setKeywords(newKeywords);;
    };


    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        const newKeyword = (event.target as HTMLInputElement).value.trim(); // Trim leading/trailing spaces

        // console.log("this is the evebt", event)
        // Check if the Enter key was pressed or backspace with empty input and focus on input
        if (event.key === "Enter" && newKeyword) {
            event?.preventDefault();
            handleEvent(newKeyword, event)
        } else if (
            event.key === "Backspace" &&
            !newKeyword &&
            document.activeElement === inputRef.current &&
            (event.target as HTMLInputElement).value.length === 0
        ) {
            // If backspace is pressed with empty input and focus on input, delete the most recent keyword
            const lastIndex = keywords.length - 1;
            if (lastIndex >= 0) {
                handleDeleteKeyword(lastIndex);
            }
        }
    };

    return (
        <div className="rounded-r-[49px] rounded-l-[49px] flex mt-1  items-center bg-white w-full ">
            
            {keywords?.map((keyword, index) => (
                <div
                    key={`${keyword} ${index}`}
                    className="px-[14px] mx-2 h-[48px] rounded-[49px] line-clamp-1  py-[10px] border bg-[#357EF8] text-white flex items-center space-x-3"
                >
                    <h1 className="text-ravinna text-[14px] line-clamp-1 font-medium leading-[20px] break-all">
                        {keyword}
                    </h1>
                    <IoMdClose onClick={() => handleDeleteKeyword(index)} className="w-[16.5px] border-none mr-3 h-[16.5px] cursor-pointer" />

                </div>
            ))}


            <Input
                ref={inputRef}
                // value={(keywords as string[]).join(", ") ?? ""}
                className='rounded-l-[49px] text-[16px] rounded-r-[49px] h-[48px] border-none'
                onKeyDown={handleKeyDown}
                placeholder={"Enter your favorite players"}
            />

            <button onClick={() => {
                setForm({
                    ...form,
                    [formIndex]: keywords
                })
                onClick();
            }} type='button'>
                <Image src={"/onboard/send.png"} alt='send icon' width={500} height={500} className='h-[48px] w-[48px] cursor-pointer absolute right-0 top-0' />
            </button>

        </div>
    )
}

export default KeywordInputs