import { Interface, defaultAbiCoder } from "@ethersproject/abi";

export default function createVMFunctionCallTx (method: string, params: { types: string[], values: any[]}) {
    const signature = new Interface([`function ${method}(${params.types.join(",")})`]).getSighash(method);
    const args = defaultAbiCoder.encode(params.types, params.values);

    return signature + args.slice(2);
}
