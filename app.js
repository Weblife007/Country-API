const themeswitch = document.getElementById('theme-switch');
let darkmode = localStorage.getItem('darkmode'); // know

const enabledarkmode = () => {
    document.body.classList.add('darkmode'); // classList
    localStorage.setItem('darkmode', 'active');
}

const disabledarkmode = () => {
    document.body.classList.remove('darkmode');
    localStorage.setItem('darkmode', null);
}

if (darkmode === 'active') {
    enabledarkmode();
}

themeswitch.addEventListener('click', () => {
    if (darkmode !== 'active') {
        enabledarkmode();
    } else {
        disabledarkmode();
    }
    darkmode = localStorage.getItem('darkmode');
});

const searchInput = document.querySelector('#search-input');
const filterRegionDropdown = document.querySelector('#filter-input');
const countryListContainer = document.querySelector('#country-list-container');
const countryDetailsContainer = document.querySelector('#country-detail-container');
let allCountries = [];

searchInput.addEventListener('input', updateCountryResults);
filterRegionDropdown.addEventListener('change', updateCountryResults);

function getSearchInput() {
    return searchInput.value.toLowerCase().trim();
}

function getFilterInput() {
    return filterRegionDropdown.value;
}

function searchResults(countryData, searchQuery) {
    return countryData.filter(item => item.name.toLowerCase().includes(searchQuery));
}

function filterResults(countryData, filterOptions) {
    return countryData.filter(item => item.region.toLowerCase().includes(filterOptions.toLowerCase().trim()))
}

function updateCountryResults() {
    const searchTerm = getSearchInput();
    const selectedFilter = getFilterInput()

    const filteredResults = filterResults(allCountries, selectedFilter);
    const searchTermResults = searchResults(filteredResults, searchTerm);

    displayCountries(searchTermResults);
}

async function fetchCountries() {
    const res = await fetch('data.json');
    const data = await res.json();

    allCountries = data;
    displayCountries(data);
}

function displayCountries(countryData) {
    countryListContainer.innerHTML = '';

    countryData.forEach(country => {
        const countryItem = document.createElement('button')
        countryItem.classList.add('country-item')

        countryItem.innerHTML = ` 
              <img src= '${country.flags.png}'>
              <div class = 'country-info'>
                <h2 class = 'country-name'>${country.name}</h2>
                <p class = 'country-population'><strong>Populations:</strong> ${country.population.toLocaleString()}</p>
                <p class = 'country-region'><strong>Region:</strong> ${country.region}</p>
                <p class = 'country-capital'><strong>Capital:</strong> ${country.capital}</p>
              </div>
            `;
        countryListContainer.appendChild(countryItem);

        countryItem.addEventListener('click', () => {
            countryListContainer.style.display = 'none'
            document.getElementById('country-detail-container').classList.add('show');
            displayCountryDetails(country);
            document.querySelector('#search-input').style.display = 'none';
            document.querySelector('.searchImg').style.display = 'none';
            document.querySelector('#filter-input').style.display = 'none';
        })
    });

};

function displayCountryDetails(selectedCountry) {
    const countryDetailsContainer = document.getElementById('country-detail-container');
    countryDetailsContainer.innerHTML = `
        <button id= 'back-btn' class= 'back-btn'> 
         <img class="back-arror" src="img/arrow_back.png" alt="arrow_back"> <span>Back</span>
        </button>

      <div class= 'selected-country-info'> 
      <div class= 'selected-country-flag'>
        <img src= '${selectedCountry.flags.png}'>
      </div>
      <div class= 'selected-country-details'>
          <h2 class='selected-country-name'>${selectedCountry.name}</h2>
          <ul>
             <li class= 'selected-country-native-name'>  <strong>Name:</strong>${selectedCountry.nativeName}</li>        
             <li class= 'selected-country-population'>  <strong>Population:</strong>${selectedCountry.population.toLocaleString()}</li>    
             <li class= 'selected-country-region'>  <strong>Region:</strong>${selectedCountry.region}</li>        
             <li class= 'selected-country-subregion'>  <strong>Subregion:</strong>${selectedCountry.subregion}</li>        
             <li class= 'selected-country-capital'>  <strong>Capital:</strong>${selectedCountry.capital}</li>        
             <li class= 'selected-country-topLevelDomain'>  <strong>Top level Domain:</strong>${selectedCountry.topLevelDomain[0]}</li>        
             <li class= 'selected-country-currencies'>  <strong>Currencies:</strong>${selectedCountry.currencies[0]}</li> 
             <li class= 'selected-country-language'>  <strong>Language:</strong>${selectedCountry.languages.map(language => language.name).join(',')}</li>        
          </ul>

          ${selectedCountry.borders && selectedCountry.borders.length > 0
            ? `
               <div class= 'selected-country-borders'><strong>Border Countries:</strong>
               ${selectedCountry.borders.map(country => `<span> ${country}</span>`).join(' ')}    
               </div>
            `
            : `
                <div><strong>Border Countries</strong> none</div>
            `
        }

        </div>
      </div>
    `

    const backBtn = countryDetailsContainer.querySelector('#back-btn')
    backBtn.addEventListener('click', () => {
        countryDetailsContainer.innerHTML = '';
        countryDetailsContainer.classList.remove('show');
        countryListContainer.style.display = 'grid';
        document.querySelector('#search-input').style.display = 'block';
        document.querySelector('.searchImg').style.display = 'block';
        document.querySelector('#filter-input').style.display = 'block';
    });

}

fetchCountries();

