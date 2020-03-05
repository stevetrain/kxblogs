import React, { PureComponent as Component} from 'react';

class OtherTab extends Component {

 componentDidMount(){
    this.props.tabChange();
  }

  render() {
    return(
          <div><h4>Other tab</h4></div>
        )
}
}
export default OtherTab