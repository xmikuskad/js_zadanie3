import React, {useEffect, useState} from 'react';

//Stranka, ktora sa zobrazi po objednavke
function ThankYouPage(obj) {
    const [image, setImage] = useState('');
    const AD_LINK = 'https://www.progamingshop.sk/';

    //Ziskanie linku na obrazok
    useEffect(() => {
        fetch('/getAdBanner')
            .then(res => res.json())
            .then(data => {
                setImage(data.img);
            });
    }, []);

    //Zvacsenie pocitadla a zobrazenie reklamy
    function callIncrement() {
        fetch('/increment')
            .then(data => {
                window.open(AD_LINK, '_blank');
            })
    }

    //Vykreslenie html
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