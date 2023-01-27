// GLOBAL
const baseUrl = "https://api.sunrisesunset.io/json?"
const endUrl = "&date=today"
const sunriseList = document.querySelector('#sunrise-list')
const parksUrl = 'http://localhost:3000/parks'
const sunForm = document.querySelector('#sun-form');
const geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?'
const geocodeKey = '&key=AIzaSyDIbzeTMPaKO2AA17vnqCmbHkGBL2ZPrmA'

// FETCH FUNCTIONS
function getParks(parksUrl){
    const data = JSON.parse(localStorage.getItem("parkId"))
    fetch(parksUrl)
    .then(r => r.json())
    .then(parkArray => {
        const sunnyParks = parkArray.map(park => getAllSunrises(park.lat, park.long, park.tmz, park))
        // console.log(sunnyParks)
    })
}

function getAllSunrises(lat, lng, tmz, park) {
    return fetch(baseUrl + `lat=${lat}&lng=${lng}&timezone=${tmz}` + endUrl)
        .then(response => response.json())
        .then((sunsetData) => {
            renderNationalParks(park, sunsetData.results)
            postPark(park)
            expandOnHover()
            updatePark(lat, long, tmz, newCardObj)
        })
}

// function fetchLatLng(city, state, apiKey) {
//     const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${city},${state}&key=${apiKey}`;
//     return fetch(geocodeUrl)
//       .then(response => response.json())
//       .then(data => {
//         const lat = data.results[0].geometry.location.lat;
//         const long = data.results[0].geometry.location.lng;
//         return { lat, lng };
//       })
//       .catch(error => console.error('Error:', error));
//   }

function postPark(newCardObj) {
    fetch(parksUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCardObj)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        localStorage.setItem("parkId", JSON.stringify(data))
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function updatePark(newCardObj, parkId){
    fetch(parksUrl + '/' + parkId, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCardObj)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// RENDER FUNCTIONS
function renderNationalParks(park, sunsetData) {
    // console.log(park)
    // console.log(sunsetData.sunrise)
    const li = document.createElement('li')
    li.className = "list-li"
    const image = document.createElement('img')
    image.src = park.image
    const location = document.createElement('h3')
    location.textContent = truncateTitle(park.location, 40);
    const cityState = document.createElement('h4')
    cityState.textContent = park.city + ', ' + park.state
    const sunrise = document.createElement('p')
    sunrise.textContent = 'Sunrise: ' + sunsetData.sunrise
    const sunset = document.createElement('p')
    sunset.textContent = 'Sunset: ' + sunsetData.sunset
    const goldenHour = document.createElement('p')
    goldenHour.textContent = 'Golden Hour: ' + sunsetData.golden_hour
    const dayLength = document.createElement('p')
    dayLength.textContent = 'Day Length: ' + sunsetData.day_length + ' Hours'
    const likes = document.createElement('h5')
    likes.textContent = park.likes + " Likes"
    const like = document.createElement('button')
    like.textContent = "Like ☀"
    sunriseList.append(li)
    li.append(image, location, cityState, sunrise, sunset, goldenHour, dayLength, likes, like)
    like.addEventListener('click', () => {
        console.log('clicked')
        const newLikes = park.likes + 1;
        park.likes = newLikes
        likes.textContent = park.likes + ' likes'
        updatePark(park, park.id)
    })
}

// sunForm.addEventListener('submit', (e) => {
//     e.preventDefault()
//     // debugger
//     const lat = e.target[3].value
//     const long = e.target[4].value
//     const tmz = e.target[5].value
//     const image = e.target[0].value
//     const location = e.target[1].value
//     const cityState = e.target[2].value
//     const newCardObj = {
//         image,
//         location,
//         lat,
//         long,
//         tmz,
//         cityState,
//         likes: 1
//     }
//     getAllSunrises(lat, long, tmz, newCardObj)
//     // postPark(newCardObj)
//     sunForm.reset()
// })

sunForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // debugger
    const location = e.target[1].value
    const image = e.target[0].value
    const city = e.target[2].value
    const split = city.split(' ');
    const join = split.join('%20')
    const state = e.target[3].value
    console.log(join)
    console.log(e.target[2].value)
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${join}&key=AIzaSyDIbzeTMPaKO2AA17vnqCmbHkGBL2ZPrmA`)
    .then(response => response.json())
    .then((data) => {
        const lat = data.results[0].geometry.location.lat;
        const long = data.results[0].geometry.location.lng;
        const tmz = e.target[4].value;
        const newCardObj = {
            image,
            location,
            lat,
            long,
            tmz,
            city,
            state,
            likes: 1
        }
        console.log(e.target[3].value)
        getAllSunrises(lat, long, tmz, newCardObj)
    })
    sunForm.reset()
})

// fetch('https://maps.googleapis.com/maps/api/geocode/json?address=Mountain%20View%20CA&key=AIzaSyDIbzeTMPaKO2AA17vnqCmbHkGBL2ZPrmA')
// .then(response => response.json())
// .then(console.log)

// function testSplit() {
//     const str = "Mountain View"
//     const splitStr = str.split(' ')
//     console.log(splitStr)
//     const join = splitStr.join('%20')
//     console.log(join)
// }

// testSplit()

function expandOnHover() {
    const listItems = document.querySelectorAll('.list-li');
    listItems.forEach(item => {
        item.addEventListener('mouseover', () => {
            item.style.transform = 'scale(1.1)';
            item.style.transition = 'transform 0.2s';
        });
        item.addEventListener('mouseout', () => {
            item.style.transform = 'scale(1)';
            item.style.transition = 'transform 0.2s';
        });
    });
}

function truncateTitle(title, maxLength) {
    if (title.length > maxLength) {
        return title.substring(0, maxLength - 3) + "...";
    } else {
        return title;
    }
}

// INITIALIZERS
getParks(parksUrl)
expandOnHover()
