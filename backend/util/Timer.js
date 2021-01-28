const times = {};

function timeStart(index) {
    if (times[index]) {
        console.log(`Attempted to start a timer on ${index} when it already exists`);
    } else {
        times[index] = new Date();
    }
}
function timeEndSeconds(index) {
    let result = null;
    if (times[index]) {
        let startTime = times[index];
        delete times[index];
        let endTime = new Date();
        let seconds = secondsDifference(startTime, endTime);
        result = seconds;
        console.log(`Timer ${index} ended with a time of ${seconds}`)
    } else {
        console.log(`Attempted to end a timer on ${index} that does not exist`);
    }
    return result;
}

function timeFunction(func) {
    let start = new Date();

    

    let end = new Date();
}

function secondsDifference(before, after) {
    let difference= before.getTime() - after.getTime();
    let secondsDif = difference / 1000;
    let secondsTotal = Math.abs(secondsDif);
    return secondsTotal;
}

module.exports = {
    timeStart,
    timeEndSeconds
}