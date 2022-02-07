"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
function App() {
    return <div>
    <h1>Mafia Engine</h1>
    <p>This website is being reworked. Please come back on a later date</p>
  </div>;
}
react_dom_1.default.render(<react_1.default.StrictMode>
    <App />
  </react_1.default.StrictMode>, document.getElementById('root'));
