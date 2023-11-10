import { Block } from "@ethereumjs/block";

export default async function createBlock () {
    return Block.fromBlockData({
        header: {
            extraData: new Uint8Array(97)
        }
    });
}
