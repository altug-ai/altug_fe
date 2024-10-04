import {
  Bundler,
  createSmartAccountClient,
  Paymaster,
  PaymasterMode,
} from "@biconomy/account";
import { ethers } from "ethers";
import { networkConfig } from "@/network-config";

export async function claimReward(
  externalPrivateKey,
  smartAccountAddress,
  amountInEther
) {
  try {
    // Create wallet from the private key of the external account
    const rpcUrl = networkConfig.rpcUrl; // Your RPC URL

    // Initialize provider using RPC URL
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const externalWallet = new ethers.Wallet(externalPrivateKey, provider);

    // Create and send transaction
    const tx = await externalWallet.sendTransaction({
      to: smartAccountAddress,
      value: ethers.utils.parseEther(amountInEther), // amount in Ether
    });

    console.log("Transaction Hash:", tx.hash);
    const receipt = await tx.wait(); // Wait for the transaction to be mined
    console.log("Transaction Receipt:", receipt);
    return {
      txHash: tx.hash,
      receipt: receipt,
    };
  } catch (error) {
    console.log("Error funding smart account:", error);
    return {
      txHash: null,
      receipt: null,
    };
  }
}
