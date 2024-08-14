import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { fetcher } from '@/lib/functions';
import { ChallengeContext } from '@/context/ChallengeContext';
import { LeaderboardContext } from '@/context/LeaderboardContext';



export function useGetLeaderboard() {
    const { profileId, jwt, leagues, totalPoint } = useContext(AuthContext)
    const { country, league } = useContext(LeaderboardContext)
    const [data, setData] = useState<any>([]);
    const [allIds, setAllIds] = useState(new Set());

    const [allData, setAllData] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function getLeaderboard() {
            setLoading(true);
            let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/client-profiles?sort=total_point:DESC&populate[0]=profile_pic`;

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
                await setData(personal?.data);
                setAllData(personal);
                const updatedSet = new Set(allIds);
                await personal?.data?.map(async (dat: any) => {
                    updatedSet?.add(dat?.id);
                });
                setAllIds(updatedSet);
            }

            setLoading(false);
        }

        if (jwt && profileId) {
            getLeaderboard();
        }
    }, [profileId, jwt, country, league]);

    return { data, loading, allData, allIds };
}
