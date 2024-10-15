"use client";
import { AuthContext } from "@/context/AuthContext";
import { getBalance } from "@/wallet/getBalance";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { TbLoader3 } from "react-icons/tb";
import { useTranslations } from "next-intl";

type Props = {
  setTab: React.Dispatch<React.SetStateAction<number>>;
  balance: any;
};

const WalletData = ({ setTab, balance }: Props) => {
  const t = useTranslations('Home.Wallet');
  return (
    <div
      style={{
        boxShadow: "0px 2px 48px 0px rgba(0, 0, 0, 0.04)",
      }}
      className="flex justify-between  my-[20px] space-x-[8px] h-full  px-[14px] py-[14px] bg-[#202226] rounded-[16px] "
    >
      <div className="bg-[#3640F0] cursor-pointer hover:scale-x-105 w-[50%] py-[16px] px-[16px] rounded-[16px] flex flex-col space-y-[57px] ">
        <Image
          alt="check"
          src={"/tab/checkleft.png"}
          width={500}
          height={500}
          className="w-[44px] h-[44px] "
        />

        {!balance ? (
          <TbLoader3 className="rounded-[47px] bg-[#357EF8] mr-6 text-white text-[12px] w-7 h-7 animate-spin" />
        ) : (
          <div className="flex flex-col text-[20px] font-extrabold text-white leading-[24px] font-plus">
            <h1>{balance?.toString().trim().slice(0, 4)} {t("ProToken")} </h1>
            <h1 className="text-[14px] font-normal leading-[24px]">
              2,108.22
            </h1>
          </div>
        )}
      </div>

      <div className="w-[50%] flex flex-col space-y-[8px] ">
        <div
          className="w-full cursor-pointer hover:scale-x-105 rounded-[16px] bg-[#EDEDED] px-[16px] py-[16px] h-[50%] grid place-content-center"
          onClick={() => {
            setTab(3);
          }}
        >
          <div className="flex items-center space-x-[12px]">
            <Image
              className="w-[42px] h-[42px]"
              alt="check down"
              width={500}
              height={500}
              src={"/tab/checkdown.png"}
            />
            <h1 className="text-[16px] font-bold leading-[24px] text-[#202226]">
              {t("Deposit")}
            </h1>
          </div>
        </div>

        <div
          onClick={() => {
            setTab(1);
          }}
          className="w-full cursor-pointer hover:scale-x-105 rounded-[16px] bg-[#EDEDED] px-[16px] py-[16px] h-[50%] grid place-content-center"
        >
          <div className="flex items-center space-x-[12px]">
            <Image
              className="w-[42px] h-[42px]"
              alt="check down"
              width={500}
              height={500}
              src={"/tab/checkup.png"}
            />
            <h1 className="text-[16px] font-bold leading-[24px] text-[#202226]">
              {t("Withdraw")}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletData;
