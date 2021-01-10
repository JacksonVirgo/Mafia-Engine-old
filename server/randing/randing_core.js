const random = require("../util/random");
const { findIndexesInString } = require("../util/stringUtil");
const stringUtil = require("../util/stringUtil");
class Rand {
    constructor() { 
        this.random = random;
    }
    rand(players, roleList) {
        let randPlayers = random.shuffleArray(players.split("\n"));
        let final = [];
        for (let i = 0; i < randPlayers.length; i++) {
            final.push({
                player: randPlayers[i].replace("\r",""),
                role: roleList[i]
            });
        }

        final = this.playerReferences(final);
        return final;
    }

    playerReferences(playerList) {
        let array = playerList;

        let playerReference = {
            start: "{{Player_",
            end: "}}"
        }        
        for (var i = 0; i < array.length; i++) {
            array[i].role = array[i].role.split(`{{Player}}`).join(array[i].player);
            let playerIndex = array[i].role.substring(findIndexesInString(array[i].role, playerReference.start)[0] + playerReference.start.length, findIndexesInString(array[i].role, playerReference.end)[0]);
            let pindex = parseInt(playerIndex);
            console.log(playerIndex);
            if (!isNaN(pindex)) {
                let reference = array[pindex - 1];
                if (reference !== undefined) {
                    array[i].role = array[i].role.split(`${playerReference.start}${playerIndex}${playerReference.end}`).join(array[parseInt(playerIndex)-1].player);
                }
            }
        }
        return array;
    }
}

var instance = new Rand();
module.exports = instance;