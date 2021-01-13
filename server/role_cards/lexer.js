const StringUtil = require("../util/stringUtil");
const LexerJSON = require("../data/lexer.json");

class Lexer {
    constructor() { }
    parse({ chunk, globals, value }) {
        let result = chunk;
        const TOKEN_ARRAY = StringUtil.scanStringForTokens(result, [LexerJSON.handle.open, LexerJSON.handle.close]);
        const looseOpenBrace = [];
        const pairedBraces = [];
        let indent = 0;

        for (const TOKEN of TOKEN_ARRAY) {
            switch (TOKEN.token) {
                case LexerJSON.handle.open:
                    looseOpenBrace.push(TOKEN);
                    break;
                case LexerJSON.handle.close:
                    let lastOpen = looseOpenBrace[looseOpenBrace.length-1];
                    looseOpenBrace.pop();
                    pairedBraces.push({open: lastOpen, close: TOKEN});
                    break;
                default:
                    console.log("Unknown Token");
                    break;
            }
        }
        for (const braces of pairedBraces) {
            const { open, close } = braces;
            const totalString = chunk.substring(open.index - indent, close.index + close.token.length - indent);
            const inner = totalString.substring(LexerJSON.handle.open.length, totalString.length - LexerJSON.handle.close.length);
        }
        return result;
    }

            // result = this.parseBoolean(result, value)
        // for (const handle in value) {
        //     let wrappedHandle = this.wrapHandle(handle);
        //     for (const global of globals) {
        //         let wrappedGlobal = this.wrapHandle(global.handle);
        //         result = StringUtil.findReplace(result, wrappedGlobal, global.content);
        //         value[handle] = StringUtil.findReplace(value[handle], wrappedGlobal, global.content);
        //     }
        //     result = StringUtil.findReplace(result, wrappedHandle, value[handle]);
        // }
    parseTest(chunk, value) {
        let bracketOpen = LexerJSON.handle.open;
        let bracketClose = LexerJSON.handle.close;
        
        let bracketOpenInstances = StringUtil.findIndexesInString(chunk, bracketOpen);
        for (let i = 0; i < bracketOpenInstances.length; i++) {
            let followingString = StringUtil.splitAt(chunk, bracketOpenInstances[i] + bracketOpen.length)[1];
            console.log(bracketOpenInstances[i]);
        }
    }
    parseBoolean(chunk, value) {
        let result = chunk;
        let completed = false;
        while (!completed) {
            let { bracket, splitter, operators } = LexerJSON;
            let instances = StringUtil.findIndexesInString(result, bracket);
            if (instances.length >= 2) {
                const start = instances[0].index;
                const end = instances[1].index;

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
    wrapHandle(handle) {
        return LexerJSON.handle.open + handle + LexerJSON.handle.close;
    }
}

const instance = new Lexer();
module.exports = instance;