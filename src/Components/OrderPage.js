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

    /*
                var user = {};
            user.name='Fero';
            user.street="Kosovska";
            user.city="Prievidza";
            user.street_num = 10;

            var products = [[1,2],[2,1]];

            //createOrder(user,products,100);

            //setOrderAsPaid(1);
     */

    function checkFields()
    {
        //TODO
    }

    function createOrder() {

        checkFields()

        var user = {};
        user.name=name.current.value;
        user.street=street.current.value;
        user.city=city.current.value;
        user.street_num = streetNum.current.value;
        var products = [];
        for(var i=0;i<obj.cart.length;i++)
        {
            var product = {};
            product.id = obj.cart[i].id;
            product.count = obj.cart[i].count;
            products.push(product);
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
                obj.cart.splice(0, obj.cart.length)
                obj.setPage(2)
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
            console.log(obj.cart[i].id)
            if (obj.cart[i].id === id) {
                if (count > 0) {
                    obj.cart[i].count = count;
                    break;
                } else {
                    obj.cart[i].splice(i, 1);
                }
            }
        }
        updatePrice();
    }

    function updatePrice() {
        var sum = 0;

        for (var i = 0; i < obj.cart.length; i++) {
            sum += obj.cart[i].count * obj.cart[i].price;
        }

        setPrice(sum);
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