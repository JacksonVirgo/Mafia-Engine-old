const StringUtil = require('../../util/stringUtil');
const LexerJSON = require('../../data/lexer.json');

class Value {
    constructor(values, globals) {
        this.handles = values;
        this.globals = globals;
    }
    merge() {
        for (let i = 0; i < this.handles.length; i++) {
            for (const global in this.globals) {
                this.handles[i] = Object.assign(this.handles[i], global);
            }
        }
    }
}

//#region Lexer

/**
 * 
 * @param {string} block  
 * @param {Value} values
 */
function lex(block, values) {
    let result = block;
    result = parseHandles(block, values);
    const TOKEN_ARRAY = StringUtil.scanStringForTokens(block, [LexerJSON.handle.open, LexerJSON.handle.close]);
    const looseOpenBrace = [];
    const pairedBraces = [];
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
        const totalString = block.substring(open.index - indent, close.index + close.token.length - indent);
        const inner = totalString.substring(LexerJSON.handle.open.length, totalString.length - LexerJSON.handle.close.length);
        let parsed = this.parseString(inner, globals, value);
        //block = StringUtil.findReplace(result, totalString, parsed);
    }
}

/**
 * Scan a string for specific handles and replace them with
 * the according content.
 * @param {string} block String of the command block.
 * @param {Value} values Object containing values. 
 */
function parseHandles(block, values) {
    let result = block;
    if (block.startsWith(LexerJSON.commands.conditional)) {} 
    else if (block.startsWith(LexerJSON.commands.player)) {} 
    else {
        for (const handle in values.handles) {
            for (const global of values.globals) {
                result = StringUtil.findReplace(result, wrapHandle(global.handle), global.content);
                values.handles[handle] = (wrapHandle(handle) === wrapHandle(global.handle) ? global.content : values.handles[handle]);
            }
            result = StringUtil.findReplace(result, wrapHandle(handle), values.handles[handle]);
        }
    }
    return result;
}

function parseConditional(block, values) {
    let result = block;
    let completed = false;
    while (!completed) {
        let { bracket, splitter, operators } = LexerJSON;
        let instances = StringUtil.scanStringForTokens(result, [bracket.open, bracket.close]);
        let looseOpenBrace = [];
        let pairedBraces = [];
        for (let i = 0; i < instances.length; i++) {
            switch (instances[i].token) {
                case LexerJSON.bracket.open:
                    looseOpenBrace.push(instances[i]);
                    break;
                case LexerJSON.bracket.close:
                    let openBrace = looseOpenBrace.pop();
                    pairedBraces.push([openBrace, instances[i]]);
                    break;
            }
        }
        // if (instances.length >= 2) {
            
        //     const start = instances[0].index;
        //     const end = instances[1].index;

        //     let totalStr = result.substring(start, end + bracket.length);
        //     let withoutBracket = totalStr.substring(bracket.length, totalStr.length - bracket.length);
        //     let boolean = withoutBracket.substring(0, withoutBracket.indexOf(splitter));
        //     let content = withoutBracket.substring(withoutBracket.indexOf(splitter) + 1);
                
        //     let checkArray = boolean.split(operators.equals);
        //     let changedValue = (checkArray[1] === value[checkArray[0]]) ? content : "";
        //     result = result.replace(totalStr, changedValue);
        // } else {
        //     completed = true;
        // }
    }
    return result;
}

function wrapHandle(handle) {
    return LexerJSON.handle.open + handle + LexerJSON.handle.close;
}

class Lexer {
    constructor() { }
    parse({ block, globals, value }) {
        let values = new Value(value, globals);
        //let result = lex(block);
        let result = parseHandles(block, values);
        return result;
    }  
}
//#endregion

const instance = new Lexer();

module.exports = { lex: instance.parse };