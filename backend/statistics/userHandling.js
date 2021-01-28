class Stats {
    constructor() {
        this.currentUsersOnline = 0;
        this.highestUsersOnline = 0;
    }
    addUser() {
        this.currentUsersOnline += 1;
        if (this.currentUsersOnline > this.highestUsersOnline) {
            this.updateHighestUsers(this.currentUsersOnline);
        }
    }
    removeUser() {
        this.currentUsersOnline -= 1;
    }
    updateHighestUsers(users) {
        console.log("Highest User Count: " + users);
        this.highestUsersOnline = users;
    }
}

module.exports = new Stats();