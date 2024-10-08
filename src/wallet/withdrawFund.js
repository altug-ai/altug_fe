import {
  Bundler,
  createSmartAccountClient,
  NATIVE_TOKEN_ALIAS,
  Paymaster,
  PaymasterMode,
} from "@biconomy/account";
import { ethers } from "ethers";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import { networkConfig } from "@/network-config";

const bundler = new Bundler({
  bundlerUrl: networkConfig.bundlerUrl,
  chainId: networkConfig.chainId,
  entryPointAddress: networkConfig.entryPointAddress,
});

const paymaster = new Paymaster({
  paymasterUrl: networkConfig.paymasterUrl,
});

export async function withdrawFund(privateKey, receipentAddress, amount) {
  try {
    const account = privateKeyToAccount(privateKey);

    const signer = createWalletClient({
      account,
      chain: networkConfig.chain,
      transport: http(),
    });

    const smartAccount = await createSmartAccountClient({
      signer,
      bundlerUrl: networkConfig.bundlerUrl,
      paymasterUrl: networkConfig.paymasterUrl,
      chainId: networkConfig.chainId,
      bundler: bundler,
      biconomyPaymasterApiKey: networkConfig.biconomyPaymasterApiKey,
      rpcUrl: networkConfig.rpcUrl,
      entryPointAddress: networkConfig.entryPointAddress,
      paymaster: paymaster,
    });

    // OR to withdraw all of the native token, leaving no dust in the smart account
    // const { wait } = await smartAccount.sendTransaction(
    //   {
    //     to: receipentAddress,
    //     value: ethers.utils.parseEther(amount),
    //   },
    //   {
    //     paymasterServiceData: { mode: PaymasterMode.SPONSORED },
    //   }
    // );
    const weiAmount = ethers.utils.parseUnits(amount, "ether");
    console.log("amount in wei is ", weiAmount);
    const { wait } = await smartAccount.withdraw(
      [{ address: NATIVE_TOKEN_ALIAS, amount: BigInt(weiAmount) }],
      receipentAddress,
      {
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },
      }
    );

    const { success, receipt } = await wait();
    console.log("withrdrawal res is ", success);

    return success;
  } catch (error) {
    console.log("-----error-------", error);
    return false;
  }
}
