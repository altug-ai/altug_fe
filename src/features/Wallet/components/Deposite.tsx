import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import copy from "copy-to-clipboard";
import { MdOutlineContentCopy } from "react-icons/md";
import { useToast } from "@/components/ui/use-toast";
type Props = {
  receipentAddress?: any;
  setTab?: any;
};

const Deposite = ({ receipentAddress, setTab }: Props) => {
  const { toast } = useToast();
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
      <div className="bg-white w-full rounded-[24px] h-[35vh]  relative">
        <div className="h-[50%] gride place-content-center">
          <div className="flex flex-col items-center px-4">
            <h1 className="text-[#202226] font-plus text-[24px] font-bold leading-[32px]">
              Copy the address below and make sure the network is chz.
            </h1>
          </div>
        </div>

        <div className="h-[50%] gride place-content-center border-t-4 border-t-[#EDEDED] border-dotted ">
          <div className="flex flex-col items-center ">
            <div className="px-[12px] py-[12px] bg-[#F3F3F3] rounded-[16px] flex space-x-[16px] items-center">
              <div
                className="rounded-[12px]  bg-white px-[10px] py-[10px] cursor-pointer hover:scale-105 text-[16px] font-medium"
                onClick={() => {
                  copy(receipentAddress);
                  toast({
                    variant: "destructive",
                    description: "Address copied to clipboard",
                  });
                }}
              >
                {/* <Image
                  src={"/tab/chiliz.png"}
                  className="w-[28px] h-[28px]"
                  alt="chiliz chain"
                  width={800}
                  height={800}
                /> */}
                <MdOutlineContentCopy />
              </div>

              <div className="flex flex-col space-y-[2px]">
                <h1 className="text-[#202226] font-plus text-[18px] font-normal leading-[26px]">
                  {formatString(receipentAddress as string)}
                </h1>
              </div>
            </div>
          </div>
        </div>
        {/* <Image
          src={"/tab/check.png"}
          className="w-[116px] h-[116px] absolute left-[50%] top-0 transform translate-x-[-50%] translate-y-[-50%]"
          alt="check"
          width={800}
          height={800}
        /> */}

        <div
          onClick={() => {
            setTab(0);
          }}
          className="w-[50%] bg-[#357EF8] absolute transform translate-x-[-50%] translate-y-[-50%] left-[50%] bottom-[-40px] rounded-[47px] grid place-content-center cursor-pointer hover:scale-105 mt-[21px] py-[10px] text-white text-[16px] font-medium leading-[126.006%] "
        >
          Back To Wallet
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

export default Deposite;
