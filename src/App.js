// useState is used to remember the current state of an element
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faDroplet, faWind } from "@fortawesome/free-solid-svg-icons";

const apiKey = "504fb05cd7cd4ac38d5213023231806";
const apiUrl = "https://api.weatherapi.com/v1/current.json?&q=";

export default function WeatherApp() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(false);
    
    useEffect(() => {
      // Retrieve the last searched city from localStorage on component mount
      const storedCity = localStorage.getItem("lastSearchedCity");

      // Fetch the weather data for the storedCity if there is one
      if (storedCity) {
        setCity(storedCity);
        fetchWeatherData(storedCity);
      }
    }, []);                                                                       // [] as the second argument means that the effect only runs once when the component mounts
    
    const fetchWeatherData = async (cityName) => {
      try {
        const response = await fetch(apiUrl + cityName + `&key=${apiKey}`);
        const data = await response.json();
        console.log(data);
        
        // Check if the response contains an error
        if (data.error) {
          // Set the error message
          setError(data.error.message);
          setWeather(null);
        } else {
          // Set the weather variable with the fetched data
          setWeather({
            name: data.location.name,
            region: data.location.region,
            temp: data.current.temp_c,
            humidity: data.current.humidity,
            wind: data.current.wind_kph,
            icon: data.current.condition.icon
          });
          // Clear any previous error messages
          setError(null);
  
          // Store the last searched city in localStorage
          localStorage.setItem("lastSearchedCity", cityName);
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      await fetchWeatherData(city);
    };
 
    return (
        <div className="card">
            <form onSubmit={handleSubmit} className="form">
                <input
                    type="text"
                    className="inputCity"
                    placeholder="Please enter the city name"
                    required                                                  // An input is required to submit the form
                    value={city}
                    onChange={(event) => setCity(event.target.value)}         // Update city state on input change
                />
                <button type="submit" className="submitButton">
                    <FontAwesomeIcon icon={faMagnifyingGlass} size="xl" />
                </button>
            </form>

            {/* Conditional rendering: Display an error message if there is an error */}
            {error && (
            <div className="error">
                <p>{error}</p>
            </div>
            )}

            {/* Conditional rendering: Display weather information if available */}
            {weather && (
                <div className="weather">
                    <img src={weather.icon} alt="Weather Icon" className="weather-icon" />
                    <h1 className="temp">{weather.temp}°C</h1>
                    <h2 className="city">{weather.name}</h2>
                    <h3 className="region">{weather.region}</h3>
        
                    <div className="details">
                        <div className="col">
                            <div className="symbol-left">
                            <FontAwesomeIcon icon={faDroplet} size="2x" />
                            </div>
                            <div>
                            <p className="humidity">{weather.humidity}%</p>
                            <p>Humidity</p>
                            </div>
                        </div>
        
                        <div className="col">
                            <div className="symbol-right">
                            <FontAwesomeIcon icon={faWind} size="2x" />
                            </div>
                            <div>
                            <p className="wind">{weather.wind} km/h</p>
                            <p>Wind Speed</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
   );
}