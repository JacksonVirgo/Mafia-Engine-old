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
            let startIndex = findIndexesInString(array[i].role, playerReference.start);
            let endIndex = findIndexesInString(array[i].role, playerReference.end);
            let indent = 0;
            for (let f = 0; f < startIndex.length; f += 1) {
                if (startIndex[f] !== undefined && endIndex[f] !== undefined) {
                    let end = endIndex[f] - indent;
                    let start = startIndex[f] - indent;

                    let totalHandle = array[i].role.substr(start, end - start + playerReference.end.length);
                    let playerIndex = array[i].role.substring(start + playerReference.start.length, end);
                    let pindex = parseInt(playerIndex);
                    if (!isNaN(pindex)) {
                        let reference = array[pindex - 1];
                        if (reference !== undefined) {
                            let newLine = array[parseInt(playerIndex)-1].player;
                            array[i].role = array[i].role.split(`${playerReference.start}${playerIndex}${playerReference.end}`).join(newLine);
                            indent += totalHandle.length - newLine.length;
                        }
                    }
                }
            }

        }
        return array;
    }
}

var instance = new Rand();
module.exports = instance;