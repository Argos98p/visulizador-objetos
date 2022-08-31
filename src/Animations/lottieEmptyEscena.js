import React from 'react'
import Lottie from 'react-lottie';
import * as animationData from '../lottieFiles/empty-box.json'
 
export default class LottieEmptyEscenas extends React.Component {
 
  constructor(props) {
    super(props);
    this.state = {isStopped: false, isPaused: false};
  }
 
  render() {

    const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };
 
    return <div>
      <Lottie options={defaultOptions}
              height="100%"
              width="100%"
              isStopped={this.state.isStopped}
              isPaused={this.state.isPaused}/>

    </div>
  }
}