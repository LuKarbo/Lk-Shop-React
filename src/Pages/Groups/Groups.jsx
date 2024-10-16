import { useState } from 'react';
import './Groups.css';

const Groups = () => {
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');

    const handleCreateGroup = () => {
        alert('Grupo creado!');
    };

    return (
        <div className="groups-container">
            <div className="search-group">
                <input type="text" placeholder="Buscar grupos..." className="form-control" />
            </div>

            <div className="create-group">
                <h3>Crear un Nuevo Grupo</h3>
                <input type="text" placeholder="Nombre del grupo" className="form-control" />
                <input type="file" className="form-control" />
                <textarea placeholder="Descripción del grupo" className="form-control"></textarea>
                <button className="btn btn-primary">Crear Grupo</button>
            </div>

            <div className="listado-de-grupos">
                {/* Aquí puedes mapear varios grupos */}
                <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Nombre del Grupo</h5>
                    <p className="card-text">Descripción del grupo.</p>
                </div>
                </div>
            </div>
        </div>
    );
};

export default Groups;
