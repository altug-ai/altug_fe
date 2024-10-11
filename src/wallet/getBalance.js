import {
  Bundler,
  createSmartAccountClient,
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

export async function getBalance(privateKey) {
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

    const balance = await smartAccount.getBalances();

    return balance;
  } catch (error) {
    console.log("error is ", error);
    return 0;
  }
}
