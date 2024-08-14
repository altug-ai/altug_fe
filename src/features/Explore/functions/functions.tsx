import { fetcher } from "@/lib/functions";

const getCoach = async (slug: any, profileId: any, jwt: any) => {
    return fetcher(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/chats?filters[client_profile][$eq]=${profileId}&filters[coach][id][$eq]=${slug}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
        }
    )
        .then((data) => {
            console.log("here", data?.data[0])
        })
        .catch((error) => {
            console.log("An error occured", error);
        });
};