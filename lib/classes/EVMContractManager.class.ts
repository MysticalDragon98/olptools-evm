import { ok } from "assert";
import EVM from "./EVM.class";
import EVMContract from "./EVMContract.class";
import { Address } from "@ethereumjs/util";
import { Block } from "@ethereumjs/block";
import deployVMContract from "../modules/vm/deployVMContract";

export default class EVMContractManager {

    evm: EVM;
    private contracts: { [key: string]: { abi: any, bytecode: string } } = {};

    constructor (evm: EVM) {
        this.evm = evm;
    }

    initContracts (contracts: { [key: string]: { abi: any, bytecode: string } }) {
        this.contracts = contracts;
    }

    defineContract (name: string, abi: any, bytecode: string) {
        this.contracts[name] = { abi, bytecode };
    }

    async deploy (type: string, privateKey: Uint8Array, args: any[]) {
        ok(this.contracts[type], new Error("Cannot find ABI for contract type " + type + "."));

        const { address, tx } = await deployVMContract(this.evm.vm, {
            args,
            block: this.evm.block(),
            bytecode: this.contracts[type].bytecode,
            privateKey: privateKey,
            abi: this.contracts[type].abi
        });

        this.evm.addTransaction(tx);

        return address;
    }

    contract (type: string, address: Address) {
        ok(this.contracts[type], new Error("Cannot find ABI for contract type " + type + "."));

        return new EVMContract(this.evm, address, this.contracts[type].abi);
    }

}
