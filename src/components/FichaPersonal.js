import React from "react";

export default function FichaPersonal({ person, onClose }) {
    return (
        <div className="ficha-overlay">
            <div className="ficha-container">
                <button className="close-btn" onClick={onClose}>×</button>
                <h2>Ficha Personal</h2>
                {person ? (
                    <div className="ficha-content">
                        <img src={person.picture.large} alt={`${person.name.first} ${person.name.last}`} />
                        <h3>{person.name.title} {person.name.first} {person.name.last}</h3>
                        <p><strong>Email:</strong> {person.email}</p>
                        <p><strong>Teléfono:</strong> {person.phone}</p>
                        <p><strong>Ubicación:</strong> {person.location.city}, {person.location.country}</p>
                    </div>
                ) : (
                    <p>Selecciona una persona para ver su ficha</p>
                )}
            </div>
        </div>
    );
}