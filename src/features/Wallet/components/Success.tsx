import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
type Props = {
  receipentAddress?: any;
  transferAmount?: any;
  handleGoBackToHome?: any;
};

const Success = ({ receipentAddress, transferAmount }: Props) => {
  const t = useTranslations('Home.Wallet');
  const router = useRouter();
  const formatTimestamp = () => {
    const now = new Date();

    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    const year = now.getFullYear();

    const hours = now.getHours() % 12 || 12; // Converts 24-hour to 12-hour format
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = now.getHours() >= 12 ? "PM" : "AM";

    return `${day}.${month}.${year} o ${hours}:${minutes} ${ampm}`;
  };
  const formatString = (str: string, startLength = 10, endLength = 3) => {
    if (str.length <= startLength + endLength) {
      return str; // No need to trim if string is shorter than the required length
    }

    const start = str.slice(0, startLength);
    const end = str.slice(-endLength);

    return `${start}...${end}`;
  };
  return (
    <div className="max-w-[388px] w-full h-full pb-[50px] relative mt-[76px]">
      <div className="bg-white w-full rounded-[24px] h-[70vh]  relative">
        <div className="h-[50%] gride place-content-center">
          <div className="flex flex-col items-center ">
            <h1 className="text-[#3640F0] text-[14px] font-semibold leading-[22px] text-center">
              {t("Great")}
            </h1>
            <h1 className="text-[#202226] font-plus text-[24px] font-bold leading-[32px]">
              {t("TranSuccess")}
            </h1>
            <h1 className="text-center text-[#838383] text-[14px] font-normal leading-[140%] max-w-[332px]">
             {t("ProSuccess")}
            </h1>
          </div>
        </div>

        <div className="h-[50%] gride place-content-center border-t-4 border-t-[#EDEDED] border-dotted ">
          <div className="flex flex-col items-center ">
            <h1 className="text-[#838383] text-[16px] font-normal leading-[24px] tracking-[0.3px]  text-center">
              {t("Total")}
            </h1>
            <h1 className="text-[#3640F0] font-plus text-[36px] font-bold leading-[44px]">
              {transferAmount} {t("Token")}
            </h1>
            <div className="px-[12px] py-[12px] bg-[#F3F3F3] rounded-[16px] flex space-x-[16px] items-center">
              <div className="rounded-[12px]  bg-white px-[10px] py-[10px]">
                <Image
                  src={"/tab/chiliz.png"}
                  className="w-[28px] h-[28px]"
                  alt="chiliz chain"
                  width={800}
                  height={800}
                />
              </div>

              <div className="flex flex-col space-y-[2px]">
                <h1 className="text-[#202226] font-plus text-[18px] font-normal leading-[26px]">
                  {formatString(receipentAddress as string)}
                </h1>
                <h1 className="text-[12px] font-normal leading-[20px] text-[#838383] font-plus">
                  {formatTimestamp()}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <Image
          src={"/tab/check.png"}
          className="w-[116px] h-[116px] absolute left-[50%] top-0 transform translate-x-[-50%] translate-y-[-50%]"
          alt="check"
          width={800}
          height={800}
        />

        <div
          onClick={() => {
            router.push("/profile");
          }}
          className="w-[50%] bg-[#357EF8] absolute transform translate-x-[-50%] translate-y-[-50%] left-[50%] bottom-[-40px] rounded-[47px] grid place-content-center cursor-pointer hover:scale-105 mt-[21px] py-[10px] text-white text-[16px] font-medium leading-[126.006%] "
        >
          {t("BackHome")}
        </div>
      </div>
      <Image
        src={"/tab/leftrect.png"}
        className="w-[32px] h-[48px] absolute bottom-[50%] left-[-20px]"
        alt="chiliz chain"
        width={200}
        height={200}
      />
      <Image
        src={"/tab/rightrect.png"}
        className="w-[32px] h-[48px] absolute bottom-[50%] right-[-20px]"
        alt="chiliz chain"
        width={200}
        height={200}
      />
    </div>
  );
};

export default Success;
