import { fetcher } from "@/lib/functions";

export const checkTask = async (challengeId: number, profileId: any, jwt: any) => {
    try {
        let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/submitted-challenges?filters[challenge][id][$eq]=${challengeId}&filters[client_profile][id][$eq]=${profileId}&fields[0]=points`

        const personal = await fetcher(
            url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
            }
        );

        if (personal?.data && personal?.data?.length > 0 && personal?.data[0]?.id) {
            return true
        } else {
            return false
        }

    } catch (error) {
        console.error("this is the error", error)
    }
}