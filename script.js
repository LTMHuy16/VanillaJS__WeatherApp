const wrapper = document.querySelector('.wrapper'),
inputPart = wrapper.querySelector('.input-part'),
infoTxt = inputPart.querySelector('.info-txt'),
inputField = inputPart.querySelector('input'),
weatherIcon = document.querySelector('.weather-part img'),
arrowBack = wrapper.querySelector('header i'),
locationBtn = inputPart.querySelector('button');
let api;


inputField.addEventListener("keyup", (e) => {
  if(e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener("click", (e) => {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError)
  }else {
    alert("Your browser not support geolocation api")
  }
});

function onSuccess(position) {
  const {latitude, longitude} = position.coords;

  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=259114820e23deeac61707db958ea9ef`;
  fetchData();
}
function onError(error) {
  // message = User denied Geolocation
  infoTxt.innerText = error.message
  infoTxt.classList.add("error")
}

function requestApi(city) {
  //  Key API để học, làm thì nên ẩn đi ko bị chửi sml
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=259114820e23deeac61707db958ea9ef`;
  fetchData();
}

function fetchData() {
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");

  fetch(api)
  .then(response => response.json())
  .then(result => weatherDetails(result))
  .catch(() => {
    infoTxt.innerText = "Some thing went wrong !!!";
  })
}

function weatherDetails(info) {
  if (info.cod == "404") {
    infoTxt.innerText = `${inputField.value} is not a valid city name`;
    infoTxt.classList.replace("pending", "error");
  }else {
    customWeatherDescribe(info);

    infoTxt.classList.remove("pending", "error");
    wrapper.classList.add("active");
  }
}

function customWeatherDescribe(info) {
  const city = info.name;  
  const country = info.sys.country;
  const {description, id} = info.weather[0];
  const {feels_like, humidity, temp} = info.main;

  if(id ==800) {
    weatherIcon.src = "./img/clear.svg";
  } else if (id >= 200 && id <=232) {
    weatherIcon.src = "./img/storm.svg";
  } else if (id >= 600 && id <= 622) {
    weatherIcon.src = "./img/snow.svg";
  } else if (id >= 700 && id <= 781) {
    weatherIcon.src = "./img/haze.svg";
  } else if (id >= 801 && id <= 804) {
    weatherIcon.src = "./img/cloud.svg";
  } else if (id >= 300 && id <= 321 || id >= 500 && id <= 531) {
    weatherIcon.src = "./img/rain.svg";
  }

  wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
  wrapper.querySelector(".weather").innerText = description;
  wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
  wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
  wrapper.querySelector(".humidity span").innerText = `${humidity}%`;
}

arrowBack.addEventListener("click", (e) => {
  wrapper.classList.remove('active');
})
