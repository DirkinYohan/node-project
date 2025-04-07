import { render, screen } from '@testing-library/react';
import FichaPersonal from './FichaPersonal';

describe('Componente FichaPersonal', () => {
  // Prueba 1: Renderizado básico con título
  it('debe mostrar el título "Ficha Personal"', () => {
    render(<FichaPersonal person={null} onClose={() => {}} />);
    const title = screen.getByText(/Ficha Personal/i);
    expect(title).toBeInTheDocument();
  });

  // Prueba 2: Comportamiento sin persona seleccionada
  it('debe mostrar mensaje cuando no hay persona seleccionada', () => {
    render(<FichaPersonal person={null} onClose={() => {}} />);
    const message = screen.getByText(/Selecciona una persona para ver su ficha/i);
    expect(message).toBeInTheDocument();
  });

  // Prueba 3: Comportamiento con persona seleccionada
  it('debe mostrar los datos de la persona cuando está presente', () => {
    const testPerson = {
      name: {
        title: 'Mr',
        first: 'John',
        last: 'Doe'
      },
      picture: {
        large: 'https://example.com/photo.jpg'
      },
      email: 'john@example.com',
      phone: '123456789',
      location: {
        city: 'Madrid',
        country: 'España'
      }
    };
    
    render(<FichaPersonal person={testPerson} onClose={() => {}} />);
    
    expect(screen.getByText(/Mr John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/123456789/i)).toBeInTheDocument();
    expect(screen.getByText(/Madrid, España/i)).toBeInTheDocument();
  });

  // Prueba 4: Botón de cerrar
  it('debe contener un botón para cerrar la ficha', () => {
    render(<FichaPersonal person={null} onClose={() => {}} />);
    const closeButton = screen.getByText('×');
    expect(closeButton).toBeInTheDocument();
  });
});