function absolute(base, relative) {
	if (!base && !relative) {
		return null;
	}
	var stack = base.split('/'),
		parts = relative.split('/');
	stack.pop(); // remove current file name (or empty string)
	// (omit if "base" is the current folder without trailing slash)
	for (var i = 0; i < parts.length; i++) {
		if (parts[i] == '.') continue;
		if (parts[i] == '..') stack.pop();
		else stack.push(parts[i]);
	}
	return stack.join('/');
}

function getParams(url) {
	let splitUrl = url.split('?');
	let baseUrl = splitUrl[0];
	let paramsRoot = splitUrl[1];
	let paramsList = paramsRoot.split('&');
	let result = {};
	for (let param of paramsList) {
		let split = param.split('=');
		result[split[0]] = split[1];
	}
	return { root: baseUrl, params: result };
}
function validate(url) {
	let validatedURL;
	try {
		validatedURL = new URL(url);
	} catch (err) {
		return false;
	}
	const prot = validatedURL.protocol;
	return prot === 'http:' || prot === 'https:';
}

module.exports = {
	absolute,
	getParams,
	validate,
};
