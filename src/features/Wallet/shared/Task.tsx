"use client";
import { AuthContext } from "@/context/AuthContext";
import { LeaderboardContext } from "@/context/LeaderboardContext";
import axios from "axios";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { TbLoader3 } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
type Props = {
  claim?: boolean;
  join?: boolean;
  completed?: boolean;
  title?: string;
  number?: number;
  handleClaim?: any;
  id: number;
  challengeId?: number;
};

const Task = ({
  claim,
  join,
  completed,
  title,
  number,
  handleClaim,
  id,
  challengeId
}: Props) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState<boolean>(false);
  const { profileId, jwt } = useContext(AuthContext);
  const { setReload: setR, reload: re } = useContext(LeaderboardContext)
  const t = useTranslations('Home.Wallet');

  const handleJoinTask = async () => {
    try {
      setLoader(true)
      const data = {
        data: {
          completed: {
            connect: [profileId],
          },
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

      setR(!re)
      setLoader(false);
      return updateNots
    } catch (error) {
      setLoader(false)
      console.error(error);
    }

  }

  return (
    <div
      style={{
        boxShadow: "0px 2px 48px 0px rgba(0, 0, 0, 0.04)",
      }}
      className="flex justify-between items-center my-[20px]  px-[14px] py-[14px] bg-[#202226] rounded-[16px] "
    >
      <div className="flex items-center space-x-[14px]">
        <Image
          alt="The image"
          width={500}
          height={500}
          src="/tab/white.svg"
          className="w-[43px] h-[43px] rounded-full"
        />

        <div className="flex flex-col space-y-[8px]">
          <h1 className="text-white text-[14px] font-bold leading-normal font-plus">
            {title ?? "Defense challenge"}
          </h1>
          <h1 className="text-[#737883] text-[12px] font-normal leading-normal font-plus">
            {number ?? "0.1"} {t("ProToken")}
          </h1>
        </div>
      </div>

      {claim && (
        <>
          {loading ? (
            <TbLoader3 className="rounded-[47px] bg-[#357EF8] mr-6 text-white text-[12px] w-7 h-7 animate-spin" />
          ) : (
            <div
              className="rounded-[47px] bg-[#357EF8] px-[24px] py-[6px] text-white text-[12px] font-medium"
              onClick={() => handleClaim(`${number}`, setLoading, id)}
            >
              {t("Claim")}
            </div>
          )}
        </>
      )}

      {join && (
        <>
          {loader ? (
            <TbLoader3 className="rounded-[47px] bg-[#357EF8] mr-6 text-white text-[12px] w-7 h-7 animate-spin" />
          ) : (
            <div
              className="rounded-[47px] cursor-pointer bg-[#357EF8] px-[24px] py-[6px] text-white text-[12px] font-medium"
              onClick={() => {
                router.push(`/challenge/${challengeId}`)
                // handleJoinTask()
              }}
            >
              {t("Join")}
            </div>
          )}
        </>
      )}

      {completed && (
        <div>
          <Image
            src="/tab/markT.png"
            width={500}
            height={500}
            alt="mark"
            className="w-[28px] h-[27px]"
          />
        </div>
      )}
    </div>
  );
};

export default Task;
