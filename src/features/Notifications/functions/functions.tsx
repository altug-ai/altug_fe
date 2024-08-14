import { fetcher } from "@/lib/functions";
import axios from "axios";

export const ViewNot = async (id: any, profileId: any, jwt: any) => {
    try {
        const data = {
            data: {
                views: {
                    connect: [profileId],
                },
            },
        };

        const nots = await axios.put(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/notifications/${id}`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
            }
        );

        return nots;
    } catch (error) {
        console.error(error);
    }
};

export const CheckNots = async (id: any, profileId: any, jwt: any) => {
    try {
        let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/notifications?filters[id][$eq]=${id}&filters[views][$eq]=${profileId}`;

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
            return false
        } else {
            return true
        }



    } catch (error) {
        console.error(error);
    }
}




export const readMany = async (
    deleteIds: any,
    jwt: any,
    profileId: any,
    setUnread: any,
    unRead: any,
    reload: boolean,
    setReload: any,
) => {
    let responsee: any = [];
    const deletePromises = Array.from(deleteIds)?.map(async (data: any) => {
        try {

            const response: any = await ViewNot(data, profileId, jwt);
            setUnread(unRead - 1);
        } catch (error) {
            console.log('an error occured :', error);
        }
    });

    await Promise.allSettled(deletePromises).then((results) => {
        results.forEach((result) => {
            if (result.status === 'fulfilled') {
            } else {
            }
        });
    });

    setReload(!reload)

    return responsee;
};