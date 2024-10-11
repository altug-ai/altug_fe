import React, { useContext, useEffect, useState, useMemo } from "react";
import Task from "../shared/Task";
import { useGetTasks } from "@/hooks/useGetTasks";
import { TbLoader3 } from "react-icons/tb";
import { useGetClaimedTasks } from "@/hooks/useGetClaimedTasks";
import { AuthContext } from "@/context/AuthContext";
import { checkTask } from "../function";
import { useTranslations } from "next-intl";

type Props = {
  handleClaim?: any;
};

const Tasks = (props: Props) => {
  const { data, loading } = useGetTasks();
  const { data: claimedData, loading: claimedLoading } = useGetClaimedTasks();
  const { profileId, jwt, loading: loader } = useContext(AuthContext);
  const [claimedTasks, setClaimedTasks] = useState<any[]>([]);
  const [pendingTasks, setPendingTasks] = useState<any[]>([]);
  const t = useTranslations('Home.Wallet');

  const filterTasks = useMemo(async () => {
    if (!data) return { claimedTasks: [], pendingTasks: [] };

    const filtered = await Promise.all(
      data.map(async (dat: any) => {
        const taskClaimed = dat?.attributes?.claimed?.some(
          (d: any) => d?.["id"] === `${profileId}`
        );
        const isDone = await checkTask(
          dat?.attributes?.challenge?.data?.id,
          profileId,
          jwt
        );

        if (isDone && !taskClaimed) {
          return { type: "claimed", dat };
        } else if (!isDone && !taskClaimed) {
          return { type: "pending", dat };
        }
        return null;
      })
    );

    const claimed = filtered.filter((item) => item?.type === "claimed").map((item) => item!.dat);
    const pending = filtered.filter((item) => item?.type === "pending").map((item) => item!.dat);

    return { claimedTasks: claimed, pendingTasks: pending };
  }, [data, profileId, jwt]);

  useEffect(() => {
    const fetchData = async () => {
      const { claimedTasks, pendingTasks } = await filterTasks;

      setClaimedTasks(claimedTasks);
      setPendingTasks(pendingTasks);
    };

    if (data) fetchData();
  }, [data, filterTasks]);

  return (
    <div className="max-w-[388px] w-full pb-[50px]">
      <h1 className="text-[16px] font-medium leading-normal tracking-[1px] text-[#EDEDED]">
        {t("ClaimRewards")}
      </h1>
      {(loading && loader) ? (
        <div className="max-w-[388px] w-full my-[30px] flex justify-center">
          <TbLoader3 className="text-white w-10 h-10 animate-spin" />
        </div>
      ) : (
        claimedTasks.map((dat) => (
          <Task
            number={dat?.attributes?.reward}
            title={dat?.attributes?.title}
            key={dat.id}
            id={dat.id}
            handleClaim={props.handleClaim}
            claim
          />
        ))
      )}

      <h1 className="text-[16px] font-medium leading-normal tracking-[1px] text-[#EDEDED]">
        {t("Pending")}
      </h1>
      {(loading && loader) ? (
        <div className="max-w-[388px] w-full my-[30px] flex justify-center">
          <TbLoader3 className="text-white w-10 h-10 animate-spin" />
        </div>
      ) : (
        pendingTasks.map((dat) => (
          <Task
            challengeId={dat?.attributes?.challenge?.data?.id}
            number={dat?.attributes?.reward}
            title={dat?.attributes?.title}
            key={dat.id}
            id={dat.id}
            join
          />
        ))
      )}

      <h1 className="text-[16px] font-medium leading-normal tracking-[1px] text-[#EDEDED]">
        {t("Claimed")}
      </h1>
      {claimedLoading ? (
        <div className="max-w-[388px] w-full my-[30px] flex justify-center">
          <TbLoader3 className="text-white w-10 h-10 animate-spin" />
        </div>
      ) : (
        claimedData?.map((dat) => (
          <Task
            number={dat?.attributes?.reward}
            title={dat?.attributes?.title}
            key={dat.id}
            id={dat.id}
            completed
          />
        ))
      )}
    </div>
  );
};

export default Tasks;
