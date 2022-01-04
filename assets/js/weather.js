// create a local storage 
// create two btn function to search and delete
// create a moment.js
// link my api key from the weather website
// create a search function for the city
// appendChild local weather
// provide a 5 day forecast
// use json from the website
// make an alert if nothing is searched


var list = []
var weatherDay = document.querySelector("#showWeather")
var weatherInfo = document.querySelector("#weatherInfo")
var listCityEl = document.querySelector("#list-City");
var fiveCastEl = document.querySelector("#fiveCast")
var cardEL = document.querySelector("#fiveDays")

// Month name, day of month, year
var now = moment().format("(L)");

var listdata = document.createElement("div")
var howHot = document.createElement("p");
var muggy = document.createElement("p");
var windS = document.createElement("p");
var UVS = document.createElement("p");

var apiKey = "1ab34f64e7cf8c1c52b7936cf57b1b6e";


var ShowLocal = function () {
    list = JSON.parse(localStorage.getItem("name"))
    if (!list) {
        list = []
    }
    listCityEl.innerHTML = " ";
    for (var i = 0; i < list.length; i++) {
        listcities(list[i])
    }
}

// weather information
function searchCurrent(city) {
    console.log("searchcurr:", city)
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    if (list.indexOf(city) === -1) {
                        list.push(city)
                        localStorage.setItem("name", JSON.stringify(list));

                        ShowLocal()
                    }
                    // shows the current day and city
                    var dateCity = document.createElement("div");
                    var image = document.createElement("img")
                    var imageUrl = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
                    image.setAttribute("src", imageUrl)
                    dateCity.innerHTML = city + " " + now;
                    dateCity.appendChild(image)

                    weatherDay.innerHTML = "";
                    weatherDay.classList.add("currentStyle")
                    weatherDay.appendChild(dateCity);
                    weatherInfo.innerHTML = "";
                    listdata.innerHTML = "";

                    searchUV(data.coord.lat, data.coord.lon);

                    // when searching, displays weather information.
                    howHot.textContent = "Temperature:" + " " + data.main.temp + " " + "ºF";
                    muggy.textContent = "Humidity:" + " " + data.main.humidity + " " + "%";
                    windS.textContent = "Wind" + " " + "Speed:" + " " + data.wind.speed + " " + "MPH";

                    weatherInfo.classList = "card"

                    listdata.appendChild(weatherDay)
                    listdata.appendChild(howHot)
                    listdata.appendChild(muggy)
                    listdata.appendChild(windS)
                    weatherInfo.appendChild(listdata)
                })
            } else {
                alert("Error" + " " + response.statusText)
            }
        }).catch(function (error) {
            alert("Error" + " " + error.statusText)
        })
}

// function to show the UV stats
function searchUV(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`)
        .then(function (response) {

            if (response.ok) {
                response.json().then(function (data) {

                    var buttonUVEL = document.createElement("button");
                    buttonUVEL.classList.add("btn");

                    buttonUVEL.textContent = data.value;

                    if (data.value < 3) {
                        buttonUVEL.classList.add("btn-success");
                    }
                    else if (data.value < 7) {
                        buttonUVEL.classList.add("btn-warning");
                    }
                    else {
                        buttonUVEL.classList.add("btn-danger");
                    }

                    var UVel = document.createElement("div");
                    UVel.innerText = "UV Index:" + " ";
                    UVel.appendChild(buttonUVEL);

                    listdata.appendChild(UVel)
                    weatherInfo.appendChild(listdata)
                })
            } else {
                alert("Error UV " + " " + response.statusText)
            }

        }).catch(function (error) {
            alert("Error UV" + error.statusText)
        })
}
// function to show the five day forcast
function searchForecast(city) {
    console.log("searchForecast:", city)
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
        .then(function (response) {
            if (response.ok) {

                response.json().then(function (data) {

                    var titleforecast = document.createElement("h2")

                    fiveCastEl.textContent = "";
                    titleforecast.textContent = "5-Day Forecast:"
                    fiveCastEl.appendChild(titleforecast)

                    for (var i = 6; i < 39; i += 8) {
                        // where your five day forcast comes from
                        var div = document.createElement("div")
                        var firstDT = document.createElement("p")
                        var firstDH = document.createElement("p")
                        var imagen1 = document.createElement("img")
                        var time1 = document.createElement("h4")

                        time1.textContent = data.list[i].dt_txt.split(" ")[0];
                        time1.classList = "dateForecast";
                        imagen1.setAttribute("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png")
                        imagen1.classList = " imgDisplay ";
                        firstDT.textContent = " Temp:" + " " + data.list[i].main.temp + " " + "ºF";
                        firstDH.textContent = " Humidity:" + " " + data.list[i].main.humidity + " " + "%";
                        div.classList = 'col-md-2 style  forecast mr-3 ';

                        div.appendChild(time1)
                        div.appendChild(imagen1)
                        div.appendChild(firstDT)
                        div.appendChild(firstDH)
                        cardEL.appendChild(div)

                    }
                })
                cardEL.innerHTML = "";

            } else {
                alert("Error" + " " + response.statusText)
            }
        }).catch(function (error) {

            alert("Error" + " " + error.statusText)
        })
}
// function for the city's you search
var listcities = function (cityIn) {

    var firstC = document.createElement("button")
    firstC.classList = " list-group-item list-group-item-action";

    firstC.textContent = cityIn;
    listCityEl.appendChild(firstC)
}

document.getElementById("list-City").addEventListener("click", function (event) {

    searchCurrent(event.target.textContent);
    searchForecast(event.target.textContent);
})

document.getElementById("searchCity").addEventListener("click", function (event) {
    event.preventDefault();

    // searched city value and city name to me in all caps
    var cityIn = document.getElementById("city").value;
    document.getElementById("city").value = "";

    cityIn = cityIn.toUpperCase();

    if (cityIn) {
        
        searchCurrent(cityIn);

        searchForecast(cityIn);
        
    } else {
        alert("Please search for a city name")
    }})

    $('#clear').click( function() {
        window.localStorage.clear();
        location.reload();
        return false;
        });
      
      ShowLocal();
