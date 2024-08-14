import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { fetcher } from '@/lib/functions';
import { ChallengeContext } from '@/context/ChallengeContext';
import { Stat } from '@/context/types';

export function useGetSubmittedChallenges(day = 7) {
    const { profileId, jwt } = useContext(AuthContext);
    const { challengeLoader } = useContext(ChallengeContext);
    const [data, setData] = useState<any>([]);
    const [allIds, setAllIds] = useState(new Set());
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

    useEffect(() => {
        let isMounted = true; // Flag to check if component is mounted

        async function getSubmittedChallenges() {
            setLoading(true);
            setStats(initialStats); // Reset stats before fetching new data

            const currentDate = new Date();
            const daysAgo = new Date();
            daysAgo.setDate(currentDate.getDate() - day);

            // Format dates to ISO 8601 format
            const isoCurrentDate = currentDate.toISOString();
            const isoDaysAgo = daysAgo.toISOString();

            try {
                const personal = await fetcher(
                    `${process.env.NEXT_PUBLIC_STRAPI_URL}/submitted-challenges/?filters[client_profile][id][$eq]=${profileId}&filters[createdAt][$gte]=${isoDaysAgo}&filters[createdAt][$lte]=${isoCurrentDate}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                );

                if (isMounted && personal?.data) {
                    setData(personal?.data);

                    // console.log("the data", personal?.data)

                    // Calculate new stats based on fetched data
                    const newStats = personal.data.reduce((acc: any, data: any) => {
                        let stat = data?.attributes?.stat;
                        let point = data?.attributes?.points ?? 0;
                        acc[stat] = (acc[stat] || 0) + parseInt(point);
                        return acc;
                    }, initialStats);

                    setStats(newStats);
                    setAllData(personal);
                }

            } catch (error) {
                console.error('Error fetching submitted challenges:', error);
            }

            setLoading(false);
        }

        if (jwt && profileId) {
            getSubmittedChallenges();
        }

        // Cleanup function to reset stats if component unmounts or profileId/day changes
        return () => {
            isMounted = false;
            setStats(initialStats);
        };
    }, [profileId, challengeLoader, jwt, day]);

    return { data, loading, allData, allIds, stats, setStats };
}
