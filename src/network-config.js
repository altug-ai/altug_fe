import { spicy, chiliz } from "viem/chains";

const devConfig = {
  chain: spicy,
  bundlerUrl:
    "https://bundler.biconomy.io/api/v2/88882/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
  paymasterUrl:
    "https://paymaster.biconomy.io/api/v1/88882/pp-8HGZcM.baed0692-4d37-4358-b034-24cd50bb5755",
  chainId: 88882,
  biconomyPaymasterApiKey: "pp-8HGZcM.baed0692-4d37-4358-b034-24cd50bb5755",
  rpcUrl: "https://spicy-rpc.chiliz.com/",
  entryPointAddress: "0x00000061FEfce24A79343c27127435286BB7A4E1",
};

const mainnetConfig = {
  chain: chiliz,
  bundlerUrl: "",
  paymasterUrl: "",
  chainId: 88888,
  biconomyPaymasterApiKey: "",
  rpcUrl: "https://chiliz-rpc.publicnode.com",
  entryPointAddress: "0x00000061FEfce24A79343c27127435286BB7A4E1",
};

export const networkConfig =
  process.env.NEXT_PUBLIC_NETWORK == "mainnet" ? mainnetConfig : devConfig;
