import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { fetcher } from '@/lib/functions';

export function useGetNotifications() {
    const { profileId, jwt, published } = useContext(AuthContext);
    const [data, setData] = useState<any>([]);
    const [allIds, setAllIds] = useState(new Set());
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(25);  // Adjust the page size as needed
    const [hasMore, setHasMore] = useState(true);

    const getNotifications = useCallback(async (pageNumber = 1) => {
        setLoading(true);
        const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/notifications?sort=id:DESC&filters[createdAt][$gt]=${published}&filters[$or][0][type][$eq]=${"Coach"}&filters[$or][1][type][$eq]=${"Player"}&filters[$or][2][type][$eq]=${"Challenge"}&filters[$or][3][accepted][$containsi]=${`"id": "${profileId}"`}&populate[0]=client_profile&pagination[page]=${pageNumber}&pagination[pageSize]=${pageSize}`;

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

            // Update hasMore based on pagination info
            setHasMore(pageNumber < personal.meta.pagination.pageCount);
        }

        setLoading(false);
    }, [jwt, pageSize, profileId, published]);

    useEffect(() => {
        if (jwt && profileId && hasMore) {
            getNotifications(page);
        }
    }, [jwt, profileId, page, getNotifications]);

    const loadMore = () => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    return { loading, data, allIds, loadMore, hasMore };
}
