import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'El correo electrónico es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El correo electrónico no es válido';
        }
        
        if (!formData.message.trim()) {
            newErrors.message = 'El mensaje es requerido';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Simulo el envío del formulario
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Limpio el formulario
            setFormData({
                name: '',
                email: '',
                message: ''
            });
            
            showToast('¡Mensaje enviado con éxito!');
        } catch (error) {
            showToast('Error al enviar el mensaje. Por favor, intente nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="contact-container">
            <div className="contact-header">
                <h1 className="contact-title">Contáctanos</h1>
                <p className="contact-subtitle">
                    ¿Tienes alguna pregunta? Estaremos encantados de ayudarte.
                </p>
            </div>
            
            <div className="contact-form-container">
                <form onSubmit={handleSubmit}>
                    <div className="contact-form-group">
                        <label htmlFor="name" className="contact-label">Nombre</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="contact-input"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Tu nombre"
                        />
                        {errors.name && <span className="contact-error">{errors.name}</span>}
                    </div>

                    <div className="contact-form-group">
                        <label htmlFor="email" className="contact-label">Correo electrónico</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="contact-input"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="tu@email.com"
                        />
                        {errors.email && <span className="contact-error">{errors.email}</span>}
                    </div>

                    <div className="contact-form-group">
                        <label htmlFor="message" className="contact-label">Mensaje</label>
                        <textarea
                            id="message"
                            name="message"
                            className="contact-textarea"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="¿En qué podemos ayudarte?"
                        />
                        {errors.message && <span className="contact-error">{errors.message}</span>}
                    </div>

                    <button 
                        type="submit" 
                        className="contact-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Enviando...</span>
                            </>
                        ) : (
                            <>
                                <Send size={20} />
                                <span>Enviar Ticket</span>
                            </>
                        )}
                    </button>
                </form>
            </div>

            {toast && (
                <div className={`contact-toast ${toast ? 'contact-toast-show' : ''}`}>
                    {toast}
                </div>
            )}
        </div>
    );
};

export default Contact;