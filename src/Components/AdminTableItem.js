import React, {useRef,useState} from 'react';

//Toto je jeden prvok tabulky v admin menu
function AdminTableItem(obj) {
    const [isPaid, setPaid] = useState(obj.state);

    const paidBtn = useRef(null);

    //Vytvorenie html elementu
    return (
        <tr>
            <td>
                <p>{obj.id}</p>
            </td>
            <td>
                <p>{obj.name}</p>
            </td>
            <td>
                <p>{obj.price}</p>
            </td>
            <td>
                <p>{formatState()}</p>
            </td>
            {createPaidButton()}
        </tr>
    );

    //Nastavenie textu stavu
    function formatState() {
        if (isPaid === 0)
            return 'Nezaplatene'
        else
            return 'Zaplatene'
    }

    //Nastavenie danej objednavky ako zaplatenej
    function setAsPaid() {
        fetch('/payOrder', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: obj.id
            })
        })
            .then(data => {
                setPaid(1);
            })
    }

    //Vytvorenie tlacidla na zaplatenie objednavky
    function createPaidButton() {
        if (isPaid === 0) {
            return (
                <td>
                    <button ref={paidBtn} onClick={() => {
                        setAsPaid()
                    }}>Oznacit ako zaplatenu
                    </button>
                </td>
            )
        }
    }
}

export default AdminTableItem;