import { Address, hexToBytes } from "@ethereumjs/util";
import { VM } from "@ethereumjs/vm";
import createVMFunctionCallTx from "./createVMFunctionCallTx";
import { LegacyTransaction } from "@ethereumjs/tx";
import toVMAddress from "./toVMAddress";
import getVmAccountNonceForPrivKey from "./getVmAccountNonceForPrivKey";
import VMSendExecutionOptions from "../../interfaces/VMSendExecutionOptions.interface";

export default async function generateVMContractSendTx (vm: VM, address: string | Address, options: VMSendExecutionOptions) {
    const abiFunction = options.abi.find((abi: any) => abi.name === options.method);
    const sigHash = createVMFunctionCallTx(options.method, {
        types: abiFunction.inputs.map((input: any) => input.type),
        values: options.args
    });

    return LegacyTransaction.fromTxData({
        to: toVMAddress(address),
        data: hexToBytes(sigHash),
        nonce: await getVmAccountNonceForPrivKey(vm, options.privateKey),
        gasPrice: options.gasPrice ?? BigInt(10),
        gasLimit: options.gasLimit ?? BigInt(1000000)
    }).sign(options.privateKey);
}
