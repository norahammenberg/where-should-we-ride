//const for every ID target:
const wrapper = document.getElementById('wrapper');
const trails = document.getElementById('trails');
const trailUrl = document.getElementById('trail-url');
const loader = document.getElementById('loader');
const noTrails = document.getElementById('no-trails');

//fetching in process, leading function:
function showLoadingSpinner() {
    loader.hidden = false; //the hidden attribute can be used on all html elemern and hiddes an element.
    wrapper.hidden = true;
}

//completed loading function
function removeLoadingSpinner() {
    wrapper.hidden = false;
    loader.hidden = true; 
}
//calling the removeLoadingSpinner() so that the spinner is not visisble in the beggining of entering the website:
removeLoadingSpinner();
//a global variable to save the api responed.
let apiTrailResult = [];
let lngLat = [];

//new quote function that randomly generates a new quotes.
function displayTrails() {
    console.log(apiTrailResult);
    //showing the spinner while the API call is loadinh. 
    showLoadingSpinner();
    //if there are no result in teh API call:
    if (apiTrailResult.length === 0) {
        console.log("In if");
        noTrails.innerText = "There are no trails here, please try again!";
        
    }
    else {
        for (let i = 0; i < apiTrailResult.length; i++) {
            //variables for creating a new HTML element 
            //creating a new <li>
            let newList = document.createElement('li');
            //creating a new <a>
            let newLink = document.createElement('a');
            
            //setting the api result text in the list. 
            newList.innerText = apiTrailResult[i].name;
            //setting the href on th <a> with the result from the api call
            newLink.setAttribute("href", apiTrailResult[i].url);

            //apendeing the list on the <a> which make the <a> wraping the list creating a link
            newLink.appendChild(newList);
           
            //appending the link with its children to the innerHTML element. 
            trails.appendChild(newLink);
        }
    }

    //removing the spinner
    removeLoadingSpinner();
}

//function to clear the already listed trails
function clearList() {
    document.getElementById("trails").innerHTML = "";
    document.getElementById("no-trails").innerHTML = "";
}

//Fetching API data: 
async function getTrails() {
    showLoadingSpinner();
    //api URL:
    const apiUrl = `https://trailapi-trailapi.p.rapidapi.com/trails/explore/?lon=${lngLat.lng}&lat=${lngLat.lat}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'xxxxx',
            'X-RapidAPI-Host': 'xxxxx'
        }
    };
   
    //trying to fetch the data from the API:
    try {
        //fetch request
        const response = await fetch(apiUrl, options);

        //converted result to json data. 
        const result = await response.json();
       
        apiTrailResult = result.data;

         //execute the displaying trail function:
         displayTrails();
    }
    //if TRY don't work, catch catches any error.
    catch (error) {
        //catch error here:
    }
    removeLoadingSpinner();
}

/////  MAP  /////

//https://maplibre.org/
//using map libre to display map:
const map = new maplibregl.Map({
    container: 'map',
    //style used from map tiler api.
    style: 'https://api.maptiler.com/maps/outdoor-v2/style.json?key=xxxxxx', // stylesheet location
    center: [-1.494782, 53.890062], 
    zoom: 4 // starting zoom
});

// adding a movable marker
// creatinga variable and getting and accessing the HTML element through its ID:
const coordinates = document.getElementById('coordinates');
//creating a new marker from moving:
const markerMoveable = new maplibregl.Marker({
        //HTMLElement: 
        color: '#904454',
        draggable: true,
        className: "marker"
    })
    .setLngLat([-1.494782, 53.890062]) //the starting position of the moveable marker.
    .addTo(map);//adding marker to the map.
    map.getCanvas().style.cursor = 'move';
//making the marker movable:
function onDragEnd() {
    //getting lng and lat from the markers possition.
    lngLat = markerMoveable.getLngLat();
    coordinates.style.display = 'block';
    //calling the functions to get the trail:
    getTrails();
    clearList();
}
markerMoveable.on('dragend', onDragEnd);
