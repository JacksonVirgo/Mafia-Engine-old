module.exports = class {

    /**
     * Create a Settings class.
     * @param {Object} settings 
     */
    constructor() {
        this.settings = {}; // JS Object
        this.slotList = {
            // [currentUser]: [currentUser],
            // [replacement]: [currentUser]
        };
    }
    addSetting(handle, setting) {
        switch(handle) {
            case "playerList":
                this.addPlayers(setting);
                break;
            default:
                break;
        }
    }
    addPlayers(players) {
        let slots = players.split(",");
        for (let i = 0; i < slots.length; i++) {
            let slot = slots[i];
            let players = slot.split(":");
            for (let f = 0; f < players.length; f++) {
                this.slotList[players[f]] = players[0];
            }
        }
        console.log(this.slotList);
    }
}