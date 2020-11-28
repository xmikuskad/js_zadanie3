import React, {useEffect, useState} from 'react';

function ThankYouPage(obj) {
    const [image, setImage] = useState('');

    useEffect(() => {
        fetch('/getAdBanner')
            .then(res => res.json())
            .then(data => {
                setImage(data);
            });
    }, []);


    function callIncrement() {
        fetch('/increment')
            .then(data => {
                window.open('https://www.google.com', '_blank');
            })
    }

    if (image !== '') {
        return (
            <div>
                <h1>Dakujeme za Vasu objednavku!</h1>
                <button onClick={()=>obj.setPage(0)}>Navrat na hlavnu stranku</button>
                <br/><br/>
                <input type='image' src={image} onClick={() => {
                    callIncrement();
                }}/>
            </div>)
    } else {
        return (<div>Loading...</div>)
    }
}

export default ThankYouPage;