import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthContext } from '@/context/AuthContext'
import Image from 'next/image'
import React, { useContext, useState } from 'react'
import { useToast } from "@/components/ui/use-toast";
import { TbLoader3 } from 'react-icons/tb'
import axios from 'axios'
import { fetcher } from '@/lib/functions'

type Props = {}

const ProfilePicture = (props: Props) => {
    const { profilepic, jwt, profileId, setReload, reload, totalPoint } = useContext(AuthContext)
    const [fileSizeError, setFileSizeError] = useState<string>('');
    const [image, setImage] = useState();
    const [imagesrc, setImagesrc] = useState<string>();
    const [loader, setLoader] = useState<boolean>(false)
    const { toast } = useToast();

    const updateProfilePic = async (image: any) => {
        if (image) {

            setLoader(true);
            const body = new FormData();
            body.append("files", image);

            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_STRAPI_URL}/upload/`,
                    body,
                    {
                        headers: {
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                );

                if (response) {
                    const data = {
                        profile_pic: response.data[0].id,
                    };
                    const res = await fetcher(
                        `${process.env.NEXT_PUBLIC_STRAPI_URL}/client-profiles/${profileId}`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${jwt}`,
                            },
                            body: JSON.stringify({
                                data: data,
                            }),
                            method: "PUT",
                        }
                    );
                    setLoader(false);
                    if (setReload) {
                        setReload(!reload);
                    }

                    toast({
                        description: "Profile pic changed successfully",
                    });
                } else {
                    setLoader(false);
                }
            } catch (error) {
                setLoader(false);
                toast({
                    variant: "destructive",
                    description: "Something went wrong",
                });
            }
        }
    }

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                // File size is greater than 2 MB
                setFileSizeError('File size should not exceed 2 MB.');
                toast({
                    variant: "destructive",
                    description: "File size should not exceed 2 MB.",
                });
            } else {
                // File size is within the limit

                setImage(file);
                setFileSizeError('');
                const reader = new FileReader();
                reader.onload = (event: any) => {
                    setImagesrc(event.target.result as string);
                };
                reader.readAsDataURL(file);
                updateProfilePic(file)
            }
        }
    };



    return (
        <div className='w-full max-w-[388px] flex justify-between items-center my-[30px]'>
            <div className='relative'>
                <Image src={imagesrc ? imagesrc : profilepic ? profilepic : "/profile/unknownp.png"} width={500} height={500} alt='profile pic' className='w-[80px] h-[80px] object-cover object-top rounded-full' />


                <Label htmlFor="picture" className='text-[14px] leading-[22px] font-normal  '>

                    {loader ? (
                        <TbLoader3 className="text-white w-7 h-7 animate-spin absolute bottom-0 right-0" />
                    ) : (
                        <Image src={"/profile/edit.png"} width={200} height={200} alt='edit png' className='h-[40px] w-[40px] absolute bottom-0 right-0' />
                    )}
                </Label>

                <Input
                    id='picture'
                    type='file'
                    name='files'
                    className='h-20 w-52'
                    accept='image/*'
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
            </div>

            <div className='  h-[110.81px] w-[100.56px] bg-cover flex flex-col items-center justify-center' style={{ backgroundImage: 'url("/profile/Number.png")' }}>
                <h1 className='font-bold text-[24px] leading-[12.54px]   text-white'>{totalPoint ?? 0}</h1>
            </div>
        </div>
    )
}

export default ProfilePicture