const ref = {
	ms: {
		post: 'div.post',
		author: '.inner > .postprofilecontainer > .postprofile > dt > a',
		url: 'div.inner > div.postbody > p.author > a > strong::parent',
		number: 'div.inner > div.postbody > p.author > a > stong:first',
		content: 'div.inner > div.postbody > div.content:first',
		ignore: ['blockquote'],
		votes: 'span.bbvote, span.noboldsig',
	},
};
module.exports = ref;
