import { Block } from "@ethereumjs/block";
import getVMContract from "../modules/vm/getVMContract";
import EVM from "./EVM.class";
import { Address } from "@ethereumjs/util";
import { ElasticProxy } from "@mysticaldragon/proxies";
import { LegacyTransaction } from "@ethereumjs/tx";

export default class EVMContract {

    public evm: EVM;
    public address: Address;
    public abi: any;

    constructor (evm: EVM, address: Address, abi: any) {
        this.evm = evm;
        this.address = address;
        this.abi = abi;
    }

    forAccount (privateKey: Uint8Array) {
        const contract = getVMContract(this.evm.vm, {
            address: this.address,
            privateKey,
            abi: this.abi
        });

        return ElasticProxy.new({
            recursive: false,

            get: (path: string) => {
                return async (...args: any[]) => {
                    const tx = await contract[path](args, {
                        block: this.evm.block(),
                        gasLimit: this.evm.gasLimit(),
                        gasPrice: this.evm.gasPrice()
                    });

                    if (!Array.isArray(tx)) this.evm.addTransaction(tx as LegacyTransaction);

                    return tx;
                }
            }
        })
    }

}
