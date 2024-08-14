import axios from 'axios';

export const addMessageLeft = async (id: any, jwt: any, messageLeft: any) => {
  try {
    const updateMessage = await axios.put(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/chats/${id}`,
      {
        data: {
          messagesLeft: messageLeft,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return updateMessage;
  } catch (error) {
    console.error('this is the error', error);
  }
};

function getCurrentFormattedTime() {
  const currentDate = new Date();
  // currentDate.setHours(1, 0, 0, 0);
  const isoDate = currentDate.toISOString();
  return isoDate;
}

export const createChat = async (id: any, jwt: any, profileId: any) => {
  try {
    let idd = parseInt(id);
    const data = {
      data: {
        coach: idd,
        client_profile: profileId,
        last_chated: getCurrentFormattedTime(),
        sent: false,
        paid: false,
      },
    };

    const updateChallenge = await axios.post(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/chats`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return updateChallenge;
  } catch (error) {
    console.error(error);
  }
};

export const UpdateChat = async (
  id: any,
  jwt: any,
  profileId: any,
  chatId: any
) => {
  try {
    let idd = parseInt(id);
    const data = {
      data: {
        coach: idd,
        client_profile: profileId,
        last_chated: getCurrentFormattedTime(),
        sent: false,
      },
    };

    const updateChallenge = await axios.put(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/chats/${chatId}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return updateChallenge;
  } catch (error) {
    console.error(error);
  }
};

export const createChatt = async (id: any, jwt: any, profileId: any) => {
  try {
    let idd = parseInt(id);
    const data = {
      data: {
        player: idd,
        client_profile: profileId,
        last_chated: getCurrentFormattedTime(),
        sent: false,
        paid: false,
      },
    };

    const updateChallenge = await axios.post(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/chats`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return updateChallenge;
  } catch (error) {
    console.error(error);
  }
};

export const UpdateChatt = async (
  id: any,
  jwt: any,
  profileId: any,
  chatId: any
) => {
  try {
    let idd = parseInt(id);
    const data = {
      data: {
        player: idd,
        client_profile: profileId,
        last_chated: getCurrentFormattedTime(),
        sent: false,
      },
    };

    const updateChallenge = await axios.put(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/chats/${chatId}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return updateChallenge;
  } catch (error) {
    console.error(error);
  }
};

export const sentAlready = async (id: any, jwt: any) => {
  try {
    let idd = parseInt(id);
    const data = {
      data: {
        last_chated: getCurrentFormattedTime(),
        sent: true,
      },
    };

    const updateChallenge = await axios.put(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/chats/${id}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return updateChallenge;
  } catch (error) {
    console.error(error);
  }
};

export const sendNo = async (
  id: any,
  jwt: any,
  name: string,
  days: string,
  chat: any,
  type: string,
  iddd: any
) => {
  try {
    let idd = parseInt(id);
    const data = {
      data: {
        text: `you havent talked to ${name} the last ${days} days. Ask him something`,
        type: type,
        coachId: `${iddd}`,
        accepted: [
          {
            id: `${idd}`,
          },
        ],
      },
    };

    const updateChallenge = await axios.post(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/notifications`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    sentAlready(chat, jwt);

    return updateChallenge;
  } catch (error) {
    console.error(error);
  }
};

export function existsIdInArray<T extends { id: unknown }>(
  arr: T[],
  targetId: unknown
): boolean {
  return arr.some((item) => item.id === targetId);
}

export const followCoach = async (id: any, profileId: any, jwt: any) => {
  try {
    const data = {
      data: {
        coaches: {
          connect: [id],
        },
      },
    };

    const followCoach = await axios.put(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/client-profiles/${profileId}?populate[0]=coaches.club.logo&populate[1]=coaches.picture`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return followCoach;
  } catch (error) {
    console.error(error);
  }
};

export const followPlayer = async (id: any, profileId: any, jwt: any) => {
  try {
    const data = {
      data: {
        players: {
          connect: [id],
        },
      },
    };

    const followCoach = await axios.put(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/client-profiles/${profileId}?populate[0]=players.club.logo&populate[1]=players.picture`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return followCoach;
  } catch (error) {
    console.error(error);
  }
};
