import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { fetcher } from '@/lib/functions';



export function useGetOnboardingAnswers() {
    const { profileId, jwt } = useContext(AuthContext)
    const [data, setData] = useState([]);
    const [allIds, setAllIds] = useState(new Set());
    const [allData, setAllData] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [reload, setReload] = useState<boolean>(false);


    useEffect(() => {
        async function getOnboardingAnswers() {
            setLoading(true);
            let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/onboarding-answers?filters[client_profile][id][$eq]=${profileId}&populate[0]=onboarding_question`

            const personal = await fetcher(
                url,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )

            if (personal?.data) {
                await setData(personal?.data);

            }

            setLoading(false);
        }


        getOnboardingAnswers();

    }, [jwt, profileId, reload]);

    return { data, loading, allData, allIds, reload, setReload };
}
