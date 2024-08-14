import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { fetcher } from '@/lib/functions';
import { ChallengeContext } from '@/context/ChallengeContext';



export function useGetAcceptedChallenges() {
    const { profileId, jwt } = useContext(AuthContext)
    const { challengeLoader } = useContext(ChallengeContext);
    const [data, setData] = useState<any>([]);
    const [allIds, setAllIds] = useState(new Set());
    const [allData, setAllData] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function getAcceptedChallenges() {
            setLoading(true);


            const personal = await fetcher(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/client-profiles/${profileId}?populate[0]=challenges.video&populate[1]=challenges.accepted.profile_pic&populate[2]=challenges.banner`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )

            if (personal?.data) {
                await setData(personal?.data?.attributes?.challenges?.data);
                setAllData(personal);

                //     const updatedSet = new Set(allIds);
                //     await personal?.data?.map(async (dat: any) => {
                //         updatedSet?.add(dat?.id);
                //     });
                //     setAllIds(updatedSet);


            }

            setLoading(false);
        }

        if (jwt && profileId) {
            getAcceptedChallenges();
        }
    }, [profileId, challengeLoader, jwt]);

    return { data, loading, allData, allIds };
}
