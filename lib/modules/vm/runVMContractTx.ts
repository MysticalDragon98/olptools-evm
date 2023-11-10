import { VM } from "@ethereumjs/vm";
import VMSendTxOptions from "../../interfaces/VMSendTxOptions.interface";

export default async function runVMContractTx (vm: VM, options: VMSendTxOptions) {
    const result = await vm.runTx({ tx: options.tx, block: options.block });

    if (result.execResult.exceptionError) throw result.execResult.exceptionError;
}
