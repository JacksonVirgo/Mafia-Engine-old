"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadFilesRecursive = exports.loadFiles = void 0;
const glob_1 = __importDefault(require("glob"));
const util_1 = require("util");
let globPromise = (0, util_1.promisify)(glob_1.default);
const loadFiles = async (path, onEach = () => { }) => {
    let paths = [];
    let data = await globPromise(`${path}/*{.ts,.js}`);
    data.forEach((element) => {
        if (!element.endsWith('.d.ts')) {
            paths?.push(element);
            onEach(element);
        }
    });
    return paths;
};
exports.loadFiles = loadFiles;
const loadFilesRecursive = async (path, onEach = () => { }) => {
    return (0, exports.loadFiles)(path, onEach);
};
exports.loadFilesRecursive = loadFilesRecursive;
