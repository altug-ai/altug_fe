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
import { encryptPrivateKey, decryptPrivateKey } from "@/wallet/encrypt";
import { AuthContext } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { LeaderboardContext } from "@/context/LeaderboardContext";
import Deposite from "./components/Deposite";
import { useTranslations } from "next-intl";

type Props = {};

const Wallet = (props: Props) => {
  const [tab, setTab] = useState<number>(0);
  const { loading, profile } = useContext(AuthContext);
  const [balance, setBalance] = useState("");
  const { profileId, jwt } = useContext(AuthContext);
  const { setReload: setR, reload: re } = useContext(LeaderboardContext);
  const [receipentAddress, setReceipentAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const t = useTranslations('Home.Wallet');
  const { toast } = useToast();

  async function _getBalance() {
    try {
      const privateKey = await decryptPrivateKey(
        profile?.attributes?.privateKey,
        profile?.attributes?.smartAccountAddress
      );
      const _balance: any = await getBalance(privateKey);

      if (_balance?.length) {
        setBalance(_balance[_balance.length - 1]?.formattedAmount || "0");
      } else setBalance("0");
    } catch (error) {
      console.log("error is ", error);
      setBalance("0");
    }
  }

  async function handleClaim(amount: any, setLoading: any, id: number) {
    setLoading(true);
    const res = await claimReward(
      profile?.attributes?.smartAccountAddress,
      amount
    );

    // console.log("claim res is ", res);

    if (!res.txHash || !res.receipt) {
      toast({
        variant: "destructive",
        description: t("SomethingWentWrong"),
      });
    } else {
      await _getBalance();
      const data = {
        data: {
          claimed: [
            {
              id: `${profileId}`,
            },
          ],
        },
      };

      const updateNots = await axios.put(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/tasks/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      setR(!re);
      toast({
        variant: "destructive",
        description: t("RewardClaimedSuccessfully"),
      });
    }
    setLoading(false);
  }

  function handleGoBackToHome() { }
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

      {tab == 1 && (
        <Transfer
          setTab={setTab}
          setReceipentAddress={setReceipentAddress}
          receipentAddress={receipentAddress}
          setTransferAmount={setTransferAmount}
          transferAmount={transferAmount}
          balance={balance}
          _getBalance={_getBalance}
        />
      )}

      {tab == 2 && (
        <Success
          receipentAddress={receipentAddress}
          transferAmount={transferAmount}
          handleGoBackToHome={handleGoBackToHome}
        />
      )}
      {tab == 3 && (
        <Deposite
          receipentAddress={profile?.attributes?.smartAccountAddress}
          setTab={setTab}
        />
      )}

      <TabBar page="profile" />
    </div>
  );
};

export default Wallet;
