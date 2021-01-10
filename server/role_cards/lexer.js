const StringUtil = require("../util/stringUtil");
const LexerJSON = require("../data/lexer.json");
class Lexer {
    constructor() { }
    parse({ chunk, globals, value }) {
        let result = chunk;
        result = this.parseBoolean(result, value)
        for (const handle in value) {
            for (const global of globals) {
                result = result.split(`{{${global}}}`).join(globals[global]);
                value[handle] = value[handle].split(`{{${global.handle}}}`).join(global.content);
            }
            result = result.split(`{{${handle}}}`).join(value[handle]);
        }
        return result;
    }
    parseBoolean(chunk, value) {
        let result = chunk;
        let completed = false;
        while (!completed) {
            let { bracket, splitter, operators } = LexerJSON;
            let instances = StringUtil.findIndexesInString(result, bracket);
            if (instances.length >= 2) {
                const start = instances[0];
                const end = instances[1];

                let totalStr = result.substring(start, end + bracket.length);
                let withoutBracket = totalStr.substring(bracket.length, totalStr.length - bracket.length);
                let boolean = withoutBracket.substring(0, withoutBracket.indexOf(splitter));
                let content = withoutBracket.substring(withoutBracket.indexOf(splitter) + 1);
                
                let checkArray = boolean.split(operators.equals);
                let changedValue = (checkArray[1] === value[checkArray[0]]) ? content : "";
                result = result.replace(totalStr, changedValue);
            } else {
                completed = true;
            }
        }
        return result;
    }
}
const instance = new Lexer();
module.exports = instance;