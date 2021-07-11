import { attachSuffixOf } from './stringUtilities';
let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function getCalendarDate() {
	let date = new Date();
	let currentDay = date.getDate();
	currentDay = attachSuffixOf(currentDay);
	let currentMonth = date.getMonth() + 1;
	return `${currentDay} ${months[currentMonth - 1]}`;
}

export const milliseconds = (h, m, s) => (h * 60 * 60 + m * 60 + s) * 1000;
export const msToTime = (duration) => {
	return {
		seconds: duration / 1000,
		minutes: duration / (1000 * 60),
		hours: duration / (1000 * 60 * 60),
	};
};
