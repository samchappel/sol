// GLOBAL
const baseUrl = "https://api.sunrisesunset.io/json?"
const endUrl = "&date=today"
const sunriseList = document.querySelector('#sunrise-list')
const parksUrl = 'http://localhost:3000/parks'
const sunForm = document.querySelector('#sun-form');

// FETCH FUNCTIONS
function getParks(parksUrl){
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
            // updatePark(newCardObj, park.id)
        })
}

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
    location.textContent = park.location
    const cityState = document.createElement('h4')
    cityState.textContent = park.cityState
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
    })
}

sunForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // debugger
    const lat = e.target[3].value
    const long = e.target[4].value
    const tmz = e.target[5].value
    const image = e.target[0].value
    const location = e.target[1].value
    const cityState = e.target[2].value
    const newCardObj = {
        image,
        location,
        lat,
        long,
        tmz,
        cityState,
        likes: 1
    }
    getAllSunrises(lat, long, tmz, newCardObj)
    // postPark(newCardObj)
    sunForm.reset()
})

// INITIALIZERS
getParks(parksUrl)
