import { VM } from "@ethereumjs/vm";
import createVMDeploymentTx from "./createVMDeploymentTx";
import { LegacyTransaction } from "@ethereumjs/tx";
import buildVmTx from "./buildVmTx";
import getVmAccountNonceForPrivKey from "./getVmAccountNonceForPrivKey";
import { Block } from "@ethereumjs/block";

interface DeployOptions {
    privateKey: Uint8Array;
    bytecode: string;
    types: string[];
    args: any[]
    block: Block;
}
export default async function deployVMContract (vm: VM, options: DeployOptions) {
    const data = createVMDeploymentTx(options.bytecode, { types: options.types, values: options.args });
    const vmTx = await buildVmTx({
        data,
        nonce: await getVmAccountNonceForPrivKey(vm, options.privateKey)
    });
    
    const tx = LegacyTransaction.fromTxData(vmTx).sign(options.privateKey);
    const deployment = await vm.runTx({ tx, block: options.block });

    if (deployment.execResult.exceptionError) throw deployment.execResult.exceptionError;

    return deployment.createdAddress;
}
