import { Block } from "@ethereumjs/block";
import { Address, hexToBytes } from "@ethereumjs/util";
import createVMFunctionCallTx from "./createVMFunctionCallTx";
import { VM } from "@ethereumjs/vm";
import toVMAddress from "./toVMAddress";
import { LegacyTransaction } from "@ethereumjs/tx";
import getVmAccountNonceForPrivKey from "./getVmAccountNonceForPrivKey";
import { defaultAbiCoder } from "@ethersproject/abi";

interface SendOptions {
    privateKey: Uint8Array;
    method: string;
    abi: any;
    args: any[];
    block: Block;

    gasPrice?: bigint;
    gasLimit?: bigint;
}
export default async function runVMContractSend (vm: VM, address: string | Address, options: SendOptions) {
    const abiFunction = options.abi.find((abi: any) => abi.name === options.method);
    const returnABI = abiFunction.outputs?.map((output: any) => output.type) ?? [];
    const sigHash = createVMFunctionCallTx(options.method, {
        types: abiFunction.inputs.map((input: any) => input.type),
        values: options.args
    });

    const tx = LegacyTransaction.fromTxData({
        to: toVMAddress(address),
        data: hexToBytes(sigHash),
        nonce: await getVmAccountNonceForPrivKey(vm, options.privateKey),
        gasPrice: options.gasPrice ?? BigInt(10),
        gasLimit: options.gasLimit ?? BigInt(1000000)
    }).sign(options.privateKey);

    const result = await vm.runTx({ tx, block: options.block });

    if (result.execResult.exceptionError) throw result.execResult.exceptionError;

    return defaultAbiCoder.decode(returnABI, result.execResult.returnValue);
}
