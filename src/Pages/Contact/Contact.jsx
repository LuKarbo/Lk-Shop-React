import { useState } from 'react';
import { Send, Loader2, Ticket } from 'lucide-react';
import { useAuth } from '../../BackEnd/Auth/AuthContext';
import { SupportApi } from '../../BackEnd/API/SuportAPI';
import { useNavigate } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null);
    const { isLoggedIn } = useAuth();
    const userId = localStorage.getItem('user');
    const accessToken = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleViewTickets = () => {
        navigate('/mysupport');
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.title.trim()) {
            newErrors.title = 'El título es requerido';
        }
        
        if (!formData.content.trim()) {
            newErrors.content = 'La descripción es requerida';
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
        
        if (!isLoggedIn) {
            showToast('Debe iniciar sesión para poder consultar');
            return;
        }
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        
        try {
            const response = await SupportApi.create(
                userId,
                formData.title,
                formData.content,
                accessToken
            );

            if (response.success) {
                setFormData({ title: '', content: '' });
                showToast('¡Ticket creado con éxito!');
            } else {
                showToast(response.message || 'Error al crear el ticket');
            }
        } catch (error) {
            showToast('Error al crear el ticket. Por favor, intente nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="contact-container">
            <div className="contact-header">
                <h1 className="contact-title">Crear Ticket de Soporte</h1>
                <p className="contact-subtitle">
                    ¿Tienes alguna pregunta? Estaremos encantados de ayudarte.
                </p>
            </div>
            
            <div className="contact-form-container">
                <form onSubmit={handleSubmit}>
                    <div className="contact-form-group">
                        <label htmlFor="title" className="contact-label">Título</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="contact-input"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Título de tu consulta"
                        />
                        {errors.title && <span className="contact-error">{errors.title}</span>}
                    </div>

                    <div className="contact-form-group">
                        <label htmlFor="content" className="contact-label">Descripción</label>
                        <textarea
                            id="content"
                            name="content"
                            className="contact-textarea"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Describe tu consulta"
                        />
                        {errors.content && <span className="contact-error">{errors.content}</span>}
                    </div>

                    <div className="contact-button-container">
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
                        {isLoggedIn && (
                            <button 
                                onClick={handleViewTickets}
                                className="contact-button view-tickets-button"
                            >
                                <Ticket size={20} />
                                <span>Ver Mis Consultas</span>
                            </button>
                        )}
                    </div>

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