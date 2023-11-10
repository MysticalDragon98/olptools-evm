import { bytesToHex, hexToBytes } from "@ethereumjs/util";
import { readFileSync } from "fs";
import EVM from "./lib/classes/EVM.class";
import { log } from "termx";
import runVMContractTx from "./lib/modules/vm/runVMContractTx";
import { LegacyTransaction } from "@ethereumjs/tx";

const PRIVKEY = hexToBytes("0xcc623631ebbdb066b2af3b8418cd085cbc804668f52fe87088b18652e71c9b09");
const CONTRACT_BYTECODE = JSON.parse(readFileSync("./lib/contracts/IdentityService.json", "utf-8")).bytecode;
const CONTRACT_ABI = JSON.parse(readFileSync("./lib/contracts/IdentityService.json", "utf-8")).abi;

(async function () {
    const evm = await EVM.create({
        defaultBalance: BigInt(10) ** BigInt(20), // 100 ETH

        accounts: {
            owner: PRIVKEY
        },

        abis: {
            IdentityService: { abi: CONTRACT_ABI, bytecode: CONTRACT_BYTECODE }
        },

    });

    const account = evm.accounts.get("owner");
    const contractAddress = await account.deployContract("IdentityService", []);
    const IdentityService = account.contract("IdentityService", contractAddress);

    await IdentityService.set("test");
    await IdentityService.set("test2");

    // const transactions = evm.serializedTransactions();
    const evm2 = await EVM.create({
        defaultBalance: BigInt(10) ** BigInt(20), // 100 ETH

        accounts: {
            owner: PRIVKEY
        },

        abis: {
            IdentityService: { abi: CONTRACT_ABI, bytecode: CONTRACT_BYTECODE }
        },

        transactions: evm.transactions()
    });

    const IdentityService2 = evm2.accounts.get("owner").contract("IdentityService", contractAddress);
    log(await IdentityService2.get(account.hexAddress()));
})().catch(console.log);