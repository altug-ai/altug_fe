import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { fetcher } from '@/lib/functions';
import { CoachContext } from '@/context/CoachContext';



export function useGetRoles(id?: string | string[]) {
    const { profileId, jwt } = useContext(AuthContext)
    const [data, setData] = useState([]);
    const [allIds, setAllIds] = useState(new Set());
    const [allData, setAllData] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);



    useEffect(() => {
        async function getRoles() {
            setLoading(true);
            let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/user-roles`

            const personal = await fetcher(
                url,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (personal?.data) {
                await setData(personal?.data);

            }

            setLoading(false);
        }


        getRoles();

    }, [jwt, profileId]);

    return { data, loading, allData, allIds };
}
