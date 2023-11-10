import { VM } from "@ethereumjs/vm";

export default async function createVM () {
    return await VM.create();
}
