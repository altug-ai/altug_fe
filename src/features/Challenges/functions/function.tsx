import { fetcher } from "@/lib/functions";
import axios from "axios";


export const acceptChallenge = async (id: any, profileId: any, jwt: any) => {
    try {
        const data = {
            data: {
                accepted: {
                    connect: [profileId],
                },
            },
        };

        const updateChallenge = await axios.put(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/challenges/${id}`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
            }
        );

        return updateChallenge
    } catch (error) {
        console.error(error);
    }
}

export const processNots = async (dat: any, profileId: any, jwt: any) => {
    try {
        const data = {
            data: {
                client_profile: {
                    connect: [profileId],
                },
                text: "just passed you on the leaderboard",
                type: "Leaderboard",
                accepted: [
                    {
                        "id": `${dat?.id}`
                    }
                ]
            },
        };

        const updateNots = await axios.post(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/notifications`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
            }
        );

        return updateNots
    } catch (error) {
        console.error(error);
    }

}

export const sendLeaderboardNots = async (jwt: any, totalpoints: any, points: any, profileId: any) => {
    try {
        let newpoint = totalpoints + points

        let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/client-profiles?sort=total_point:DESC&filters[total_point][$lt]=${newpoint}&filters[total_point][$gt]=${totalpoints}`;
        const personal = await fetcher(
            url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
            }
        );

        if (personal?.data && personal?.data?.length > 0) {

            const batchPromises = personal?.data?.map((data: any) => {
                return processNots(data, profileId, jwt);
            });

            await Promise.all(batchPromises);

            return "True";
        } else {
            return "False"
        }

    } catch (error) {
        return "Error"
    }

}

export const sendNotification = async (id: any, profileId: any, jwt: any, slug: any) => {
    try {
        let idd = parseInt(id)
        const data = {
            data: {
                client_profile: {
                    connect: [profileId],
                },
                text: "accepted your challenge invite",
                type: "Accept",
                coachId: slug,
                accepted: [
                    {
                        "id": `${idd}`
                    }
                ]
            },
        };

        const updateChallenge = await axios.post(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/notifications`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
            }
        );

        return updateChallenge
    } catch (error) {
        console.error(error);
    }
}



