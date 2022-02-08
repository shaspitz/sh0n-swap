import React, { Component } from 'react'
import Navbar from './Navbar'
import Main from './Main'
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from "ethers"
import EthSwapper from '../abis/EthSwapper.json'
import Sh0nToken from '../abis/Sh0nToken.json'
import './App.css'

class App extends Component {

  async componentWillMount() {
    const provider = await this.ConnectToMetaMask();
    await this.loadBlockchainData(provider);
    this.setState({ loading: false })
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
    window.ethereum.on('accountsChanged', this.onAccountsChanged);
    this.onAccountsChanged();

    // Store chain id from network query, handle chain change event. 
    window.ethereum.on('chainChanged', () => { window.location.reload() });
    const { chainId } = await provider.getNetwork();
    if (!chainId) {
      window.alert("No network/chainId found from provider!");
      return;
    }
    this.setState({chainId: chainId});
    
    // Check if Sh0nToken contract is deployed to connected network. 
    const sh0nTokenNetworkEntry = Sh0nToken.networks[chainId];
    if (!sh0nTokenNetworkEntry) {
      window.alert("Sh0nToken contract is not deployed to detected network!");
      return;
    }

    // Sh0n token contract interface, relevant to network of detected provider.
    const sh0nTokenContract = new ethers.Contract(sh0nTokenNetworkEntry.address, Sh0nToken.abi, provider);
    this.setState({ sh0nTokenContract });

    // Same process as above for the EthSwapper contract. 
    const ethSwapperNetworkEntry = EthSwapper.networks[chainId];
    if (!ethSwapperNetworkEntry) {
      window.alert("EthSwapper contract is not deployed to detected network!");
      return;
    }

    // Pass signer to this contract, not provider, since it'll invoke transactions. 
    const signer = await provider.getSigner();
    const ethSwapperContract = new ethers.Contract(ethSwapperNetworkEntry.address,
       EthSwapper.abi, signer);
    this.setState({ ethSwapperContract });
    
    await this.updateBalances();
 }

  async onAccountsChanged() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts().catch((err) => { console.error(err); });
    let account;
    if (accounts.length === 0) {
      window.alert("No accounts detected. Metamask may be locked.");
      account = '';
    } else account = accounts[0];
    this.setState({ currentAccount: account });
    await this.updateBalances();
  }

  // Query and store current ETH and Sh0nToken balances.
  async updateBalances() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let ethBalance, sh0nTokenBalance;

    if (this.state.currentAccount && this.state.sh0nTokenContract) {
      ethBalance = await provider.getBalance(this.state.currentAccount);
      sh0nTokenBalance = await this.state.sh0nTokenContract.balanceOf(this.state.currentAccount);
    }
    else {
      ethBalance = 0;
      sh0nTokenBalance = 0;
      console.log("Balances could not be updated.");
    }
    this.setState({ ethBalance: ethBalance.toString() }); 
    this.setState({ sh0nTokenBalance: sh0nTokenBalance.toString() });
  }

  async buySh0nTokens(ethAmountInWei) {
    let success = true;
    this.setState({loading: true});
    const transaction = await this.state.ethSwapperContract.buySh0nTokens(
      {value: ethAmountInWei}
    ).catch((err) => {
      success = false;
      console.log(err);
      window.alert("Transaction failed");
    });
    if (success)
     await transaction.wait().then(() => this.updateBalances());
    this.setState({loading: false});
  }

  constructor(props) {
    super(props)
    // Default state.
    this.state = {
      currentAccount: '',
      sh0nTokenContract: {},
      sh0nTokenBalance: '0',
      ethSwapperContract: {},
      ethBalance: '0',
      chainId: '',
      loading: true,
    }
    // Neccessary to set state in the callback. 
    this.onAccountsChanged = this.onAccountsChanged.bind(this);
    this.buySh0nTokens = this.buySh0nTokens.bind(this);
  }

  render() {
    let content;
    if (this.state.loading) {
      content = <p id="loader" className='text-center'>Loading...</p>
    } else {
      content = <Main
      ethBalance={this.state.ethBalance}
      sh0nTokenBalance={this.state.sh0nTokenBalance}
      buySh0nTokens={this.buySh0nTokens}
      />
    }
    return (
      <div>
        <Navbar account={this.state.currentAccount}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{maxWidth: '600px'}}>
              <div className="content mr-auto ml-auto">
                <a
                  href="https://github.com/smarshall-spitzbart"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
