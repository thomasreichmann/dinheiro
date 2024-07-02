export class UserService extends Service {
    constructor() {
        super('/api/session');
    }
    protected createInstance(): Service {
        return new UserService();
    }
}
