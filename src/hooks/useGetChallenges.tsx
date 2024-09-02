import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { fetcher } from '@/lib/functions';
import { ChallengeContext } from '@/context/ChallengeContext';



export function useGetChallenges(id?: string | string[]) {
    const { profileId, jwt } = useContext(AuthContext)
    const { challengeLoader, refetch, setStat, setPoint, setDescriptionn, setHeader, setGoal, setUrlVideo, setVideoUrl, setVideoBlob } = useContext(ChallengeContext);
    const [data, setData] = useState<any>([]);
    const [allIds, setAllIds] = useState(new Set());
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);  // Adjust the page size as needed
    const [hasMore, setHasMore] = useState(true);
    const [allData, setAllData] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);

    const getChallenge = useCallback(async (pageNumber = 1) => {
        setLoading(true);
        let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/challenges?sort=id:DESC&populate[0]=video&populate[1]=accepted.profile_pic&populate[2]=client_profile&populate[3]=submitted_challenges.video&populate[4]=submitted_challenges.client_profile.profile_pic&populate[5]=banner&pagination[page]=${pageNumber}&pagination[pageSize]=${pageSize}`

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
            if (id) {
                await setData(personal?.data);
            } else {
                setData((prevData: any) => {
                    const idMap = new Map(prevData.map((item: any) => [item.id, item]))

                    const updatedSet = new Set(allIds);
                    [...prevData, ...personal.data.filter((item: any) => !idMap.has(item.id))]?.forEach((dat: any) => {
                        updatedSet.add(dat.id);
                    });
                    setAllIds(updatedSet);

                    return [...prevData, ...personal.data.filter((item: any) => !idMap.has(item.id))];
                });
                setHasMore(pageNumber < personal.meta.pagination.pageCount);
            }

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


        }

        setLoading(false);
    }, [profileId, challengeLoader, jwt, id, refetch, pageSize]);

    useEffect(() => {
        if (jwt && profileId && hasMore) {
            getChallenge(page);
        }
    }, [profileId, challengeLoader, jwt, id, refetch, page])


    const loadMore = () => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    return { data, loading, allData, allIds, loadMore, hasMore, };
}
