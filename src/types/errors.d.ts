class UnauthorizedError extends Error {
    public readonly message: 'Unauthorized' 
    public readonly status: 401

    constructor() {
        super()
    }
}