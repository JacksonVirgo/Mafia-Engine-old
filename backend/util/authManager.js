const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function hashPassword(password) {
	return await bcrypt.hash(password, 10);
}
async function checkPassword(pass, hashPass) {
	return await bcrypt.compare(pass, hashPass);
}
function generateJWT(data) {
	return jwt.sign(data, process.env.JWT_SECRET);
}
function verifyJWT(token) {
	const verified = jwt.verify(token, process.env.JWT_SECRET);
	return verified;
}
function generateSecurityToken(charLength) {
	let securityToken = '';
	for (let i = 0; i < charLength; i++) {
		securityToken += Math.floor(Math.random() * 10);
	}
	return securityToken;
}
function authenticateToken(req, res, next) {
	const token = req.header('auth-token');
	const accessDenied = { error: true, message: 'Access Denied' };
	if (!token) return res.status(401).json(accessDenied);
	try {
		const verified = jwt.verify(token, process.env.JWT_SECRET);
		req.user = verified;
	} catch (err) {
		return res.status(401).json(accessDenied);
	}
	next();
}

module.exports = {
	hashPassword,
	checkPassword,
	generateJWT,
	verifyJWT,
	generateSecurityToken,
	authenticateToken,
};
