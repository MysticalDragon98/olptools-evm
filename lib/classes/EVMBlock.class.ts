import { Block, BlockData } from "@ethereumjs/block";
import EVM from "./EVM.class";
import { LegacyTransaction } from "@ethereumjs/tx";
import { bytesToHex } from "@ethereumjs/util";

export default class EVMBlock {

    public evm: EVM;
    public block: Block;

    constructor (evm: EVM, data: BlockData) {
        this.block = Block.fromBlockData(data);
    }
}
