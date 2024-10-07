import { useState, useEffect, useContext, useCallback } from 'react';
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
    const [page, setPage] = useState(1);
    const [pageSize] = useState(25);  // Adjust the page size as needed
    const [hasMore, setHasMore] = useState(true);

    
    const getChallenge = useCallback(async (pageNumber = 1) => {
        setLoading(true);


        const personal = await fetcher(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/challenges?sort=id:DESC&filters[accepted][id][$eq]=${profileId}&populate[0]=video&populate[1]=accepted.profile_pic&populate[2]=client_profile&populate[3]=submitted_challenges.video&populate[4]=submitted_challenges.client_profile.profile_pic&populate[5]=banner&populate[6]=liked&pagination[page]=${pageNumber}&pagination[pageSize]=${pageSize}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
            }
        )

        if (personal?.data) {
            // console.log("here is the personal", personal)
            setData((prevData: any) => {
                const idMap = new Map(prevData.map((item: any) => [item.id, item]))

                const updatedSet = new Set(allIds);
                [...prevData, ...personal?.data?.filter((item: any) => !idMap.has(item.id))]?.forEach((dat: any) => {
                    updatedSet.add(dat.id);
                });
                setAllIds(updatedSet);

                return [...prevData, ...personal?.data?.filter((item: any) => !idMap.has(item.id))];
            });
            setHasMore(pageNumber < personal.meta.pagination.pageCount);
            setAllData(personal);

            //     const updatedSet = new Set(allIds);
            //     await personal?.data?.map(async (dat: any) => {
            //         updatedSet?.add(dat?.id);
            //     });
            //     setAllIds(updatedSet);


        }

        setLoading(false);
    }, [profileId, challengeLoader, jwt, pageSize]);

    useEffect(() => {

        if (jwt && profileId && hasMore) {
            getChallenge(page);
        }
    }, [profileId, challengeLoader, jwt, page])


    const loadMore = () => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    return { data, loading, allData, allIds, hasMore, loadMore };
}
