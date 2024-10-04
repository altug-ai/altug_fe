"use client";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { TbLoader3 } from "react-icons/tb";

type Props = {
  claim?: boolean;
  join?: boolean;
  completed?: boolean;
  title?: string;
  number?: number;
  handleClaim?: any;
};

const Task = ({
  claim,
  join,
  completed,
  title,
  number,
  handleClaim,
}: Props) => {
  const [loading, setLoading] = useState(false);
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
            {number ?? "0.1"} $Pro Token
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
              onClick={() => handleClaim("0.1", setLoading)}
            >
              claim
            </div>
          )}
        </>
      )}

      {join && (
        <div className="rounded-[47px] bg-[#28B446] px-[24px] py-[6px] text-white text-[12px] font-medium">
          Join
        </div>
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
