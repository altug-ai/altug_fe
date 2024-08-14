import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { fetcher } from '@/lib/functions';
import { CoachContext } from '@/context/CoachContext';



export function useGetOnboardingQuestions() {
    const { profileId, jwt, roleId } = useContext(AuthContext)
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [reload, setReload] = useState<boolean>(false);

    useEffect(() => {
        async function getOnboarding() {
            setLoading(true);
            let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/onboarding-questions?filters[user_role][id][$eq]=${roleId}&populate[0]=options`

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

        if (jwt && profileId) {
            getOnboarding();
        }
    }, [profileId, jwt, reload]);

    return { data, loading, reload, setReload };
}
