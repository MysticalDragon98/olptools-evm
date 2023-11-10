import { Address } from "@ethereumjs/util"
import { VM } from "@ethereumjs/vm"

export default async function getVmAccountNonceForPrivKey (vm: VM, key: Uint8Array) {
    const address = Address.fromPrivateKey(key)
    const account = await vm.stateManager.getAccount(address)
    
    if (account) {
        return account.nonce;
    } else {
        return BigInt(0);
    }
}
