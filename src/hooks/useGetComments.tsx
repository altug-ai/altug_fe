import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { fetcher } from '@/lib/functions';
import { CoachContext } from '@/context/CoachContext';
import { Comment } from '@/context/types';



export function useGetComments(id?: number) {
    const { profileId, jwt } = useContext(AuthContext)
    const [data, setData] = useState<Comment[]>([]);
    const [allIds, setAllIds] = useState(new Set());
    const [allData, setAllData] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [reload, setReload] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(25);  // Adjust the page size as needed
    const [hasMore, setHasMore] = useState(true);
    const [likes, setLikes] = useState<number[]>([])

    const getComments = useCallback(async (pageNumber = 1) => {
        if (!id) {
            return
        }
        setLoading(true);
        let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/comments?sort=id:ASC&filters[submitted_challenge][id][$eq]=${id}&populate[0]=client_profile.profile_pic&populate[1]=likes&populate[2]=coach&populate[3]=player&populate[4]=likes&pagination[page]=${pageNumber}&pagination[pageSize]=${pageSize}`

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
        setHasMore(true)
        setPage(1);
    }, [reload])

    const loadMore = () => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };


    return { data, loading, allData, allIds, reload, setReload, hasMore, loadMore, likes, setLikes, setData };
}
