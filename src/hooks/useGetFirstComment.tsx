import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { fetcher } from '@/lib/functions';
import { CoachContext } from '@/context/CoachContext';
import { Comment } from '@/context/types';



export function useGetFirstComments(id?: number) {
    const { profileId, jwt } = useContext(AuthContext)
    const [data, setData] = useState<Comment[]>([]);
    const [allIds, setAllIds] = useState(new Set());
    const [allData, setAllData] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [reload, setReload] = useState<boolean>(false);


    useEffect(() => {
        async function getComments() {
            setLoading(true);
            let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/comments?sort=id:ASC&filters[submitted_challenge][id][$eq]=${id}&populate[0]=client_profile.profile_pic&populate[1]=likes&populate[2]=coach&populatep[3]=player&pagination[pageSize]=${1}`

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

            }

            setLoading(false);
        }

        if (id) {
            getComments();
        }


    }, [jwt, profileId, reload]);

    return { data, loading, allData, allIds, reload, setReload };
}
