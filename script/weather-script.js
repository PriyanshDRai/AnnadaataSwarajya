const url = 'https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=Vidisha';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '2452e9756dmsh84722b51ccb0004p1e3979jsnb92804702955',
		'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com'
	}
};
const getWeather = (city) => {
    cityName.innerHTML = city
    fetch('https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=' + city, options)
    .then(response => response.json())

    .then((response) => {
        console.log(response)
        cloud_pct.innerHTML = response.cloud_pct 
        temp.innerHTML = response.temp
        temp2.innerHTML = response.temp
        feels_like.innerHTML = response.feels_like
        humidity.innerHTML = response.humidity
        humidity2.innerHTML = response.humidity
        min_temp.innerHTML = response.min_temp
        max_temp.innerHTML = response.max_temp
        wind_speed.innerHTML = response.wind_speed
        wind_speed2.innerHTML = response.wind_speed
        wind_degrees.innerHTML = response.wind_degrees
        sunrise.innerHTML = response.sunrise
        sunset.innerHTML = response.sunset

    })
    .catch(err => console.error(err));
}

submit.addEventListener("click", (e) => {
    e.preventDefault()
    getWeather(city.value) 
})

getWeather("Vidisha")

// const recentSearches = [
//     { city: city, cloud_pct: , temp: , }
// ]

const API_KEY = "7f2da5216a5b4324a1f52e67ae094f9d";
const API_url = "https://newsapi.org/v2/everything?q="

window.addEventListener("load", () => fetchNews("India"));

async function fetchNews (query) {
    const res = await fetch(`${API_url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    console.log(data);
    bindData(data.articles);
}

function bindData (articles) {
    const cardsContainer = document.getElementById('cards-container');
    const newsCardTemplate = document.getElementById('template-news-card');

    cardsContainer.innerHTML = '';
    
    articles.forEach(article => {
       if(!article.urlToImage) return;
       const cardClone = newsCardTemplate.content.cloneNode(true);
       fillDataInCard(cardClone, article);
       cardsContainer.appendChild(cardClone);
    })
}

function fillDataInCard (cardClone, article) {
    const newsImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description.slice(0, 123);

    const date = new Date(article.publishedAt).toLocaleString("en-US",{
        timeZone: "Asia/Jakarta"
    });

    newsSource.innerHTML = `${article.source.name} - ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    })
}

const searchButton = document.getElementById('search-button');
const searchText = document.getElementById('news-input');

searchButton.addEventListener('click', () => {
    const query = searchText.value;
    if(!query) return;
    fetchNews(query);
})