class User {
    static instance = null;
    
    constructor(userData) {
        if (User.instance) {
            return User.instance;
        }
        
        this.email = userData.email;
        this.isAdmin = userData.isAdmin || false;
        
        User.instance = this;
    }

    static getInstance() {
        return User.instance;
    }

    static createInstance(userData) {
        User.instance = new User(userData);
        return User.instance;
    }

    static destroyInstance() {
        User.instance = null;
    }

    getEmail() {
        return this.email;
    }

    isUserAdmin() {
        return this.isAdmin;
    }

}

export default User;