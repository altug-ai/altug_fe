import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { fetcher } from '@/lib/functions';
import { CoachContext } from '@/context/CoachContext';



export function useGetCoaches(id?: string | string[]) {
    const { profileId, jwt } = useContext(AuthContext)
    const { coachLoader } = useContext(CoachContext);
    const [data, setData] = useState([]);
    const [allIds, setAllIds] = useState(new Set());
    const [allData, setAllData] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function getCoaches() {
            setLoading(true);
            let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/coaches?sort=id:DESC&populate[0]=profile&populate[1]=club.logo`

            if (id) {
                url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/coaches/${id}?sort=id:DESC&populate[0]=profile&populate[1]=club.logo`
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
                    await updatedSet?.add(dat?.id);
                });
                setAllIds(updatedSet);
            }

            setLoading(false);
        }

        if (jwt && profileId) {
            getCoaches();
        }
    }, [profileId, coachLoader, jwt]);

    return { data, loading, allData, allIds };
}
