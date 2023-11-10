import { defaultAbiCoder } from "@ethersproject/abi";

export default function createVMDeploymentTx (bytecode: string, params: { types: string[], values: any[] }) {
    return bytecode + defaultAbiCoder.encode(params.types, params.values).slice(2);
}
