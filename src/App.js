import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';


class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message:''
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({manager, players, balance});
  }

  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction completion...'});

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value,'ether')
    });

    this.setState({ message: 'You have entered the lottery! Good luck!'});

  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Picking winner from Players...'});

    await lottery.methods.pickWinner({
      from: accounts[0]
    });

    this.setState({ message: 'Winner has been picked!'});
  };

  render() {
    return (
      <div>
        <h2>WELCOME TO LOTTERY CONTRACT</h2>
        <p>This contract is managed by {this.state.manager}.</p>
        <p>They are currently {this.state.players.length} playing for {web3.utils.fromWei(this.state.balance)} ether!</p>
        <hr />
        <form onSubmit={this.onSubmit}>
        <h3>Want to try your Luck?</h3>
        <div>
          <label>Amount of ether to enter lottery</label>
          <input value={this.state.value} onChange={event => this.setState({value:event.target.value})} />
          <button>Enter</button>
        </div>
        </form>
        < hr/>
        <h2>{this.state.message}</h2>
        <hr />
        <h4>Ready to Pick a Winner? <button onClick={this.onClick}>Pick</button></h4>

      </div>
    );
  }
}

export default App;
