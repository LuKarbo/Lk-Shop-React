import { useState } from 'react';
import './Contact.css';

const Contact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Mensaje enviado. ¡Gracias por contactarnos!');
    };

    return (
        <div className="contact-container">
            <h2>Contáctanos</h2>
            <form>
                <input type="text" placeholder="Nombre" className="form-control" />
                <input type="email" placeholder="Correo electrónico" className="form-control" />
                <textarea placeholder="Mensaje" className="form-control"></textarea>
                <button type="submit" className="btn btn-primary">Enviar</button>
            </form>
        </div>

    );
};

export default Contact;
