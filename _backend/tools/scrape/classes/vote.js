class Vote {
    constructor(author, pronoun=null, vote=null, link=null) {
        this.author = author;
        this.pronoun = pronoun;
        this.vote = vote;
        this.link = link;
    }
    setVote(vote) {
        this.vote = vote;
        if (this.vote.startsWith("VOTE: ")) {
            this.vote = this.vote.substr("VOTE: ".length, this.vote.length - "VOTE: ".length);
        }
    }
    asJSON() {
        return {
            author: this.author,
            pronoun: this.pronoun,
            vote: this.vote
        }
    }
}
Vote.list = [];
Vote.getList = () => {
    let result = [];
    for (const val of Vote.list) {
        result.push(val.asJSON());
    }
    return result;
}


module.exports = Vote;