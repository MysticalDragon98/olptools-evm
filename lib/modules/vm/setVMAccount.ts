import { Account, Address } from "@ethereumjs/util";
import { VM } from "@ethereumjs/vm";

export default async function setVMAccount (vm: VM, address: Address, { nonce, balance }: { nonce?: bigint, balance?: bigint } = {}) {
    const account = await vm.stateManager.getAccount(address);
    await vm.stateManager.putAccount(address, Account.fromAccountData({
        nonce: nonce ?? account.nonce,
        balance: balance ?? account.balance,
    }));
}
