import { Address } from "@ethereumjs/util";
import createVMFunctionCallTx from "./createVMFunctionCallTx";
import { VM } from "@ethereumjs/vm";
import { defaultAbiCoder } from "@ethersproject/abi";
import generateVMContractSendTx from "./generateVMContractSendTx";
import VMSendExecutionOptions from "../../interfaces/VMSendExecutionOptions.interface";


export default async function runVMContractSend (vm: VM, address: string | Address, options: VMSendExecutionOptions) {
    const abiFunction = options.abi.find((abi: any) => abi.name === options.method);
    const returnABI = abiFunction.outputs?.map((output: any) => output.type) ?? [];
    const tx = await generateVMContractSendTx(vm, address, options);

    const result = await vm.runTx({ tx, block: options.block });

    if (result.execResult.exceptionError) throw result.execResult.exceptionError;

    return tx;
}
