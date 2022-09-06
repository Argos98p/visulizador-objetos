import React, {useState} from 'react';
import Card from 'react-bootstrap/Card';
import {ImagePath} from '../../Api/apiRoutes'
import './cardExtra.css'

export default function CardExtra({item}) {
    const [extras, setExtras] = useState(item);

    return (
        <Card className='bg-dark  text-white card-extra'>
            <Card.Body>
                <img src={ImagePath(item.imagen.path)} className="extra-img"/>
                {item.nombre}
                </Card.Body>
        </Card>
    );
}
