import Form from 'react-bootstrap/Form';
import { useState } from 'react';



export default function InputHotspot({inputRef}) {

    const [isEmpty, setIsEmpty] = useState(true);

    function onChangeInput(){
        console.log(inputRef.current.value);
        if(inputRef.current.value==""){
            setIsEmpty(true)
        }else{
            setIsEmpty(false)
        }
    }

    return (
        <>

            <Form.Label htmlFor="inputPassword5">Ingrese una etiqueta</Form.Label>

            <Form.Control ref={inputRef} type="text" required onChange={onChangeInput} autoComplete="off" id="inputPassword5" aria-describedby="passwordHelpBlock"/>
            
            {
                isEmpty
                ? <Form.Text id="passwordHelpBlock" muted >
                    
                Este campo es obligatorio
                </Form.Text>
                : null
            }
            <br></br>
            <Form.Text id="passwordHelpBlock" muted>
                Se permite un maximo de 20 caracteres
            </Form.Text>
            
            
        </>
    );
}
