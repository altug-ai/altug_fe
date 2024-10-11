import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { useGetNotViewed } from "@/hooks/useGetNotViewed";
import { TbLoader3 } from "react-icons/tb";
import { decryptPrivateKey } from "@/wallet/encrypt";
import { getBalance } from "@/wallet/getBalance";

type Props = {};

const Header = (props: Props) => {
  const router = useRouter();
  const { profile, profilepic, coaches, totalPoint, players } =
    useContext(AuthContext);
  const { data, loading } = useGetNotViewed();

  const [balance, setBalance] = useState("");

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

  useEffect(() => {
    profile && _getBalance();
  }, [profile]);

  return (
    <div className="flex w-full max-w-[388px] items-center justify-between mb-[32px]">
      <div
        onClick={() => {
          router.push("/profile");
        }}
        className="flex space-x-3 items-center"
      >
        <Image
          src={profilepic ?? "/profile/unknownp.png"}
          width={500}
          height={500}
          alt="profile pic"
          className="w-[49.06px] cursor-pointer h-[49.06px] object-cover object-top rounded-full"
        />
        <h1 className="font-semibold text-[20px] cursor-pointer leading-[14.02px] text-[#FFFFFF]">
          {profile?.attributes?.username ?? ""}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <div
          onClick={() => {
            router.push("/notifications");
          }}
          className="relative"
        >
          <Image
            src={"/onboard/notification.png"}
            className="w-[37.33px] h-[37.33px] object-cover cursor-pointer"
            width={600}
            height={600}
            alt="notification"
          />
          <h1 className="absolute  top-0 right-1 bg-blue-500 text-white px-1 text-xs rounded-full">
            {loading ? (
              <TbLoader3 className="text-white w-5 h-5 animate-spin" />
            ) : (
              <div>{data}</div>
            )}
          </h1>
        </div>

        <div
          onClick={() => {
            router.push("/wallet");
          }}
          className="bg-white rounded-[21.5px] cursor-pointer py-[8px] px-[8px] flex space-x-2 items-center"
        >
          <Image
            src={"/tab/lay.svg"}
            className="w-[26px] h-[26px]"
            alt="wallet"
            width={500}
            height={500}
          />
          <h1 className="text-black text-[15px] font-bold leading-[12.546px]">
            {balance} Chz
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
