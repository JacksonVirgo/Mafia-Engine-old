import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

class Doc extends React.Component {
  componentDidMount() {
    document.title = "Mafia Engine";
  }
  render() {
    return (
      <React.StrictMode>
        <App />
      </React.StrictMode>);
  }
}

ReactDOM.render(
  <Doc />,
  document.getElementById('root')
);