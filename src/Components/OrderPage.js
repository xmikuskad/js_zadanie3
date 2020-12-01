import React, {useEffect, useState,useRef} from 'react';

import UserForm from "./UserForm";
import OrderItem from "./OrderItem";

//Stranka kde pouzivatel plati a kontroluje objednavku
function OrderPage(obj) {
    const [price, setPrice] = useState(0)

    //Referencie na input polia
    const name = useRef(null);
    const street = useRef(null);
    const streetNum = useRef(null);
    const city = useRef(null);

    //Definovanie input poli
    var formFields = [
        {
            ref: name,
            text: 'Meno',
        },
        {
            ref: street,
            text: 'Ulica'
        },
        {
            ref: streetNum,
            text: 'Cislo domu',
            type: 'number'
        },
        {
            ref: city,
            text: 'Mesto'
        }];

    //Vypocitanie ceny na zaciatku programu
    useEffect(() => {
        updatePrice();
    }, [])

    //Vytvorenie input poli pomocou namapovania na UserForm
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

    //Overovanie poli sme nemali robit ale tak som spravil aspon zakladny test
    //Polia nemozu byt prazdne alebo mat nad 255 znakov (limit DB)
    function checkFields()
    {
        var nameValue = name.current.value;
        var streetValue = street.current.value;
        var cityValue =city.current.value;
        var streetNumValue = streetNum.current.value;

        if(nameValue.length <=0 || nameValue.length > 255 || streetValue.length <=0 || streetValue.length > 255 ||
        cityValue.length <=0 || cityValue.length > 255 || streetNumValue.length <=0 || streetNumValue.length > 255)
            return false;

        return true;
    }

    //Vytvorenie objednavky a odoslanie requestu na server
    function createOrder() {

        //Kontrola poli
        if(!checkFields())
        {
            alert('Niektore polia su prazdne alebo maju nad 255 znakov')
            return;
        }

        //Vytvorenie odosielanych dat
        var user = {};
        user.name=name.current.value;
        user.street=street.current.value;
        user.city=city.current.value;
        user.street_num = streetNum.current.value;
        var products = [];
        for(var i=0;i<obj.cart.length;i++)
        {
            if(obj.cart[i].count > 0) {
                var product = {};
                product.id = obj.cart[i].id;
                product.count = obj.cart[i].count;
                products.push(product);
            }
        }

        //Volanie na server
        fetch('/createOrder', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user:user,
                products:products,
                price:price
            })
        })
            .then(data => {
                //Vycistit kosik od aktualnych itemov
                obj.cart.splice(0,obj.cart.length)
                //Zobrazie thankyou page
                obj.setPage(2);
            })
    }

    //Zobrazenie objektov v nakupnom kosiku pomocou namapovania
    function renderOrderItems() {
        return obj.cart.map((item, index) => {
            return <OrderItem
                key={index}
                id={item.id}
                name={item.name}
                price={item.price}
                count={item.count}
                updatePrice={updatePrice}
                updateItem={updateItem}
            />
        })
    }

    //Zmena poctu polozky v kosiku a update ceny
    function updateItem(id, count) {
        for (var i = 0; i < obj.cart.length; i++) {
            if (obj.cart[i].id === id) {
                obj.cart[i].count = count;

                break;
            }
        }

        updatePrice();
    }

    //Aktualizacia ceny objednavky
    function updatePrice() {
        let sum = 0;

        for (let i = 0; i < obj.cart.length; i++) {
            sum += obj.cart[i].count * obj.cart[i].price;
        }

        //Zaokruhlovanie lebo obcas sa to bugne pri floatoch
        sum = Math.round(sum * 100) / 100;

        setPrice(sum);

        //Ak sme odstranili vsetky itemy z kosika tak navrat na stranku produktu
        if(sum<= Number.EPSILON)
        {
            obj.cart.splice(0,obj.cart.length)
            alert('Prazdny nakupny kosik! Vraciam na hlavnu stranku')
            obj.setPage(0);
        }
    }

    //Vytvorenie html
    return (
        <div>
            <button onClick={() => obj.setPage(0)}>Navrat na hlavnu stranku</button>
            <h1>Objednavka</h1>
            <h2>Polozky objednavky</h2>
            <table>
                <tbody>
                {renderOrderItems()}
                </tbody>
            </table>
            <h2>Informacie o dodani</h2>
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
                        <button onClick={() => {
                            createOrder();
                        }}>
                            Objednat tovar
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}

export default OrderPage;