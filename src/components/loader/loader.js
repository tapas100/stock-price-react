import React from 'react';
import './loader.scss'


const Loader = () => {
    let temp = []
    for (let i = 0; i < 15; i++) {
        temp.push(<span id={i}></span>)
    }
    return (
        <React.Fragment>
            <div className="title-text"><h5>Stock Price</h5></div>
            <div className="loader">
                {temp}
            </div>
        </React.Fragment>
    );
}



export default Loader;