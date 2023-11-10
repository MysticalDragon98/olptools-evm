import { Address } from "@ethereumjs/util";

export default function toVMAddress (address: string | Address) {
    if (typeof address === "string") return Address.fromString(address);

    return address;
}
