import { ethers } from 'ethers';
import React, { Component } from 'react'
import dino from '../dino.png'
import ethLogo from '../ethLogo.png'


class PageContent extends Component {

  constructor(props) {
    super(props)
    // Default state.
    this.state = {
        output: '0',
    }
  }

  render() {
    return (
    <div id="content">
      <div className="card mb-4" >
        <div className="card-body">
          <form className="mb-3" onSubmit={(event) => {
              event.preventDefault()
              const etherAmount = this.input.value.toString();
              const weiAmount = ethers.utils.parseEther(etherAmount);
              this.props.buySh0nTokens(weiAmount);
            }}>
            <div>
              <label className="float-left"><b>Input</b></label>
              <span className="float-right text-muted">
                Balance: {ethers.utils.formatEther(this.props.ethBalance)}
              </span>
            </div>
            <div className="input-group mb-4">
              <input
                type="text"
                onChange={(event) => {
                  const etherAmount = this.input.value.toString();
                  this.setState({
                  output: etherAmount * 100
                  });
                }}
                ref={(input) => { this.input = input }}
                className="form-control form-control-lg"
                placeholder="0"
                required />
              <div className="input-group-append">
                <div className="input-group-text">
                  <img src={ethLogo} height='32' width='32' alt=""/>
                    ETH
                </div>
              </div>
            </div>
            <div>
              <label className="float-left"><b>Output</b></label>
              <span className="float-right text-muted">
                Balance: {ethers.utils.formatEther(this.props.sh0nTokenBalance)}
              </span>
            </div>
            <div className="input-group mb-2">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="0"
                value={this.state.output}
                disabled
              />
            <div className="input-group-append">
              <div className="input-group-text">
                <img src={dino} height='32' width='32' alt=""/>
                    Sh0n
              </div>
            </div>
            </div>
              <div className="mb-5">
                <span className="float-left text-muted">Exchange Rate</span>
                <span className="float-right text-muted">1 ETH = 100 ShonToken</span>
              </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg">Swap</button>
          </form>
        </div>
      </div>
    </div>
    );
  }
}

export default PageContent;
