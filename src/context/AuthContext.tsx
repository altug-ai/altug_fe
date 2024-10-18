"use client";

import { fetcher } from "@/lib/functions";
import { useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import { AuthProps, Coaches, Players, PreferenceSettings, Profile, Tier, UserData } from "./types";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { sendNo } from "@/features/CoachChat/functions/functions";
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation'


// @ts-ignore
export const AuthContext = createContext<AuthProps>({});

type Props = {
    children: React.ReactNode;
};



function AuthContextProvider({ children }: Props) {
    const { data: session } = useSession();
    const [loading, setLoading] = useState<boolean>(false);
    const [reload, setReload] = useState<boolean>(false)
    const [profileId, setProfileId] = useState<number>();
    const [profileEmail, setProfileEmail] = useState<string>("");
    const router = useRouter()
    const [profilepic, setProfilePic] = useState<string>();
    const [userId, setUserId] = useState<number>();
    const [profile, setProfile] = useState<Profile>();
    const [tier, setTier] = useState<Tier>()
    const [messagesLeft, setMessagesLeft] = useState<number>(5)
    const [user, setUser] = useState<UserData>();
    const [coachIds, setCoachIds] = useState(new Set());
    const [playerIds, setPlayerIds] = useState(new Set());
    const [lastUpdate, setLastUpdate] = useState<any>([])
    const [country, setCountry] = useState<string>("");
    const [totalPoint, setTotalPoint] = useState<string>("")
    const [leagues, setLeagues] = useState<any[]>([])
    const { toast } = useToast();
    const [pref, setPref] = useState<PreferenceSettings>();
    const [coaches, setCoaches] = useState<Coaches>()
    const [players, setPlayers] = useState<Players>()
    const [done, setDone] = useState<boolean>(false)
    const [unRead, setUnRead] = useState<number>(0)
    const [published, setPublished] = useState<any>()
    const [position, setPosition] = useState<string>("")
    const [role, setRole] = useState<string>("")
    const [roleId, setRoleId] = useState<any>()
    const [reloadRead, setReloadRead] = useState<boolean>(false)
    const [stats, setStats] = useState({
        shooting: 0,
        defense: 0,
        strength: 0,
        stamina: 0,
        passing: 0,
        accuracy: 0
    })
    const pathname = usePathname()
    // get the client profile

    // const { profile, prof, agency, user } = useContext(AuthContext)

    const insertStats = async (data: any) => {
        if (data?.shooting) {
            setStats(prev => ({ ...prev, shooting: data.shooting }))
        }
        if (data?.defense) {
            setStats(prev => ({ ...prev, defense: data.defense }))
        }
        if (data?.strength) {
            setStats(prev => ({ ...prev, strength: data.strength }))
        }
        if (data?.stamina) {
            setStats(prev => ({ ...prev, stamina: data.stamina }))
        }
        if (data?.passing) {
            setStats(prev => ({ ...prev, passing: data.passing }))
        }
        if (data?.accuracy) {
            setStats(prev => ({ ...prev, accuracy: data.accuracy }))
        }
    }

    const getPosition = async (data: any) => {
        if (data === "Forward") {
            setPosition("OF")
        } else if (data === "Midfielder") {
            setPosition("MF")
        } else if (data === "Defender") {
            setPosition("DF")
        } else if (data === "Goalkeeper") {
            setPosition("GK")
        }
    }

    useEffect(() => {
        const getUser = async (id: any) => {
            setLoading(true);
            return fetcher(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/client-profiles?filters[user][id][$eq]=${id}&populate[0]=user&populate[1]=profile_pic&populate[2]=preference&populate[3]=coaches.club.logo&populate[4]=coaches.profile&populate[5]=players.club.logo&populate[6]=players.profile&populate[7]=chats.coach&populate[8]=chats.player&populate[9]=user_role`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user.data.jwt}`,
                    },
                }
            )
                .then(async (data) => {
                    // console.log("this is the data", data?.data[0])
                    if (!data?.data[0]?.attributes?.tier) {
                        // setTier("free")
                        setTier("free")
                    } else {
                        setTier(data?.data[0]?.attributes?.tier)
                    }

                    if (!data?.data[0]?.attributes?.messagesLeft) {
                        // setTier("free")
                        setMessagesLeft(3)
                    } else {
                        setMessagesLeft(data?.data[0]?.attributes?.messagesLeft)
                    }

                    insertStats(data?.data[0]?.attributes)
                    getPosition(data?.data[0]?.attributes?.preference?.data?.attributes?.position)
                    setPublished(data?.data[0]?.attributes?.createdAt)
                    setProfileId(data?.data[0]?.id);
                    setProfile(data?.data[0]);
                    setPlayers(data?.data[0]?.attributes?.players);
                    setUser(data?.data[0]?.attributes?.user);
                    setCountry(data?.data[0]?.attributes?.country)
                    setTotalPoint(`${data?.data[0]?.attributes?.total_point}`)
                    setRole(data?.data[0]?.attributes?.user_role?.data?.attributes?.role ?? "none")
                    setRoleId(data?.data[0]?.attributes?.user_role?.data?.id)
                    setCoaches(data?.data[0]?.attributes?.coaches)
                    setProfileEmail(
                        data?.data[0]?.attributes?.user?.data?.attributes?.email
                    );
                    setUserId(data?.data[0]?.attributes?.user?.data?.id);
                    setProfilePic(
                        data?.data[0]?.attributes?.profile_pic?.data?.attributes?.url
                    );
                    setPref(
                        data?.data[0]?.attributes?.preference
                    )


                    setLastUpdate(data?.data[0]?.attributes?.chats?.data)
                    const updatedSet = new Set(coachIds);
                    await data?.data[0]?.attributes?.chats?.data?.map(async (dat: any) => {
                        updatedSet?.add(dat?.attributes?.coach?.data?.id);
                    });
                    setCoachIds(updatedSet);
                    const updatedSett = new Set(playerIds);
                    await data?.data[0]?.attributes?.chats?.data?.map(async (dat: any) => {
                        updatedSett?.add(dat?.attributes?.player?.data?.id);
                    });
                    setPlayerIds(updatedSett);
                    if (!data?.data[0]?.attributes?.user_role?.data?.id && pathname !== "/details") {
                        router.push("/details")
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.log("An error occured", error);
                });
        };


        const getLeagues = async () => {
            return fetcher(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/leagues?sort=min:DESC`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user.data.jwt}`,
                    },
                }
            ).then((data) => {
                setLeagues(data?.data)
            }).catch((error) => {
                console.log("An error occured", error);
            });
        }

        if (session?.user?.id) {
            getUser(session?.user?.id);
            getLeagues()
        }

    }, [session, reload]);


    // useEffect(() => {
    //     if (!roleId && pathname !== "/details") {
    //         router.push("/details")
    //     }
    // }, [router])



    useEffect(() => {
        if (lastUpdate?.length > 0 && !done) {
            const currentTime: any = new Date();

            lastUpdate.forEach((update: any) => {
                // Convert the string to a Date object
                const updateDate: any = new Date(update?.attributes?.last_chated);
                let id = update?.attributes?.coach?.data?.id
                let type = "CoachMessage"
                // Calculate the difference in days
                const daysDifference: any = Math.round((currentTime - updateDate) / (1000 * 60 * 60 * 24));

                // If the difference is 2 days or more, run the sendNot function
                if (update?.attributes?.player?.data?.id) {
                    type = "PlayerMessage"
                    id = update?.attributes?.player?.data?.id
                }
                if (daysDifference >= 2) {
                    if (!update?.attributes?.sent) {
                        sendNo(profileId, session?.user.data.jwt, update?.attributes?.coach?.data?.attributes?.name, daysDifference, update?.id, type, id);
                    }
                }
            });
            setDone(true)
        }
    }, [lastUpdate]);


    const handleSubscribe = async (url?: string, chatId?: any) => {

        try {
            const { data } = await axios.post("/api/stripe-subscription", {
                profileId: chatId,
                amount: (parseInt("500") * 100).toFixed(2),
                productName: "Zballer",
                customerEmail: profileEmail,
                planId: "prod_QMLxK4VVI8U3Kp",
                callbackURL: url ?? `/profile`
            });
            if (data?.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.log(error);
            if (axios.isAxiosError(error)) {
                toast({
                    variant: "destructive",
                    description:
                        error.response?.data?.error?.message ||
                        "Something went wrong. Please try again",
                });


            } else {
                toast({
                    variant: "destructive",
                    description:
                        "Something went wrong. Please try again",
                });
            }
        }
    };



    return (
        <AuthContext.Provider
            value={{
                jwt: session?.user?.data?.jwt,
                reload,
                setReload,
                tier,
                setTier,
                reloadRead,
                setReloadRead,
                messagesLeft,
                setMessagesLeft,
                profile,
                setStats,
                role,
                setRole,
                stats,
                profileEmail,
                setUnRead,
                roleId,
                setRoleId,
                unRead,
                country,
                setCountry,
                position,
                setPosition,
                setUser,
                leagues,
                coachIds,
                playerIds,
                setPlayerIds,
                setCoachIds,
                setLeagues,
                published,
                setPublished,
                coaches,
                setCoaches,
                setPlayers,
                players,
                setProfile,
                profileId,
                profilepic,
                user,
                userId,
                pref,
                setPref,
                setTotalPoint,
                totalPoint,
                handleSubscribe,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContextProvider };
