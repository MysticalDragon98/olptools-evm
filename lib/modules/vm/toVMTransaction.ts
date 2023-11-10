import { LegacyTransaction } from "@ethereumjs/tx";
import { hexToBytes } from "@ethereumjs/util";

export default function toVMTransaction (tx: LegacyTransaction | string | Uint8Array) {
    if (typeof tx === "string") {
        return LegacyTransaction.fromSerializedTx(hexToBytes(tx));
    }

    if (tx instanceof Uint8Array) {
        return LegacyTransaction.fromSerializedTx(tx);
    }

    return tx;
}