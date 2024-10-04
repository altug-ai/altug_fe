import {
  Bundler,
  createSmartAccountClient,
  Paymaster,
  PaymasterMode,
} from "@biconomy/account";

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

export async function createWallet() {
  try {
    const privateKey = generatePrivateKey();

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
    const smartAccountAddress = await smartAccount.getAccountAddress();
    console.log("smartAccountAddress   ", smartAccountAddress);
    const { wait } = await smartAccount.deploy(
      {
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },
      },

      {
        gasOffset: {
          verificationGasLimitOffsetPct: 100, // 25% increase
          preVerificationGasOffsetPct: 100, // 9.80% increase
        },
      }
    );

    const { success, receipt } = await wait();
    console.log("success", success);

    return {
      privateKey,
      smartAccountAddress,
      success,
    };
  } catch (error) {
    console.log("-----error-------", error);
    return {
      privateKey: "",
      smartAccountAddress: "",
      success: false,
    };
  }
}
