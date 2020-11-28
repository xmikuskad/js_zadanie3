import React,{useState} from 'react';

function OrderItem(obj) {

    const [count, setCount] = useState(obj.count);

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
                    <div>Cena spolu {obj.price * obj.count}</div>
                </td>
            </tr>
        );
    } else {
        return (<tr>
            <td></td>
        </tr>)
    }


    function changeCount(increase) {
        var countLocal = 0;

        if (increase) {
            countLocal = count + 1;
        } else {
            if (count <= 1) {
                if (confirm('Tymto vymazete produkt s kosika. Chcete pokracovat?')) {
                    countLocal = count - 1;
                }
            } else {
                countLocal = count - 1;
            }
        }

        setCount(countLocal)
        obj.updateItem(obj.id, countLocal);
    }
}


export default OrderItem;