// useState is used to remember the current state of an element
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faDroplet, faWind } from "@fortawesome/free-solid-svg-icons";

const apiKey = "504fb05cd7cd4ac38d5213023231806";
const apiUrl = "https://api.weatherapi.com/v1/current.json?&q=";

export default function WeatherApp() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            const response = await fetch(apiURL + city + '&key=${apiKey}');
            const data = await response.json();

            if (response.status === 400) {
                setError(true);
                setWeather(null);
            } else {
                setError(false);
                setWeather({
                    name: data.location.name,
                    region: data.location.region,
                    temp: data.current.temp_c,
                    humidity: data.current.humidity,
                    wind: data.current.wind_kph,
                    icon: data.current.condition.icon
                });
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    return (
        <div className="card">
            <form> onSubmit={handleSubmit} className="form"
                <input
                    type="text"
                    className="inputCity"
                    placeholder="Please enter the city name"
                    required
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                />
                <button type="submit" className="submitButton">
                    <FontAwesomeIcon icon={faMagnifyingGlass} size="xl" />
                </button>
            </form>

            {error && (
                <div className="error">
                    <p>Invalid city name!</p>
                </div>    
            )}

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


