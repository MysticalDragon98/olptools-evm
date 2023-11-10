import { VM } from "@ethereumjs/vm";
import createVM from "../modules/vm/createVM";
import EVMAccountManager from "./EVMAccountManager.class";
import EVMContractManager from "./EVMContractManager.class";
import { BlockData } from "@ethereumjs/block";
import EVMBlock from "./EVMBlock.class";
import { LegacyTransaction } from "@ethereumjs/tx";
import { sha256 } from "../modules/utils/sha256";
import { bytesToHex, hexToBytes } from "@ethereumjs/util";
import runVMContractTx from "../modules/vm/runVMContractTx";
import toVMTransaction from "../modules/vm/toVMTransaction";

interface EVMCreateOptions {
    transactions?: LegacyTransaction[] | string[] | Uint8Array[],
    accounts?: { [key: string]: Uint8Array };
    abis?: { [key: string]: { abi: any, bytecode: string } }

    gasLimit?: bigint;
    gasPrice?: bigint;
    defaultBalance?: bigint;

    salt?: string;
}

export default class EVM {

    public vm: VM;
    public accounts: EVMAccountManager;
    public contracts: EVMContractManager;
    private _transactions: LegacyTransaction[] = [];
    private _gasSettings = {
        gasLimit: BigInt(10) ** BigInt(16),
        gasPrice: BigInt(10),
        defaultBalance: BigInt(1000000000000000000000000000000000)
    };

    private salt;

    currentBlock: EVMBlock;

    private constructor (options: EVMCreateOptions) {
        this.accounts = new EVMAccountManager(this);
        this.contracts = new EVMContractManager(this);
        this.currentBlock = new EVMBlock(this, { header: { extraData: new Uint8Array(97) }});

        if (options?.gasLimit) this._gasSettings.gasLimit = options.gasLimit;
        if (options?.gasPrice) this._gasSettings.gasPrice = options.gasPrice;
        if (options?.defaultBalance) this._gasSettings.defaultBalance = options.defaultBalance;

        this.salt = options?.salt || "no-salt";
    }

    async init () {
        this.vm = await createVM();
        return this;
    }

    static async create (options?: EVMCreateOptions) {
        const evm = new EVM(options);
        await evm.init();

        if (options?.accounts) await evm.accounts.init(options.accounts);
        if (options?.abis) evm.contracts.initContracts(options.abis);
        if (options?.transactions) await evm.runTransactions(options.transactions.map(toVMTransaction));

        return evm;
    }

    createBlock (data: BlockData) {
        this.currentBlock = new EVMBlock(this, data);
    }

    block () {
        return this.currentBlock.block;
    }

    defaultBalance () {
        return this._gasSettings.defaultBalance;
    }

    gasLimit () {
        return this._gasSettings.gasLimit;
    }

    gasPrice () {
        return this._gasSettings.gasPrice;
    }

    setGasLimit (gasLimit: bigint) {
        this._gasSettings.gasLimit = gasLimit;
    }

    setGasPrice (gasPrice: bigint) {
        this._gasSettings.gasPrice = gasPrice;
    }
    
    addTransaction (tx: LegacyTransaction) {
        this._transactions.push(tx);
    }

    transactions () {
        return this._transactions;
    }

    serializedTransactions () {
        const txs = this._transactions.map(tx => bytesToHex(tx.serialize()));
        let hash = sha256(this.salt);

        for (const tx of txs) hash = sha256(hash + sha256(tx));

        return {
            transactions: txs,
            salt: this.salt,
            hash
        }
    }

    async runTransactions (transactions: LegacyTransaction[]) {
        for (const tx of transactions) {
            await this.runTransaction(tx);
        }
    }

    async runTransaction (tx: LegacyTransaction) {
        await runVMContractTx(this.vm, {
            block: this.block(),
            tx
        });

        this.addTransaction(tx);
    }
}
