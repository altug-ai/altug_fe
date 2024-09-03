import { AuthContext } from '@/context/AuthContext';
import { LeaderboardContext } from '@/context/LeaderboardContext';
import { fetcher } from '@/lib/functions';
import { useCallback, useContext, useEffect, useState } from 'react';



export function useGetLeaderboard() {
    const { profileId, jwt, leagues, totalPoint } = useContext(AuthContext)
    const { country, league } = useContext(LeaderboardContext)
    const [data, setData] = useState<any>([]);
    const [allIds, setAllIds] = useState(new Set());
    const [allData, setAllData] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(25);  // Adjust the page size as needed
    const [hasMore, setHasMore] = useState(true);

    const getLeaderboard = useCallback(async (pageNumber = 1) => {
        setLoading(true);
        let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/client-profiles?sort=total_point:DESC&populate[0]=profile_pic&pagination[page]=${pageNumber}&pagination[pageSize]=${pageSize}`;

        if (country && country !== "all" && country !== "") {
            url += `&filters[country][$eq]=${country}`;
        }

        if (league && league !== "leagueAll" && league !== "") {
            const leagueMin: any = {};
            const leagueMax: any = {};

            for (const item of leagues) {
                const { title, min, max } = item.attributes;
                leagueMin[title] = min;
                leagueMax[title] = max;
            }

            const min = leagueMin[league] || 0;
            const max = leagueMax[league] || null;

            if (max === null) {
                url += `&filters[total_point][$gte]=${min}`;
            } else {
                url += `&filters[total_point][$gte]=${min}&filters[total_point][$lte]=${max}`;
            }
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
            setData((prevData: any) => {
                const idMap = new Map(prevData.map((item: any) => [item.id, item]))

                const updatedSet = new Set(allIds);
                [...prevData, ...personal.data.filter((item: any) => !idMap.has(item.id))]?.forEach((dat: any) => {
                    updatedSet.add(dat.id);
                });
                setAllIds(updatedSet);

                return [...prevData, ...personal.data.filter((item: any) => !idMap.has(item.id))];
            });
            setAllData(personal);
            setHasMore(pageNumber < personal.meta.pagination.pageCount);
        }

        setLoading(false);
    }, [profileId, jwt, country, league, pageSize]);


    useEffect(() => {
        if (jwt && profileId && hasMore) {
            getLeaderboard(page);
        }
    }, [jwt, profileId, page, country, league]);


    useEffect(() => {
        if (jwt && profileId) {
            setHasMore(true)
            setPage(1)
            setData([])
            getLeaderboard(page);
        }
    }, [country, league])

    const loadMore = () => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    return { data, loading, allData, allIds, loadMore, hasMore, setData };
}
