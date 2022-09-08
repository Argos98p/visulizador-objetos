import Form from 'react-bootstrap/Form';
import React from "react";

const AddYoutubeVideo= ()=>{

    return (
        <>
        <Form.Label htmlFor="inputPassword5">Ingrese una etiqueta</Form.Label>
    <Form.Control  type="text"  aria-describedby="passwordHelpBlock"/>


    <Form.Text id="passwordHelpBlock" muted>
        Se permite un maximo de 20 caracteres
    </Form.Text>
        </>
    );
}

export default AddYoutubeVideo;