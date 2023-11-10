import { Block } from "@ethereumjs/block";
import { VM } from "@ethereumjs/vm";
import { ElasticProxy } from "@mysticaldragon/proxies";
import runVMContractCall from "./runVMContractCall";
import { Address } from "@ethereumjs/util";
import { ok } from "assert";
import runVMContractSend from "./runVMContractSend";
import { LegacyTransaction } from "@ethereumjs/tx";

interface InitOptions {
    address: string | Address;
    privateKey: Uint8Array;
    block?: Block;
    abi: any;
}

interface SendOptions {
    block?: Block;
    gasLimit?: bigint;
    gasPrice?: bigint;
}
export default function getVMContract (vm: VM, contractOptions: InitOptions) {
    const caller = Address.fromPrivateKey(contractOptions.privateKey);

    return ElasticProxy.new({
        recursive: false,
        get (path: string) {
            return async function (args: any[], options?: SendOptions) {
                const abiMethod = contractOptions.abi.find((abi: any) => abi.name === path);

                ok(abiMethod, new Error("Cannot find method " + path + " in ABI for contract " + contractOptions.address + "."));

                const isView = ["view", "pure"].includes(abiMethod?.stateMutability);

                if (isView) {
                    return await runVMContractCall(vm, contractOptions.address, {
                        abi: contractOptions.abi,
                        args,
                        block: options?.block ?? contractOptions.block,
                        caller,
                        method: path
                    });
                } else {
                    return await runVMContractSend(vm, contractOptions.address, {
                        abi: contractOptions.abi,
                        args,
                        block: options?.block ?? contractOptions.block,
                        privateKey: contractOptions.privateKey,
                        method: path,
                        gasLimit: options?.gasLimit,
                        gasPrice: options?.gasPrice
                    });
                }
            }
        }
    }) as {
        [key: string]: (args: any[], options: SendOptions) => Promise<any[] | LegacyTransaction>
    };
}
