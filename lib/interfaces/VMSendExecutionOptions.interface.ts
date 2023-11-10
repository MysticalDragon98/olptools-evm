import { Block } from "@ethereumjs/block";

export default interface VMSendExecutionOptions {
    privateKey: Uint8Array;
    method: string;
    abi: any;
    args: any[];
    block: Block;

    gasPrice?: bigint;
    gasLimit?: bigint;
}