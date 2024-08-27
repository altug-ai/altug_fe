import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { fetcher } from '@/lib/functions';
import { ChallengeContext } from '@/context/ChallengeContext';



export function useGetChallenges(id?: string | string[]) {
    const { profileId, jwt } = useContext(AuthContext)
    const { challengeLoader, refetch, setStat, setPoint, setDescriptionn, setHeader, setGoal, setUrlVideo, setVideoUrl, setVideoBlob } = useContext(ChallengeContext);
    const [data, setData] = useState<any>([]);
    const [allIds, setAllIds] = useState(new Set());

    const [allData, setAllData] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function getChallenges() {
            setLoading(true);
            let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/challenges?sort=id:DESC&populate[0]=video&populate[1]=accepted.profile_pic&populate[2]=client_profile&populate[3]=submitted_challenges.video&populate[4]=submitted_challenges.client_profile.profile_pic&populate[5]=banner`

            if (id) {
                url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/challenges/${id}?sort=id:DESC&populate[0]=video&populate[1]=accepted.profile_pic&populate[2]=client_profile&populate[3]=submitted_challenges.video&populate[4]=submitted_challenges.client_profile.profile_pic&populate[5]=banner`
            }

            const personal = await fetcher(
                url,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );

            if (personal?.data) {
                await setData(personal?.data);
                if (id) {
                    setStat(personal?.data?.attributes?.stat)
                    setPoint(personal?.data?.attributes?.points)
                    setHeader(personal?.data?.attributes?.title)
                    setDescriptionn(personal?.data?.attributes?.description)
                    setVideoUrl("")
                    setVideoBlob(null)
                    setUrlVideo(personal?.data?.attributes?.video?.data?.attributes?.url)
                    setGoal(personal?.data?.attributes?.goal)
                }
                setAllData(personal);
                if (!id) {
                    const updatedSet = new Set(allIds);
                    await personal?.data?.map(async (dat: any) => {
                        updatedSet?.add(dat?.id);
                    });
                    setAllIds(updatedSet);
                }

            }

            setLoading(false);
        }

        if (jwt && profileId) {
            getChallenges();
        }
    }, [profileId, challengeLoader, jwt, id, refetch]);

    return { data, loading, allData, allIds };
}
