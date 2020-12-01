import React, {useEffect, useState,useRef} from 'react';

import UserForm from "./UserForm";
import OrderItem from "./OrderItem";

function OrderPage(obj) {
    const [price, setPrice] = useState(0)

    const name = useRef(null);
    const street = useRef(null);
    const streetNum = useRef(null);
    const city = useRef(null);

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


    useEffect(() => {
        updatePrice();
    }, [])

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

    function createOrder() {

        if(!checkFields())
        {
            alert('Input fields are empty or bigger than 255 chars')
            return;
        }

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
                //Vycistit kosik
                obj.cart.splice(0,obj.cart.length)
                //obj.removeItem(0,obj.cart.length);
                obj.setPage(2);
            })
    }

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

    function updateItem(id, count) {

        for (var i = 0; i < obj.cart.length; i++) {
            if (obj.cart[i].id === id) {
                console.log('Changing count from ' + obj.cart[i].count + " to " + count + " for ID " + id);
                obj.cart[i].count = count;

                break;
            }
        }

        updatePrice();
    }

    function updatePrice() {
        var sum = 0;

        for (var i = 0; i < obj.cart.length; i++) {
            sum += obj.cart[i].count * obj.cart[i].price;
        }

        sum = Math.round(sum * 100) / 100;

        setPrice(sum);

        console.log('SUM IS '+sum);

        if(sum<= Number.EPSILON)
        {
            obj.cart.splice(0,obj.cart.length)
            alert('Prazdny nakupny kosik! Vraciam na hlavnu stranku')
            obj.setPage(0);
        }
    }

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