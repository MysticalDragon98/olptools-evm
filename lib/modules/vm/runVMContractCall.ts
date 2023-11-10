import { Address, hexToBytes } from "@ethereumjs/util";
import { VM } from "@ethereumjs/vm";
import createVMFunctionCallTx from "./createVMFunctionCallTx";
import toVMAddress from "./toVMAddress";
import { Block } from "@ethereumjs/block";
import { defaultAbiCoder } from "@ethersproject/abi";

interface CallOptions {
    caller: Address;
    method: string;
    abi: any;
    args: any[];
    block: Block;
}
export default async function runVMContractCall (vm: VM, address: string | Address, options: CallOptions) {
    const abiFunction = options.abi.find((abi: any) => abi.name === options.method);
    const returnABI = abiFunction.outputs?.map((output: any) => output.type) ?? [];
    const sigHash = createVMFunctionCallTx(options.method, {
        types: abiFunction.inputs.map((input: any) => input.type),
        values: options.args
    });

    const result = await vm.evm.runCall({
        to: toVMAddress(address),
        caller: options.caller,
        origin: options.caller,
        data: hexToBytes(sigHash),
        block: options.block
    });

    if (result.execResult.exceptionError) throw result.execResult.exceptionError;

    return defaultAbiCoder.decode(returnABI, result.execResult.returnValue);
}
