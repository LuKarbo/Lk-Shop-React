class User {
    static instance = null;
    
    constructor(userData) {
        if (User.instance) {
            return User.instance;
        }

        Object.assign(this, userData);

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

    getId() {
        return this.id;
    }

    getEmail() {
        return this.email;
    }

    getName() {
        return this.name;
    }

    getIdPermissions() {
        return this.id_permissions;
    }

    getProfileIMG() {
        return this.profileIMG;
    }

    getProfileBanner() {
        return this.profileBanner;
    }

    getIsAdmin() {
        return this.isAdmin;
    }

    getStatusName() {
        return this.status_name;
    }

    setId(id) {
        if (typeof id === 'string' && id.trim()) {
            this.id = id;
        } else {
            throw new Error('Invalid id');
        }
    }

    setEmail(email) {
        if (typeof email === 'string' && email.includes('@')) {
            this.email = email;
        } else {
            throw new Error('Invalid email');
        }
    }

    setName(name) {
        if (typeof name === 'string' && name.trim()) {
            this.name = name;
        } else {
            throw new Error('Invalid name');
        }
    }

    setIdPermissions(id_permissions) {
        if (typeof id_permissions === 'string' && id_permissions.trim()) {
            this.id_permissions = id_permissions;
        } else {
            throw new Error('Invalid permissions id');
        }
    }

    setProfileIMG(profileIMG) {
        if (typeof profileIMG === 'string' && profileIMG.trim()) {
            this.profileIMG = profileIMG;
        } else {
            throw new Error('Invalid profile image URL');
        }
    }

    setProfileBanner(profileBanner) {
        if (typeof profileBanner === 'string' && profileBanner.trim()) {
            this.profileBanner = profileBanner;
        } else {
            throw new Error('Invalid profile banner URL');
        }
    }

    setIsAdmin(isAdmin) {
        if (typeof isAdmin === 'boolean') {
            this.isAdmin = isAdmin;
        } else {
            throw new Error('Invalid admin flag');
        }
    }

    setStatusName(status_name) {
        if (typeof status_name === 'string' && status_name.trim()) {
            this.status_name = status_name;
        } else {
            throw new Error('Invalid status name');
        }
    }
}

export default User;
