import React, { useContext } from "react";
import Task from "../shared/Task";
import { useGetTasks } from "@/hooks/useGetTasks";
import { TbLoader3 } from "react-icons/tb";
import { useGetClaimedTasks } from "@/hooks/useGetClaimedTasks";
import { useGetDoneTasks } from "@/hooks/useGetDoneTasks";
import { AuthContext } from "@/context/AuthContext";

type Props = {
  handleClaim?: any;
};

const Tasks = (props: Props) => {
  const { data, loading } = useGetTasks();
  const { data: dat, loading: load } = useGetClaimedTasks()
  const { data: dataa, loading: loader } = useGetDoneTasks()
  const { profileId } = useContext(AuthContext);

  // console.log("the dat", dataa)
  return (
    <div className="max-w-[388px] w-full pb-[50px]">
      <h1 className="text-[16px] font-medium leading-normal tracking-[1px] text-[#EDEDED]">
        Claim Rewards
      </h1>
      {loader && (
        <div className="max-w-[388px] w-full my-[30px] flex justify-center">
          <TbLoader3 className="text-white w-10 h-10 animate-spin" />
        </div>
      )}
      {dataa?.filter((dat: any) => {
        const datm = dat?.attributes?.claimed?.find((d: any) => d?.["id"] === `${profileId}`)
        if (!datm?.id) {
          return dat
        }
      }).map((dat) => (
        <Task
          number={dat?.attributes?.reward}
          title={dat?.attributes?.title}
          key={dat.id}
          id={dat.id}
          handleClaim={props.handleClaim}
          claim
        />
      ))}

      {/* <Task claim handleClaim={props.handleClaim} />
      <Task claim handleClaim={props.handleClaim} /> */}

      <h1 className="text-[16px] font-medium leading-normal tracking-[1px] text-[#EDEDED]">
        Pending Tasks
      </h1>
      {loading && (
        <div className="max-w-[388px] w-full my-[30px] flex justify-center">
          <TbLoader3 className="text-white w-10 h-10 animate-spin" />
        </div>
      )}
      {data?.filter((dat: any) => {
        const find = dataa?.find((d) => d?.id === dat?.id)
        if (!find?.id) {
          return dat
        }
      }).map((dat) => (
        <Task
          challengeId={dat?.attributes?.challenge?.data?.id}
          number={dat?.attributes?.reward}
          title={dat?.attributes?.title}
          key={dat.id}
          id={dat.id}
          join
        />
      ))}

      <h1 className="text-[16px] font-medium leading-normal tracking-[1px] text-[#EDEDED]">
        Claimed
      </h1>
      {load && (
        <div className="max-w-[388px] w-full my-[30px] flex justify-center">
          <TbLoader3 className="text-white w-10 h-10 animate-spin" />
        </div>
      )}
      {dat?.map((dat) => (
        <Task
          number={dat?.attributes?.reward}
          title={dat?.attributes?.title}
          key={dat.id}
          id={dat.id}
          completed
        />
      ))}
    </div>
  );
};

export default Tasks;
