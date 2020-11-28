import React, {useEffect, useState} from 'react';

function ThankYouPage() {
    const [image, setImage] = useState('');

    useEffect(()=>{
        fetch('/getAdBanner')
            .then(res => res.json())
            .then(data => {
                setImage(data);
                setIsLoaded(true);
            });
    },[]);


    function callIncrement() {
        fetch('/increment')
            .then(data => {
                window.open('https://www.google.com','_blank');
            })
    }

    if(image !== '') {
        return (
            <div>
                <p>Thank you for your order!</p>
                    <input type='image' src={image} onClick={() => {
                        callIncrement();
                    }}/>
            </div>)
    }
    else {
        return (<div>Loading...</div>)
    }
}

export default ThankYouPage;