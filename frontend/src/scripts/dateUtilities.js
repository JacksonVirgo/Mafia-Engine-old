import { attachSuffixOf } from './stringUtilities';
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function getCalendarDate() {
    let date = new Date();
    let currentDay = date.getDate();
    currentDay = attachSuffixOf(currentDay);
    let currentMonth = date.getMonth() + 1;
    return `${currentDay} ${months[currentMonth - 1]}`;
}
