const apiKey = 'c75cc7fd1e1e7a7f403a0c4539068680&units=imperial';

navigator.geolocation.getCurrentPosition(position => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}`)
    .then(res => {
        if(!res.ok) {
            throw Error('Weather data not available');
        }
        return res.json();
    }).then(data => {
        console.log(data);
    }).catch(err  => console.error(err));
  })