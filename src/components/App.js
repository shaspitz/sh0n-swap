import React, { Component } from 'react'
import dino from '../dino.png'
import './App.css'
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from "ethers"

class App extends Component {

  async componentWillMount() {
    const provider = await this.ConnectToMetaMask();
    await this.loadBlockchainData(provider);
  }

  async ConnectToMetaMask() {
    // Preferred way to detect the Ethereum provider. See https://docs.metamask.io/guide/ethereum-provider.html.
    const metaMaskprovider = await detectEthereumProvider()
    if (metaMaskprovider) {
      console.log("MetaMask Ethereum provider detected.");
      if (metaMaskprovider !== window.ethereum)
        console.error('Do you have multiple wallets installed?');
      return new ethers.providers.Web3Provider(metaMaskprovider);
    }
    window.alert("Please install MetaMask!");
  }

  async loadBlockchainData(provider) {
    // Store current acount, handle account change event. 
    const accounts = await provider.listAccounts()
    .catch((err) => {
      console.error(err);
    });
    this.setState({currentAccount: accounts[0]});
    window.ethereum.on('accountsChanged', this.handleAccountsChanged);

    // Store chain id, handle chain change event. 
    const chainId = await provider.getNetwork();
    this.setState({chainId: chainId});
    window.ethereum.on('chainChanged', () => { window.location.reload() });

    // Store current eth balance.
    const ethBalance = await provider.getBalance(this.state.currentAccount);
    this.setState({ ethBalance });
  }

  handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      console.log('Please connect to MetaMask. Metamask is locked or the user has not connected any accounts.');
      return;
    }
    if (accounts[0] !== this.state.currentAccount) 
      this.setState({currentAccount: accounts[0]});
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://github.com/smarshall-spitzbart"
            target="_blank"
            rel="noopener noreferrer"
          >
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="https://github.com/smarshall-spitzbart"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={dino} className="App-logo" alt="logo" /> 
                </a>
                <h1>Shawns first html stuff</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
