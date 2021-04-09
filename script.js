const search = document.getElementById('search'), 
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    mealsEl = document.getElementById('meals'),
    resultHeading = document.getElementById('result-heading'),
    singleMealEl = document.getElementById('single-meal');

// Search meal and fetch from API
async function searchMeal(e) {
    e.preventDefault();

    // Clear single meal
    singleMealEl.innerHTML = '';

    // Get the search term
    const term = search.value;

    // Check for empty term
    if(term.trim()) {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
        const data = await response.json();
        console.log(data);
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

        if(data.meals === null) {
            resultHeading.innerHTML = `<p>There are no search results. Please try again!</p>`;
        } else {
            mealsEl.innerHTML = data.meals.map(meal => `
                <div class="meal">
                    <img class="meal-img" src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                    <div class="meal-info" data-mealid="${meal.idMeal}">
                        <h3>${meal.strMeal}</h3>
                    </div> 
                </div>
            `).join('');
        }
        // Clear search text
        search.value = '';
    } else {
        alert('Please enter a search term');
    }
}

// Fetch meal by ID 
async function getMealById(mealID) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    const data = await response.json();
    const meal = data.meals[0];

    addMealToDOM(meal);
}

// Fetch random meal
async function randomMeal() {
    // Clear meals and headings
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';

    // Make the request
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
    const data = await response.json();
    const meal = data.meals[0];

    addMealToDOM(meal);
}

// Add meal to DOM
function addMealToDOM(meal) {
    const ingredients = [];

    for(let i = 1; i <= 20; i++) {
        if(meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    singleMealEl.innerHTML = `
    <div class="single-meal">
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="single-meal-info">
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
            ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
        </div>
        <div class="main">
            <p>${meal.strInstructions}</p>
            <h3>Ingredients</h3>
            <ul>
                ${ingredients.map(ingredient => {
                    return `<li>${ingredient}</li>`
                }).join('')}
            </ul>
        </div>
    </div>
    `;
}

// Event listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', randomMeal);
mealsEl.addEventListener('click', e => {
    const mealInfo = e.composedPath().find(item => {
        if(item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });
    
    if(mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealById(mealID);
    }
})