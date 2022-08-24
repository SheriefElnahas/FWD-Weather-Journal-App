const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&appid=c75cc7fd1e1e7a7f403a0c4539068680&units=imperial';

const now = new Date();
const currentDate = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`

async function getWeatherData(url, zipCode, key) {
    try {
        const res = await fetch(url + zipCode + key);

        if(!res.ok) {
            throw new Error('Status code is not 200');
        } else {
            const data = await res.json();

            if(data.cod === 200) {
                return data;
            }
        }
    } catch (err) { 
        console.error(err);
    }
}


const generateBtn = document.getElementById('generate');
const zipCodeElement = document.querySelector('.zip-code');
const feelingsElement = document.querySelector('#feelings')
const tempElement = document.querySelector('#temp');
const contentElement = document.querySelector('#content');
const dateElement = document.querySelector('#date');
const entryHolder = document.querySelector('#entryHolder');
const alertText = document.querySelector('.alert');

generateBtn.addEventListener('click', (e) => {
    e.preventDefault();


    if(zipCodeElement.value === '') {
        alertText.textContent = 'Zip Code Should Not Be Empty';
        alertText.style.visibility = 'visible';
    } else {
        alertText.style.visibility = 'hidden';
        getWeatherData(baseURL, zipCodeElement.value, apiKey ).then((weatherData) => {
    
            buildObject(weatherData).then((userObject) => {
                postData("/renderData",userObject);

                buildHTML().then(() => {
   
                })
            })
       })
    
    }



})

async function buildObject(data){
    // if(typeof data === 'undefined') {
    //     alertText.textContent = 'Please Enter Valid Zip Code';
    //     alertText.style.visibility = 'visible';
    // }
 try {

    const userDetails = {
        date: currentDate,
        temp: data.main.temp,
        feelings: feelingsElement.value,

    }


    return userDetails
 } catch(err) {
    console.error(err)
 }

}


async function postData(url, dataObject) {
    const res = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataObject)
    })

    try {
        const userInfo = await res.json();
        console.log(userInfo);
        return userInfo;
    } catch(err) {
        console.error("error: ",  err);
    }
}

async function buildHTML() {
    const req = await fetch('/all');


    try{
        const userData = await req.json();

        if(Object.keys(userData).length > 0 ) {

            dateElement.textContent = `Date: ${userData.currentDate}`;
            tempElement.textContent = `Temperature: ${userData.temp}`;
            contentElement.textContent = `I Feel: ${userData.description}`
            alertText.style.visibility = 'hidden';
            entryHolder.style.display = 'block';
        } else {
            alertText.textContent = 'Please Enter Valid Zip Code';
            alertText.style.visibility = 'visible';
            entryHolder.style.display = 'none';
        }

          

      
    }catch(err) {
        console.log(err);
    }
}