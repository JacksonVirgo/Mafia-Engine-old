const LOCAL_URL = 'http://localhost:5000';
const isLocalURL = (url) => {
	return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '';
};

export const getServerURL = () => {
	const { hostname, protocol } = window.location;
	return isLocalURL(hostname) ? LOCAL_URL : `${protocol}//${hostname}`;
};
