//HELLO SAM!!!
// GLOBAL
const baseUrl = "https://api.sunrisesunset.io/json?"
const endUrl = "&date=today"
const sunriseList = document.querySelector('#sunrise-list')
const testURL = 'https://topher2014.github.io/Data/db.json'
const parksUrl = 'https://topher2014.github.io/Data/db.json'
// const parksUrl = 'http://localhost:3000/parks'

testAPI(testURL)
function testAPI(testURL){
    fetch(testURL)
    .then(r => r.json())
    .then(data => {
        console.log(data.parks)
    })
}

// FETCH FUNCTIONS
function getParks(parksUrl){
    fetch(parksUrl)
    .then(r => r.json())
    .then(parkArray => {
        console.log(parkArray)
        // parkArray.map(park => getAllSunrises(park.lat, park.long, park.tmz, park))
    parkArray.parks.map(park => getAllSunrises(park.lat, park.long, park.tmz, park))
    })
}

function getAllSunrises(lat, lng, tmz, park) {
    return fetch(baseUrl + `lat=${lat}&lng=${lng}&timezone=${tmz}` + endUrl)
        .then(response => response.json())
        .then((sunsetData) => renderNationalParks(park, sunsetData.results))
}

// function getLocationData(url) {
//     return fetch('url')
//     .then(response => response.json())
// }

function getNationalParks(url) {
    return fetch(url)
        .then(response => response.json())
}

// RENDER FUNCTIONS
function renderNationalParks(park, sunsetData) {
    // console.log(park)
    console.log(sunsetData.sunrise)
    const li = document.createElement('li')
    li.className = "list-li"
    const image = document.createElement('img')
    image.src = park.image
    const nationalPark = document.createElement('h3')
    nationalPark.textContent = park.nationalPark
    const location = document.createElement('h4')
    location.textContent = park.location
    const sunrise = document.createElement('p')
    sunrise.textContent = park.sunrise
    const sunriseSpan = document.createElement('span')
    sunriseSpan.textContent = sunsetData.sunrise
    sunrise.append(sunriseSpan)
    const sunset = document.createElement('p')
    sunset.textContent = park.sunset
    const sunsetSpan = document.createElement('span')
    sunsetSpan.textContent = sunsetData.sunset
    sunset.append(sunsetSpan)
    const goldenHour = document.createElement('p')
    goldenHour.textContent = park["golden_hour"]
    const goldenHourSpan = document.createElement('span')
    goldenHourSpan.textContent = sunsetData.golden_hour
    goldenHour.append(goldenHourSpan)
    const dayLength = document.createElement('p')
    dayLength.textContent = park["day_length"]
    const dayLengthSpan = document.createElement('span')
    dayLengthSpan.textContent = sunsetData.day_length + " hours"
    dayLength.append(dayLengthSpan)
    const likes = document.createElement('h5')
    likes.textContent = park.likes + " likes"
    const like = document.createElement('button')
    like.textContent = "Like ☀"
    sunriseList.append(li)
    li.append(image, nationalPark, location, sunrise, sunset, goldenHour, dayLength, likes, like)
    like.addEventListener('click', () => {
        console.log('clicked')
        const newLikes = park.likes + 1;
        park.likes = newLikes
        likes.textContent = park.likes + ' likes'
    })
}



// function iterateParks(parksArray) {
//     parksArray.forEach(renderNationalParks)
// }

// INITIALIZERS
getParks(parksUrl)
