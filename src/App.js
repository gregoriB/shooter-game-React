import React, { Component } from 'react';
import './App.css';
import Arena from './components/world/Arena';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Arena />
      </div>
    );
  }
}

export default App;
