import * as crypto from 'crypto'

export function sha256 (data: any, salt?: string) {
    if (salt) data = [ data, salt ];
    if(data instanceof Buffer)
        return crypto.createHash('sha256').update(data).digest('hex')

    if (typeof data === 'undefined')
        return crypto.createHash('sha256').update('').digest('hex')
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex')
}