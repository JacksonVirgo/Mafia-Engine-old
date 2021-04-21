export const LOCAL_URL = 'http://localhost:5000';
export const isLocalURL = (url) => {
	return url === 'localhost' || url === '127.0.0.1' || url === '';
};
export const getServerURL = () => {
	const { hostname, protocol } = window.location;
	return isLocalURL(hostname) ? LOCAL_URL : `${protocol}//${hostname}`;
};
