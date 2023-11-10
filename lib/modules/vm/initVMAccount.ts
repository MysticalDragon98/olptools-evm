import { Address } from "@ethereumjs/util";
import { VM } from "@ethereumjs/vm";
import setVMAccount from "./setVMAccount";

export default async function initVMAccount (vm: VM, address: Address) {
    await setVMAccount(vm, address, { nonce: BigInt(0), balance: BigInt(10) ** BigInt(18) })
}
