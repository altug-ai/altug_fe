import { Input } from "@/components/ui/input";
import { AuthContext } from "@/context/AuthContext";
import { decryptPrivateKey } from "@/wallet/encrypt";
import { withdrawFund } from "@/wallet/withdrawFund";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { TbLoader3 } from "react-icons/tb";
import { useTranslations } from "next-intl";

type Props = {
  setTab: React.Dispatch<React.SetStateAction<number>>;
  receipentAddress?: any;
  setReceipentAddress?: any;
  setTransferAmount?: any;
  transferAmount?: any;
  balance?: any;
  _getBalance?: any;
};
const r = "0xaFc53BBD1816A0EA9bda0Dcc7F94CbcEc0D4A73A";
const Transfer = ({
  setTab,
  receipentAddress,
  setReceipentAddress,
  setTransferAmount,
  transferAmount,
  balance,
  _getBalance,
}: Props) => {
  const { profile } = useContext(AuthContext);
  const [isTransfering, setisTransfering] = useState(false);
  const t = useTranslations('Home.Wallet');


  return (
    <div className="max-w-[388px] w-full">
      <div className="w-full bg-[#3640F0] rounded-[16px] px-[16px] py-[16px]">
        <Image
          alt="check"
          src={"/tab/checkleft.png"}
          width={500}
          height={500}
          className="w-[44px] h-[44px] "
        />

        <div className="flex flex-col text-[20px] font-extrabold text-white leading-[24px] font-plus">
          <h1>{balance} {t("ProToken")} </h1>
          <h1 className="text-[14px] font-normal leading-[24px]">2,108.22</h1>
        </div>
      </div>

      <h1 className="text-[16px] font-plus font-semibold leading-[28px] text-[#EDEDED] my-[12px]">
        {t("EnterAmount")}
      </h1>

      <div className="w-full bg-[#EDEDED] rounded-[16px] px-[16px] py-[16px]">
        <div className="flex flex-col text-[12px] font-semibold text-[#9BA0AF] leading-[170%] tracking-[0.3px] font-plus">
          <h1>{t("Amount")} </h1>
          <div className="flex items-center h-full">
            <Input
              className="border-none bg-[#EDEDED] focus-visible:ring-0 focus-visible:ring-offset-0 text-[28px] font-bold text-[#061237] leading-[150%]"
              onChange={(e) =>
                e.target.value <= balance && setTransferAmount(e.target.value)
              }
              value={transferAmount}
              type="number"
              max={balance}
              min={0}
              step="0.01"
            />
            <div className="rounded-[6px]  bg-[#F7F9FC] px-[8px] py-[4px] ">
              <h1
                className="text-[12px] font-bold leading-[170%] tracking-[0.3px] text-[#83899B] "
                onClick={() => setTransferAmount(balance)}
              >
                {t("Max")}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <h1 className="text-[16px] font-plus font-semibold leading-[28px] text-[#EDEDED] my-[12px]">
        {t("Address")}
      </h1>

      <div className="w-full bg-[#EDEDED] rounded-[16px] px-[16px] py-[16px]">
        <div className="flex flex-col ">
          <div className="flex items-center w-full  h-full">
            <div className="rounded-[6px] w-[40%]  bg-[#F7F9FC] px-[8px] py-[6px] flex space-x-[4px] items-center">
              <Image
                src={"/tab/chillz.png"}
                className="w-[12px] h-[12px]"
                alt="chiliz chain"
                width={500}
                height={500}
              />
              <h1 className="text-[12px]  font-bold leading-[170%] tracking-[0.3px] text-[#83899B] ">
                {t("Chain")}
              </h1>
            </div>
            <Input
              className="border-none bg-[#EDEDED] focus-visible:ring-0 focus-visible:ring-offset-0 font-plus text-[14px] font-normal text-[#C1C4CD] leading-[165%] tracking-[0.2px]"
              onChange={(e) => setReceipentAddress(e.target.value)}
              value={receipentAddress}
            />
          </div>
        </div>
      </div>

      {!isTransfering ? (
        <div
          onClick={async () => {
            try {
              if (
                !profile?.attributes?.privateKey ||
                !receipentAddress ||
                !transferAmount.trim().toString()
              ) {
                return;
              }
              const privateKey = await decryptPrivateKey(
                profile?.attributes?.privateKey,
                profile?.attributes?.smartAccountAddress
              );
              setisTransfering(true);
              const res = await withdrawFund(
                privateKey,
                receipentAddress,
                transferAmount.trim().toString()
              );
              if (res) {
                await _getBalance();
                setTab(2);
              }
              setisTransfering(false);
            } catch (error) {
              console.log("error trasfering ", error);
              setisTransfering(false);
            }
          }}
          className="w-full bg-[#357EF8] rounded-[47px] grid place-content-center cursor-pointer hover:scale-105 mt-[21px] h-[49px] text-white text-[16px] font-medium leading-[126.006%] "
        >
          {t("Send")}
        </div>
      ) : (
        <div className="w-full bg-[#357EF8] rounded-[47px] grid place-content-center   mt-[21px] h-[49px] text-white text-[16px] font-medium leading-[126.006%] ">
          <TbLoader3 className="rounded-[47px] bg-[#357EF8]  text-white text-[12px] w-7 h-7 animate-spin" />{" "}
        </div>
      )}
    </div>
  );
};

export default Transfer;
