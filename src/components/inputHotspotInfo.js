import Form from 'react-bootstrap/Form';



export default function InputHotspot({inputRef}) {

    

    return (
        <>

            <Form.Label htmlFor="inputPassword5">Ingrese un nombre</Form.Label>
            <Form.Control ref={inputRef} type="text" id="inputPassword5" aria-describedby="passwordHelpBlock"/>
            <Form.Text id="passwordHelpBlock" muted>
                Se permite un maximo de 20 caracteres
            </Form.Text>
        </>
    );
}
