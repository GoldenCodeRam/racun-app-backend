export namespace DatabaseErrors {
    export class LastSuperUserError extends Error {
        constructor() {
            super("Tried to update or remove the last Super User!");
        }
    }
}
