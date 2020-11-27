import React, { useEffect, useState } from 'react';

import Destinacia from './Destinacia';

function Vsetky(props) {
    const [krajiny, setKrajiny] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(()=>{
        fetch('/data')
            .then(res => res.json())
            .then(data => {
                setKrajiny(data);
                setIsLoaded(true);
            });
    },[]);

    function renderDestinacie() {
        return krajiny.map((krajina,index)=>{
            return <Destinacia
                key={krajina.id}
                title={krajina.title}
                link={krajina.link}
                description={krajina.description}
                image={krajina.image} />
        });
    }

    if(isLoaded) {
        return (
            <div>
                {renderDestinacie()}
            </div>
        );
    }
    else {
        return <div>Loading...</div>
    }
}

export default Vsetky;