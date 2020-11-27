import React from 'react';

function Destinacia(props) {
    return (
        <div className="container">
            <a href={props.link}>
                <img width="150" src={props.image}></img>
                <div><b>{props.title}</b></div>
                <div>{props.description}</div>
            </a>
        </div>
    );
}

export default Destinacia;