import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { fetcher } from '@/lib/functions';
import { Comment, Task } from '@/context/types';
import { LeaderboardContext } from '@/context/LeaderboardContext';



export function useGetDoneTasks() {
    const { profileId, jwt } = useContext(AuthContext)
    const [data, setData] = useState<Task[]>([]);
    const [allIds, setAllIds] = useState(new Set());
    const [allData, setAllData] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [reload, setReload] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(25);  // Adjust the page size as needed
    const [hasMore, setHasMore] = useState(true);
    const [likes, setLikes] = useState<number[]>([])
    const { setReload: setR, reload: re } = useContext(LeaderboardContext)

    const getComments = useCallback(async (pageNumber = 1) => {

        setLoading(true);
        let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/tasks?filters[completed][id][$eq]=${profileId}&populate[0]=completed&populate[1]=claimed&populate[2]=challenge`

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
                [...prevData, ...personal?.data?.filter((item: any) => !idMap.has(item.id))]?.forEach((dat: any) => {
                    updatedSet.add(dat.id);
                });
                setAllIds(updatedSet);

                return [...prevData, ...personal?.data?.filter((item: any) => !idMap.has(item.id))];
            });
            setHasMore(pageNumber < personal.meta.pagination.pageCount);
            setAllData(personal);

        }

        
        setLoading(false);
    }, [profileId, jwt, pageSize]);


    useEffect(() => {
        if (jwt && profileId && hasMore) {
            getComments(page);
        }
    }, [profileId, jwt, page, hasMore])

    useEffect(() => {
        setData([])
        setHasMore(true)
        setPage(1);
    }, [reload, re])

    const loadMore = () => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };


    return { data, loading, allData, allIds, reload, setReload, hasMore, loadMore, likes, setLikes };
}
