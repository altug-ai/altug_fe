"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { LeaderboardProps } from "./types";


// @ts-ignore
export const LeaderboardContext = createContext<LeaderboardProps>({});

function LeaderboardContextProvider(props: any) {
    const [country, setCountry] = useState<string>("")
    const [league, setleague] = useState<string>("")
    const [data, setData] = useState<any>([]);
    return (
        <LeaderboardContext.Provider
            value={{
                country,
                league,
                setCountry,
                data, 
                setData,
                setleague
            }}
        >
            {props.children}
        </LeaderboardContext.Provider>
    );
}

export { LeaderboardContextProvider };
