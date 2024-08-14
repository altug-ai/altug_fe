"use client";
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import TopProfile from '../Coach/components/TopProfile'
import Highlights from '../Coach/components/Highlights'
import TacticStyle from '../Coach/components/TacticStyle'
import FavoriteQuote from '../Coach/components/FavoriteQuote'
import Header from '../Coach/components/Header'
import { useParams } from "next/navigation";
import { AuthContext } from '@/context/AuthContext';
import { fetcher } from '@/lib/functions';
import { TbLoader3 } from 'react-icons/tb';

type Props = {}

const Player = (props: Props) => {
    const params = useParams();
    const { slug }: any = params;
    const { jwt, loading: loader } = useContext(AuthContext)
    const [data, setData] = useState<any>({})
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const getPlayer = async (slug: any) => {
            setLoading(true);
            return fetcher(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/players/${slug}?populate[0]=profile`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
                .then((data) => {
                    setData(data?.data)
                    setLoading(false);
                })
                .catch((error) => {
                    console.log("An error occured", error);
                });
        };

        if (slug && jwt) {
            getPlayer(slug);
        }
    }, [slug, jwt]);




    return (
        <div className='py-[20px] px-[20px] h-full flex flex-col items-center '>


            {/* the header */}
            <Header />
            {
                (loader || loading) && (
                    <div className='max-w-[388px] w-full my-[30px] flex justify-center'>
                        <TbLoader3 className="text-white w-10 h-10 animate-spin" />
                    </div>
                )
            }

            {/* the top profile information */}
            <TopProfile id={slug} club={data?.attributes?.club?.data?.attributes?.name} foot={data?.attributes?.foot} position={data?.attributes?.position} DOB='' height={data?.attributes?.height} weight={data?.attributes?.weight} profilepic={data?.attributes?.profile?.data?.attributes?.url ?? data?.attributes?.pic_url} name={data?.attributes?.name} />

            {/* Career Highlights */}
            {
                data?.attributes?.highlight?.length > 0 && (
                    <Highlights data={data?.attributes?.highlight} />
                )
            }

            {/* Tactic Style */}
            {
                data?.attributes?.tactics?.length > 0 && (
                    <TacticStyle data={data?.attributes?.tactics} />
                )
            }

            {/* Favorite Quote */}
            {
                data?.attributes?.favourite_quotes?.length > 0 && (
                    <FavoriteQuote url={data?.attributes?.profile?.data?.attributes?.url ?? data?.attributes?.pic_url} data={data?.attributes?.favourite_quotes} />
                )
            }


        </div>
    )
}

export default Player