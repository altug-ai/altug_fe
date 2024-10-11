import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { fetcher } from '@/lib/functions';
import { CoachContext } from '@/context/CoachContext';



export function useGetSubmitted(id: string | string[]) {
    const { profileId, jwt } = useContext(AuthContext)
    const { coachLoader } = useContext(CoachContext);
    const [data, setData] = useState<any>([]);
    const [allIds, setAllIds] = useState(new Set());
    const [allData, setAllData] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(25);  // Adjust the page size as needed
    const [hasMore, setHasMore] = useState(true);

    const getSubmitted = useCallback(async (pageNumber = 1) => {
        setLoading(true);
        let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/submitted-challenges?sort=id:DESC&filters[challenge][id][$eq]=${id}&populate[0]=video&populate[1]=client_profile.profile_pic&populate[2]=challenge&pagination[pageSize]=${pageSize}&pagination[page]=${page}`;


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

            setAllData(personal);

        }

        setLoading(false);
    }, [profileId, coachLoader, jwt, pageSize, id]);

    useEffect(() => {
        if (jwt && profileId && hasMore) {
            getSubmitted(page);
        }
    }, [profileId, coachLoader, jwt, page, id])

    const loadMore = () => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };


    return { data, loading, allData, allIds, hasMore, loadMore };
}
