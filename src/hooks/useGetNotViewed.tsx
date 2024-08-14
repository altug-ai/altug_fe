import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { fetcher } from '@/lib/functions';



export function useGetNotViewed() {
    const { profileId, jwt, setUnRead, unRead, published, reloadRead } = useContext(AuthContext)
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        async function getNotifications() {
            setLoading(true);
            let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/notifications?sort=id:DESC&filters[createdAt][$gt]=${published}&pagination[pageSize]=1&filters[views][$eq]=${profileId}&filters[$or][0][type][$eq]=${"Coach"}&filters[$or][1][type][$eq]=${"Player"}&filters[$or][2][type][$eq]=${"Challenge"}&filters[$or][3][accepted][$containsi]=${`"id": "${profileId}"`}`;
            let url2 = `${process.env.NEXT_PUBLIC_STRAPI_URL}/notifications?sort=id:DESC&filters[createdAt][$gt]=${published}&pagination[pageSize]=1&filters[$or][0][type][$eq]=${"Coach"}&filters[$or][1][type][$eq]=${"Player"}&filters[$or][2][type][$eq]=${"Challenge"}&filters[$or][3][accepted][$containsi]=${`"id": "${profileId}"`}`;
            let url3 = `${process.env.NEXT_PUBLIC_STRAPI_URL}/notifications?sort=id:DESC&pagination[pageSize]=1&filters[client_profile][id][$eq]=${profileId}&filters[accepted][$containsi]=${`"id": "${profileId}"`}`
            const Views = await fetcher(
                url,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );

            const AllViews = await fetcher(
                url2,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );

            const getRedundants = await fetcher(
                url3,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            let views = AllViews?.meta?.pagination?.total - Views?.meta?.pagination?.total - getRedundants?.meta?.pagination?.total

            if (views < 0) {
                views = 0
            }

            setUnRead(views)
            setLoading(false);
        }
        if (jwt && profileId) {
            getNotifications();
        }
    }, [profileId, jwt, reloadRead]);

    return { loading, data: unRead };
}
