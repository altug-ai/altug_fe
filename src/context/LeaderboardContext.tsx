"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { LeaderboardProps } from "./types";


// @ts-ignore
export const LeaderboardContext = createContext<LeaderboardProps>({});

function LeaderboardContextProvider(props: any) {
    const [country, setCountry] = useState<string>("")
    const [league, setleague] = useState<string>("")
    const [data, setData] = useState<any>([]);
    const [reload, setReload] = useState<boolean>(false);
    return (
        <LeaderboardContext.Provider
            value={{
                country,
                league,
                setCountry,
                data,
                setData,
                setleague,
                reload, setReload
            }}
        >
            {props.children}
        </LeaderboardContext.Provider>
    );
}

export { LeaderboardContextProvider };
