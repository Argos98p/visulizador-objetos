import React from 'react'
import Lottie from 'react-lottie';
import * as animationData from '../lottieFiles/serverError.json'

export default class LottieServerError extends React.Component {

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

        return <div className="center-animation">
            <Lottie options={defaultOptions}
                    height="50vh"
                    width="50vh"/>
        </div>
    }
}