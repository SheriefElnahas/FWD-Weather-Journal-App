// **************************************************************************************************************
//                                          Required Data
// **************************************************************************************************************
const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = "&appid=c75cc7fd1e1e7a7f403a0c4539068680&units=imperial";

// Get The Current Date
const now = new Date();
const currentDate = `${ now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;

// **************************************************************************************************************
//                                          DOM Selections
// **************************************************************************************************************
const zipCodeInput = document.querySelector(".zip-code-input");
const feelingsElement = document.querySelector(".feelings");
const generateBtn = document.querySelector(".generate-btn");
const alertText = document.querySelector(".alert-text");

const entryHolder = document.querySelector("#entryHolder");
const dateElement = document.querySelector("#date");
const tempElement = document.querySelector("#temp");
const contentElement = document.querySelector("#content");


// **************************************************************************************************************
//                                          Functions
// **************************************************************************************************************
async function getWeatherData(url, zipCode, key) {
  try {
    const res = await fetch(url + zipCode + key);

    // If there is a problem with the response throw an error to activate the catch block
    if (!res.ok) {
      throw new Error("Status code is not 200");
    } else {
      const data = await res.json();
      return data

    }
  } catch (err) {
    console.error(err);
  }
}

async function buildObject(data) {
  try {
    const userDetails = {
      date: currentDate,
      temp: data.main.temp,
      feelings: feelingsElement.value,
    };

    return userDetails;
  } catch (err) {
    console.error(err);
  }
}

async function postData(url, dataObject) {
  const res = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataObject),
  });

  try {
    const userInfo = await res.json();
    console.log(userInfo);
    return userInfo;
  } catch (err) {
    console.error("error: ", err);
  }
}

async function buildHTML() {
  const req = await fetch("/all");

  try {
    const userData = await req.json();

    // IF We have data then show the data and hide the alert text
    if (Object.keys(userData).length > 0) {
      dateElement.textContent = `Date: ${userData.currentDate}`;
      tempElement.textContent = `Temperature: ${userData.temp}`;
      contentElement.textContent = `I Feel: ${userData.description}`;
      alertText.style.visibility = "hidden";
      entryHolder.style.display = "block";
      // Else if the fetch is failed then hide the entry data and show the alert text 
    } else {
      alertText.textContent = "Please Enter Valid Zip Code";
      alertText.style.visibility = "visible";
      entryHolder.style.display = "none";
    }
  } catch (err) {
    console.log(err);
  }
}

// **************************************************************************************************************
//                                          DOM Event - Clicking On Generate Button
// **************************************************************************************************************

generateBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // If Zip Code Is Empty
  if (zipCodeInput.value === "") {
    // Hide The Etnry And Show The Error
    entryHolder.style.display = 'none';
    alertText.textContent = "Zip Code Should Not Be Empty";
    alertText.style.visibility = "visible";
    // If it is not empty
  } else {
    // Hide The Alert Text and start fetching data
    alertText.style.visibility = "hidden";

    // 1- Get Weather data by using the provided zip code
    getWeatherData(baseURL, zipCodeInput.value, apiKey).then(
      (weatherData) => {
        // 2- Take the weather data and build an object out of it 
        buildObject(weatherData).then((userObject) => {
          // 3- Make a post request out of that object and to a specfic url that we have provided in the server 
          postData("/renderData", userObject);
          
          // 4- Finally render the html based on the data that we got
          buildHTML().then(() => {});
        });
      }
    );
  }
});

