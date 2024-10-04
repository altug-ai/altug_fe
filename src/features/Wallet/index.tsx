"use client";
import React, { useContext, useEffect, useState } from "react";
import TabBar from "../Profile/components/TabBar";
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import WalletData from "./components/WalletData";
import Transfer from "./components/Transfer";
import Success from "./components/Success";
import { getBalance } from "@/wallet/getBalance";
import { claimReward } from "@/wallet/claimReward";
import { AuthContext } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
type Props = {};

const Wallet = (props: Props) => {
  const [tab, setTab] = useState<number>(0);
  const { loading, profile } = useContext(AuthContext);
  const [balance, setBalance] = useState("");

  const adminPrivateKey =
    "3cdbb6228da5a7785c5826cee0e5f84e0ede6a1fd612e11c8d22ecd74fab9d59";
  const { toast } = useToast();

  async function _getBalance() {
    const _balance: any = await getBalance(profile?.attributes?.privateKey);

    if (_balance?.length) {
      setBalance(_balance[_balance.length - 1]?.formattedAmount || "0");
    }
  }

  async function handleClaim(amount: any, setLoading: any) {
    setLoading(true);
    const res = await claimReward(
      adminPrivateKey,
      profile?.attributes?.smartAccountAddress,
      amount
    );

    // console.log("claim res is ", res);

    if (!res.txHash || !res.receipt) {
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again",
      });
    } else {
      await _getBalance();
      toast({
        variant: "destructive",
        description: "Reward Claimed Successfully",
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    profile && _getBalance();
  }, [profile]);

  return (
    <div className="py-[20px] px-[20px] h-full flex flex-col items-center ">
      <Header setTab={setTab} tab={tab} />
      {tab === 0 && (
        <>
          <div className="max-w-[388px] w-full">
            <WalletData setTab={setTab} balance={balance} />
          </div>
          <Tasks handleClaim={handleClaim} />
        </>
      )}

      {tab == 1 && <Transfer setTab={setTab} />}

      {tab == 2 && <Success />}

      <TabBar page="profile" />
    </div>
  );
};

export default Wallet;
