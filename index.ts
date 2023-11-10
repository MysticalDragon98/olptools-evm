import { Address, hexToBytes } from "@ethereumjs/util";
import { log } from "termx";
import { readFileSync } from "fs";
import createVM from "./lib/modules/vm/createVM";
import initVMAccount from "./lib/modules/vm/initVMAccount";
import deployVMContract from "./lib/modules/vm/deployVMContract";
import createBlock from "./lib/modules/vm/createBlock";
import runVMContractCall from "./lib/modules/vm/runVMContractCall";
import runVMContractSend from "./lib/modules/vm/runVMContractSend";

const PRIVKEY = hexToBytes("0xcc623631ebbdb066b2af3b8418cd085cbc804668f52fe87088b18652e71c9b09");
const ADDRESS = Address.fromPrivateKey(PRIVKEY);
const CONTRACT_BYTECODE = JSON.parse(readFileSync("./lib/contracts/IdentityService.json", "utf-8")).bytecode;
const CONTRACT_ABI = JSON.parse(readFileSync("./lib/contracts/IdentityService.json", "utf-8")).abi;

log("Starting VM with address: " + ADDRESS.toString());

(async function () {
    const vm = await createVM();
    const block = await createBlock();
    await initVMAccount(vm, ADDRESS);
    
    const IdentityService = await deployVMContract(vm, {
        privateKey: PRIVKEY,
        bytecode: CONTRACT_BYTECODE,
        types: [],
        args: [],
        block
    });

    log("Deployed IdentityService contract at address: " + IdentityService.toString());

    const results = await runVMContractCall(vm, IdentityService, {
        abi: CONTRACT_ABI,
        args: [ADDRESS.toString()],
        block,
        caller: ADDRESS,
        method: "get"
    });

    log("get() result: " + JSON.stringify(results));

    const setResult = await runVMContractSend(vm, IdentityService, {
        abi: CONTRACT_ABI,
        args: ["fake-fata"],
        method: "set",
        block,
        privateKey: PRIVKEY
    });

    log("set() result: " + JSON.stringify(setResult));

    const results2 = await runVMContractCall(vm, IdentityService, {
        abi: CONTRACT_ABI,
        args: [ADDRESS.toString()],
        block,
        caller: ADDRESS,
        method: "get"
    });

    log("get() result: " + JSON.stringify(results2));

     await runVMContractSend(vm, IdentityService, {
        abi: CONTRACT_ABI,
        args: ["fake-data"],
        method: "set",
        block,
        privateKey: PRIVKEY
    });


    const results3 = await runVMContractCall(vm, IdentityService, {
        abi: CONTRACT_ABI,
        args: [ADDRESS.toString()],
        block,
        caller: ADDRESS,
        method: "get"
    });

    log("get() result: " + JSON.stringify(results3));

})().catch(console.log);