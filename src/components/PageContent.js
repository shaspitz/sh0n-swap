import React, { Component } from 'react'
import BuyForm from './BuyForm';
import SellForm from './SellForm';

class PageContent extends Component {

  constructor(props) {
    super(props)
    this.state = {
        currentForm: 'buy',
    }
  }

  render() {
    let content;
    if (this.state.currentForm === "buy") {
      content = <BuyForm
          ethBalance={this.props.ethBalance}
          sh0nTokenBalance={this.props.sh0nTokenBalance}
          buySh0nTokens={this.props.buySh0nTokens}
          />
    } else {
      content = <SellForm
          ethBalance={this.props.ethBalance}
          sh0nTokenBalance={this.props.sh0nTokenBalance}
          buySh0nTokens={this.props.buySh0nTokens}
          />
    }
    return (
    <div id="content" className='mt-3'>
      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-light"
          onClick={(event) => {
            this.setState({ currentForm: 'buy' })
          }}
        >
        Buy
        </button>
        <button
          className="btn btn-light"
          onClick={(event) => {
            this.setState({ currentForm: 'sell' })
          }}
        >
        Sell
        </button>
      </div>
      <div className="card mb-4" >
        <div className="card-body">
          {content }
        </div>
      </div>
    </div>
    );
  }
}

export default PageContent;
