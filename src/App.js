import { useState, useCallback } from 'react';
import Person from './components/Person';
import SearchForm from './components/SearchForm';
import './App.css';
import axios from 'axios';
import VisualizarTiempos from './components/VisualizarTiempos';
import FichaPersonal from './components/FichaPersonal';

function App() {
  const [timeAxios, setTimeAxios] = useState(parseFloat(localStorage.getItem('axiosTime') ?? 0));
  const [timeFetch, setTimeFetch] = useState(parseFloat(localStorage.getItem('fetchTime') ?? 0));
  const [people, setPeople] = useState({ axios: [], fetch: [] });
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('US');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState('');
  const [showFicha, setShowFicha] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const url = `https://randomuser.me/api/?results=12&gender=${gender}&nat=${country}`;

  const findPeopleAxios = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setShowFicha(false);
    setLoadingType('axios');
    setPeople({ axios: [], fetch: [] });

    try {
      const startTime = performance.now();
      const { data: { results } } = await axios.get(url);
      const endTime = performance.now();
      const fetchTime = parseFloat((endTime - startTime).toFixed(2));
      
      setTimeAxios(fetchTime);
      localStorage.setItem('axiosTime', fetchTime.toString());
      setPeople(prev => ({ ...prev, axios: results }));
    } catch (error) {
      console.error(`Error en Axios: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, url]);

  const findPeopleFetch = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setShowFicha(false);
    setLoadingType('fetch');
    setPeople({ axios: [], fetch: [] });

    try {
      const startTime = performance.now();
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      const { results } = await response.json();
      const endTime = performance.now();
      const fetchTime = parseFloat((endTime - startTime).toFixed(2));
      
      setTimeFetch(fetchTime);
      localStorage.setItem('fetchTime', fetchTime.toString());
      setPeople(prev => ({ ...prev, fetch: results }));
    } catch (error) {
      console.error(`Error en Fetch: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, url]);

  const compareRequests = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setShowFicha(false);
    setLoadingType('compare');
    setPeople({ axios: [], fetch: [] });

    try {
      const [axiosResponse, fetchResponse] = await Promise.all([
        axios.get(url).then(res => {
          const time = parseFloat((performance.now()).toFixed(2));
          localStorage.setItem('axiosTime', time);
          setTimeAxios(time);
          return res.data.results;
        }),
        fetch(url).then(async res => {
          const start = performance.now();
          const data = await res.json();
          const time = parseFloat((performance.now() - start).toFixed(2));
          localStorage.setItem('fetchTime', time);
          setTimeFetch(time);
          return data.results;
        })
      ]);
      
      setPeople({ axios: axiosResponse, fetch: fetchResponse });
    } catch (error) {
      console.error(`Error en comparación: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, url]);

  const handleGender = (event) => setGender(event.target.value);
  const handleCountry = (event) => setCountry(event.target.value);

  const mostrarFicha = (person = null) => {
    setSelectedPerson(person);
    setShowFicha(true);
    setIsLoading(false);
    setLoadingType('');
  };

  const cerrarFicha = () => {
    setShowFicha(false);
    setSelectedPerson(null);
  };

  return (
    <div className="App">
      <h1>Random People</h1>
      <SearchForm handleGender={handleGender} handleCountry={handleCountry} country={country} />
      <div className="App-controls">
        <button onClick={findPeopleAxios} disabled={isLoading} className="btn">
          {isLoading && loadingType === 'axios' ? "Cargando..." : "Buscar con Axios"}
        </button>
        <button onClick={findPeopleFetch} disabled={isLoading} className="btn">
          {isLoading && loadingType === 'fetch' ? "Cargando..." : "Buscar con Fetch"}
        </button>
        <button onClick={compareRequests} disabled={isLoading} className="btn">
          {isLoading && loadingType === 'compare' ? "Cargando..." : "Comparar Axios vs Fetch"}
        </button>
        <button 
          onClick={() => mostrarFicha()} 
          disabled={isLoading} 
          className={`btn ${showFicha ? 'active' : ''}`}
        >
          {showFicha ? "Ocultar Ficha" : "Ficha Personal"}
        </button>
      </div>
      {showFicha ? (
        <FichaPersonal 
          person={selectedPerson} 
          onClose={cerrarFicha} 
        />
      ) : (
        <>
          <VisualizarTiempos timeAxios={timeAxios} timeFetch={timeFetch} />
          <div className="App-results">
            <div className="result-section">
              <h2>Resultados con Axios</h2>
              {isLoading && loadingType === 'axios' && <p>Cargando datos...</p>}
              <div className="people-grid">
                {people.axios.length > 0 ? (
                  people.axios.map(person => (
                    <Person 
                      key={person.login.uuid} 
                      person={person} 
                      onSelect={() => mostrarFicha(person)}
                    />
                  ))
                ) : (
                  !isLoading && <p>No hay resultados</p>
                )}
              </div>
            </div>
            <div className="result-section">
              <h2>Resultados con Fetch</h2>
              {isLoading && loadingType === 'fetch' && <p>Cargando datos...</p>}
              <div className="people-grid">
                {people.fetch.length > 0 ? (
                  people.fetch.map(person => (
                    <Person 
                      key={person.login.uuid} 
                      person={person} 
                      onSelect={() => mostrarFicha(person)}
                    />
                  ))
                ) : (
                  !isLoading && <p>No hay resultados</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;