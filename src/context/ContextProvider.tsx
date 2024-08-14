import React from 'react';
import { OnboardingContextProvider } from './Onboarding';
import { AuthContextProvider } from './AuthContext';
import { CoachContextProvider } from './CoachContext';
import { ChallengeContextProvider } from './ChallengeContext';
import { LeaderboardContextProvider } from './LeaderboardContext';

type Props = {
    children: any;
};

const ContextProvider = (props: Props) => {
    return (
        <AuthContextProvider>
            <OnboardingContextProvider>
                <CoachContextProvider>
                    <ChallengeContextProvider>
                        <LeaderboardContextProvider>
                            {props.children}
                        </LeaderboardContextProvider>

                    </ChallengeContextProvider>
                </CoachContextProvider>
            </OnboardingContextProvider >

        </AuthContextProvider>

    );
};

export default ContextProvider;