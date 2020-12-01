import React,{useState} from 'react';

//Toto je jeden produkt pri objednavke
function OrderItem(obj) {
    const [count, setCount] = useState(obj.count);

    //Zaokruhlenie sumy (obcas sa mi zmenilo 19.99 na 19.9899999)
    function getPrice() {
        return Math.round((obj.price * obj.count) * 100) / 100;
    }

    //Znizenie/zvysenie produktu podla atributu increase
    //Taktiez zobrazuje upozornenie ak ma zmiznut item z kosiku
    //Funkcia setCount ma oneskorenie takze som musel pouzit localCount
    function changeCount(increase) {
        var countLocal = count;

        if (increase) {
            countLocal = count + 1;
        } else {
            if (count <= 1) {
                if (confirm('Tymto vymazete produkt s kosika. Chcete pokracovat?')) {
                    countLocal = count - 1;
                } else
                    return;
            } else {
                countLocal = count - 1;
            }
        }

        obj.updateItem(obj.id, countLocal);
        setCount(countLocal)
    }

    //Vykreslenie html
    if (count > 0) {
        return (
            <tr>
                <td>
                    <h3>{obj.name}</h3>
                    <div>Cena za kus {obj.price}</div>
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                <div>Pocet kusov:</div>
                            </td>
                            <td>
                                <button onClick={() => changeCount(true)}>+</button>
                            </td>
                            <td>
                                <div>{count}</div>
                            </td>
                            <td>
                                <button onClick={() => changeCount(false)}>-</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div>Cena spolu {getPrice()}</div>
                </td>
            </tr>
        );
    } else {
        return (<tr>
            <td></td>
        </tr>)
    }
}


export default OrderItem;