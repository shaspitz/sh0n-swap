import React, { Component } from 'react'
import BuyForm from './BuyForm';


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
          <BuyForm
          ethBalance={this.props.ethBalance}
          sh0nTokenBalance={this.props.sh0nTokenBalance}
          buySh0nTokens={this.props.buySh0nTokens}
          />
        </div>
      </div>
    </div>
    );
  }
}

export default PageContent;
