export class BCUException extends Error {
    constructor(message?: string) {
        if (!message) {
            message = 'There was en error requesting the data.'
        }
        super(message)
        Object.setPrototypeOf(this, BCUException.prototype)
    }
}
