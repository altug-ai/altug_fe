import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { fetcher } from '@/lib/functions';
import { ChallengeContext } from '@/context/ChallengeContext';

export function useGetSubmittedChallenges(day = 7) {
    const { profileId, jwt } = useContext(AuthContext);
    const { challengeLoader } = useContext(ChallengeContext);
    const [data, setData] = useState<any>([]);
    // const [allIds, setAllIds] = useState(new Set());
    const [allData, setAllData] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);

    const initialStats = {
        accuracy: 0,
        shooting: 0,
        defense: 0,
        strength: 0,
        stamina: 0,
        passing: 0
    };
    const [stats, setStats] = useState<any>(initialStats);

    const getSubmittedChallenges = useCallback(async () => {
        setLoading(true);
        const currentDate = new Date();
        const daysAgo = new Date();
        daysAgo.setDate(currentDate.getDate() - day);

        const isoCurrentDate = currentDate.toISOString();
        const isoDaysAgo = daysAgo.toISOString();

        let page = 1;
        const pageSize = 25;
        let hasMore = true;
        let allFetchedData: any[] = [];
        let allIds = new Set();
        let updatedStats: any = { ...initialStats };

        while (hasMore) {
            try {
                const personal = await fetcher(
                    `${process.env.NEXT_PUBLIC_STRAPI_URL}/submitted-challenges?sort=id:DESC&filters[client_profile][id][$eq]=${profileId}&filters[updatedAt][$gte]=${isoDaysAgo}&filters[updatedAt][$lte]=${isoCurrentDate}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                );

                if (personal?.data) {
                    // Filter out duplicates and accumulate data
                    const newData = personal.data.filter((item: any) => !allIds.has(item.id));
                    allFetchedData = [...allFetchedData, ...newData];

                    newData.forEach((item: any) => {
                        allIds = new Set(allIds).add(item.id)
                    });

                    // Update stats
                    newData.forEach((data: any) => {
                        let stat = data?.attributes?.stat;
                        let point = data?.attributes?.points ?? 0;
                        updatedStats[stat] = (updatedStats[stat] || 0) + parseInt(point);
                    });

                    setAllData(personal);

                    // Check if there are more pages to fetch
                    hasMore = page < personal.meta.pagination.pageCount;
                    page++;
                } else {
                    hasMore = false;
                }
            } catch (error) {
                console.error('Error fetching submitted challenges:', error);
                hasMore = false;
            }
        }

        setData(allFetchedData);
        setStats(updatedStats);
        setLoading(false);
    }, [profileId, jwt, day]);

    useEffect(() => {
        if (jwt && profileId) {
            getSubmittedChallenges();
        }
    }, [profileId, challengeLoader, jwt, day]);

    return { data, loading, allData, stats, setStats };
}
