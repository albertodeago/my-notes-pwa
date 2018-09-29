export default class User {
    constructor({id, nickname, creationDate = new Date(), email, lastLogin = new Date(), lastUpdate = new Date(), password}) {
        this.id = id
        this.nickname = nickname        
        this.creationDate = creationDate;
        this.email = email;
        this.lastLogin = lastLogin;
        this.lastUpdate = lastUpdate;
        this.password = password;
    }

    toObject() {
        return {
            id: this.id,
            nickname: this.nickname,
            creationDate: this.creationDate,
            email: this.email,
            lastLogin: this.lastLogin,
            lastUpdate: this.lastUpdate,
            password: this.password
        }
    }
}

export { User }