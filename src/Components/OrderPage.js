import React, {useEffect, useState,useRef} from 'react';

import UserForm from "./UserForm";

function OrderPage(obj) {
    const [isLoaded, setIsLoaded] = useState([]);
    var price = 100;

    const name = useRef(null);
    const street = useRef(null);
    const streetNum = useRef(null);
    const city = useRef(null);

    var formFields = [
        {   ref:name,
            text:'Meno',
        },
        {   ref:street,
            text:'Ulica'
        },
        {   ref:streetNum,
            text:'Cislo domu',
            type:'number'
        },
        {
            ref:city,
            text:'Mesto'
        }];

    useEffect(()=>{
        fetch('/data')
            .then(res => res.json())
            .then(data => {
                //setProduct(data);
                setIsLoaded(true);
            });
    },[]);

    function renderUserForm() {
        return formFields.map((field, index) => {
            return <UserForm
                key={index}
                reference={field.ref}
                text={field.text}
                type={field.type}
            />
        })
    }

    if(isLoaded) {
            return (
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <p>Product adding/removing part</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table>
                        <tbody>
                            {renderUserForm()}
                            <tr>
                                <td>
                                    Cena objednavky je <b>{price}</b>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button onClick={()=>{
                                        console.log("Name is "+name.current.value)
                                        obj.setPage(2)
                                    }}>
                                        Objednat tovar
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>)
    }
    else {
        return (<div>Loading...</div>)
    }
}

export default OrderPage;