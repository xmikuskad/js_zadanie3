import React from 'react';

//Vytvori input pole a nastavi jeho atributy
function UserForm(obj) {
    return (
        <tr>
            <td>
                {obj.text}
            </td>
            <td>
                <input type={getType()} ref={obj.reference}/>
            </td>
        </tr>
    );

    function getType()
    {
        if(obj.type)
            return obj.type;
        else
            return 'text';
    }
}


export default UserForm;