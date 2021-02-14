import React, { useState, useEffect } from 'react';

/////The App component.
function App() {
  /////Initializing and creating state variables and setState functions with the useState hook.
  const [localPressed, setLocalPressed] = useState(false);
  const [forecastPressed, setForecastPressed] = useState(false);
  const [otpt, setOtpt] = useState(() => setLocalPressed(true));

  /////If the localPressed state is changed to be truthy, a specific API request is made and the results from it are printed.
  useEffect(() => {
    if (localPressed) {
      //Defining the user's location, and printing the results.
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        //Fetching a JSON object containing the current temperature from the OpenWeatherMap API, based on the user's current location.
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=db194ad9623e0d38cbbbf1b4ccaef9b8`)  
        .then(resp => {
          if (resp.ok) {
            //If the response is successful, it is parsed using the json() method.
            return resp.json();
          } else {
            //Otherwise an error object is thrown.
            throw new Error(`An error has occurred.`);
          }
        })
        .then(data => {
          //State is changed to be the current location and local temperature, which is ultimately printed to the user's screen.
          setOtpt(`The current temperature in ${data.name} is ${((data.main.temp - 273.15) * (9 / 5) + 32).toFixed(2)}°F.`);
        })
        .catch(error => {
          //If an error happens, it is logged in the console.
          console.log(error);
        });
      });
      setLocalPressed(false);
    }
  },[localPressed]);

  /////If the forecastPressed state is changed to be truthy, a specific API request is made and the results from it are printed.
  useEffect(() => {
    if (forecastPressed) {
      //Defining the user's location, and printing the results.
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        //Fetching a JSON object containing forecast data from the OpenWeatherMap API, based on the user's current location.
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=db194ad9623e0d38cbbbf1b4ccaef9b8`)  
        .then(resp => {
          if (resp.ok) {
            //If the response is successful, it is parsed using the json() method.
            return resp.json();
          } else {
            //Otherwise an error object is thrown.
            throw new Error(`An error has occured.`);
          }
        })
        .then(data => {
          //State is changed to be a list of forecasted temperatures and weather conditions, which is ultimately printed to the user's screen.
          setOtpt(
            data.list.map((info) => {
              const thenMoment = new Date(info.dt * 1000);
              const text = `On ${thenMoment.getMonth() + 1}/${thenMoment.getDate()}/${thenMoment.getFullYear()} at ${thenMoment.getHours() % 12 === 0 ? "12" : thenMoment.getHours() % 12}:00 ${thenMoment.getHours() > 11 ? "PM" : "AM"} it will be ${((info.main.temp - 273.15) * (9 / 5) + 32).toFixed(2)}°F.`;
              return (
                <li key={info.dt}>
                  <p>{text}</p>
                  <img src={`http://openweathermap.org/img/wn/${info.weather[0].icon}.png`} alt={``} />
                </li>
              );
            })
          );
        })
        .catch(error => {
          //If an error happens, it is logged in the console.
          console.log(error);
        });
      });
      setForecastPressed(false);
    }
  },[forecastPressed]);

  /////Returning HTML and JSX.
  return (
    <div>
      <header>
        <h1>Weather App</h1>
      </header>
      <main>
        <nav>
          <p onClick={() => setLocalPressed(true)}>Current Temperature</p>
          <p onClick={() => setForecastPressed(true)}>Five Day Forecast</p>
        </nav>
        <ol className="Output">{otpt}</ol>
      </main>
    </div>
  );
}

/////Exporting the App component.
export default App;
