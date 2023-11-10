import { Address } from "@ethereumjs/util";
import EVM from "./EVM.class";
import toVMAddress from "../modules/vm/toVMAddress";

export default class EVMAccount {

    public evm: EVM;
    public privateKey: Uint8Array;
    public address: Address;

    constructor (evm: EVM, privateKey: Uint8Array) {
        this.evm = evm;
        this.privateKey = privateKey;
        this.address = Address.fromPrivateKey(privateKey);
    }

    deployContract (type: string, args: any[]) {
        return this.evm.contracts.deploy(type, this.privateKey, args);
    }

    contract (type: string, address: Address | string) {
        return this.evm.contracts.contract(type, toVMAddress(address)).forAccount(this.privateKey);
    }

    hexAddress () {
        return this.address.toString();
    }

}
