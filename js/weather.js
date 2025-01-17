//grab required elements
let btn = document.getElementById('btnSend');
let cityField = document.getElementById("city");
let response = document.getElementById('response');

//request options
let baseUrl = "http://api.openweathermap.org/data/2.5/weather";
let apiKey = ""; // your API key

//event listeners
btn.addEventListener('click', handleClick, false);

async function handleClick(e) {
    //grab city value
    let city = cityField.value;
    //disable form
    cityField.disabled = true;
    btn.disabled = true;
    //show spinner
    updateUI(`<img src="../images/spinner.gif" alt="spinner" id="spinner">`);
    //create xhr
    try {
        let response = await fetch(buildUrl(city));
        let data = await handleErrors(response);
        await createSuccessHtml(data);
        console.log(data); 
    } catch (error) {
        createErrorHtml(error);
    } finally {
        resetForm();
    }
}

async function handleErrors(response) {
    if (response.ok) {
        return response.json();
    } else {
        let error = await response.json();
        throw error;
    }
}

function createSuccessHtml(data) {
    let weather = data.weather[0];
    let html = `
        <h1>Le temps à ${data.name}</h1>
        <p class="weatherMain">
            <img src="http://openweathermap.org/img/w/${weather.icon}.png" alt="${weather.description}" /><span>${weather.description}</span>
        </p>
        <p>Température : ${data.main.temp.toFixed(1)} °C</p>
    `;
    updateUI(html);
}

function createErrorHtml(data) {
    let html = `
        <h1>Une erreur s'est produite !</h1>
        <p>${data.message}</p>
    `;
    updateUI(html);
}

/*Utilities*/
let buildUrl = city => `${baseUrl}?units=metric&lang=fr&q=${city}&appid=${apiKey}`;
let updateUI = html => {
    //empty response container
    response.innerHTML = '';
    //replace with htmlString
    response.insertAdjacentHTML('beforeend', html);
}

function resetForm() {
    //reset form
    cityField.disabled = false;
    btn.disabled = false;
}
