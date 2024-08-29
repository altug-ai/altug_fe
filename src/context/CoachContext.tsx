"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CoachProps } from "./types";


// @ts-ignore
export const CoachContext = createContext<CoachProps>({});

function CoachContextProvider(props: any) {
    const [coachLoader, setCoachLoader] = useState<boolean>(false)
    const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
    return (
        <CoachContext.Provider
            value={{
                coachLoader,
                setCoachLoader,
                audioEnabled,
                setAudioEnabled
            }}
        >
            {props.children}
        </CoachContext.Provider>
    );
}

export { CoachContextProvider };
