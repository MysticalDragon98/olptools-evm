import { Block } from "@ethereumjs/block";
import { LegacyTransaction } from "@ethereumjs/tx";

export default interface VMSendTxOptions {
    tx: LegacyTransaction;
    block: Block;
}