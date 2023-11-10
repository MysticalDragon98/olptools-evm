import { VM } from "@ethereumjs/vm";
import createVMDeploymentTx from "./createVMDeploymentTx";
import { LegacyTransaction } from "@ethereumjs/tx";
import buildVmTx from "./buildVmTx";
import getVmAccountNonceForPrivKey from "./getVmAccountNonceForPrivKey";
import { Block } from "@ethereumjs/block";

interface DeployOptions {
    privateKey: Uint8Array;
    bytecode: string;
    abi: any;
    args: any[]
    block: Block;
}
export default async function deployVMContract (vm: VM, options: DeployOptions) {
    const types = options.abi.find((x: any) => x.type === "constructor").inputs.map((x: any) => x.type);
    const data = createVMDeploymentTx(options.bytecode, { types: types, values: options.args });
    const vmTx = await buildVmTx({
        data,
        nonce: await getVmAccountNonceForPrivKey(vm, options.privateKey)
    });
    
    const tx = LegacyTransaction.fromTxData(vmTx).sign(options.privateKey);
    const deployment = await vm.runTx({ tx, block: options.block });

    if (deployment.execResult.exceptionError) throw deployment.execResult.exceptionError;

    return {
        address: deployment.createdAddress,
        tx: tx
    };
}
