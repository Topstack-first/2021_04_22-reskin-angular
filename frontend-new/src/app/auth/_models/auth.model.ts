export class Token {
    constructor(public access: string,
                public email: string) {
    }
}


export class User {
    public firstName: string;
    public lastName: string;
    public email: string;

    constructor(data) {
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
    }
}
