let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function attachSuffixOf(i) {
    let j = i % 10,
        k = i % 100;
    if (j === 1 && j !== 11) return i + 'st';
    else if (j === 2 && k !== 12) return i + 'nd';
    else if (j === 3 && k !== 13) return i + 'rd';
    else return i + 'th';
}

function getCalendarDate() {
    let date = new Date();
    let currentDay = date.getDate();
    currentDay = attachSuffixOf(currentDay);
    let currentMonth = date.getMonth() + 1;
    return `${currentDay} ${months[currentMonth - 1]}`;
}

const milliseconds = (h, m, s) => (h * 60 * 60 + m * 60 + s) * 1000;
const msToTime = (duration) => {
    return {
        seconds: duration / 1000,
        minutes: duration / (1000 * 60),
        hours: duration / (1000 * 60 * 60),
    };
};

module.exports = { getCalendarDate };
