import { Address, hexToBytes } from "@ethereumjs/util";
import setVMAccount from "../modules/vm/setVMAccount";
import EVM from "./EVM.class";
import EVMAccount from "./EVMAccount.class";

export default class EVMAccountManager {

    public evm: EVM;
    private accounts: { [key: string]: EVMAccount } = {};

    constructor (evm: EVM) {
        this.evm = evm;
    }

    async init (keys: { [key: string]: Uint8Array }) {
        await Promise.all(Object.keys(keys).map(async (name) => {
            await this.add(name, keys[name]);
        }));
    }

    async add (name: string, privateKey: Uint8Array, options?: { nonce?: bigint, balance?: bigint }) {
        const address = Address.fromPrivateKey(privateKey);

        await setVMAccount(this.evm.vm, address, {
            nonce: options?.nonce,
            balance: options?.balance ?? this.evm.defaultBalance()
        });

        this.accounts[name] = new EVMAccount(this.evm, privateKey);
    }

    get (name: string) {
        return this.accounts[name];
    }

}
