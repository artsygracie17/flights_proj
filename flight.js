var map;
var geocoder;
var home;
var geoLocations = {};
var flightPathCoordinates = [];
var homeThreeLetter;
var threeLetterArray = []

var userInput = document.querySelector('#userInput');
var newInput = document.querySelector('#newInput');

var baseURL = "https://airport.api.aero/airport/nearest/"

//lat/lng
//42.3600825/-71.05888010000001

var parameters = "?user_key=aca0b519bc76604bb73c62a0832897e6&callback=processResponse";



//google.maps.event.addDomListener(window, 'load', initialize);

//$('#map-canvas').hide();


$('#newInput').hide();
$('#search').hide();



$('#userInput').focus();

$('#userInput').keypress(function(event) {
  if (event.keyCode==13) {
    event.preventDefault();
    var input = $('#userInput').val();
    home = input.split(',');
    // var URL = baseURL + encodeURI(home) + parameters;
    // jsonRequest(URL);
    console.log(home);
    $('#newInput').show();
    $('#newInput').focus();
  }

});

$('#newInput').keypress(function(event) {
  if (event.keyCode==13) {
    event.preventDefault();
    var inputs = $('#newInput').val();
    places = inputs.split(',');
    //sendAPIRequests(places);
    console.log(places);
    $('#search').show();
    $('#search').focus();
  }
});

$('#search').click(function() {
  console.log('button clicked');
  console.log('home is: ' + home);
  loadScript();
  $('.firstPage').hide();
  home = $('#userInput').val();
  console.log(home);
  setTimeout(function() {
    findLocation(home);
  }, 1000);

  console.log(places);

  setTimeout(function() {
    for (i=0; i<places.length; i++) {
      console.log(places[i]);
      findLocation(places[i]);
    }
  }, 1000);
  
}); //end click function

//global variables are initialized here
function initialize() {
  geocoder = new google.maps.Geocoder();
  infoWindow = new google.maps.InfoWindow();
  console.log('in initialize');
  console.log(home);
  //console.log(findLocation(home));
  var mapOptions = {
    center: {lat: 0, lng: 0},
    zoom: 2,
    //mapTypeId: 'roadmap'
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
} //end initialize


function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
      '&signed_in=true&callback=initialize';
  document.body.appendChild(script);
}

function jsonRequest(requestURL) {
  var newEl = document.createElement("script");
  newEl.setAttribute("src", requestURL);
  newEl.setAttribute("id", 'json');
  var old = document.getElementById("json");
  var head = document.getElementsByTagName('head')[0];
  if (old == null) {
    head.appendChild(newEl);
  } 
  else {
    head.replaceChild(newEl, old);
  }
} //end json request

function sendAPIRequest(location) {
  var latLng = geoLocations[location];
  var URL = baseURL + encodeURI(latLng.k) + '/' + encodeURI(latLng.D) + parameters;
  jsonRequest(URL);
} //end sendAPIRequests

//processes aero response
function processResponse(response) {
  console.log('in processResponse');
  console.log(response);
  var threeLetter = response.airports[0].code;
  if (response.airports[0].city == home)
    homeThreeLetter = threeLetter;
  console.log(threeLetter);
}

/* return geo-coordinates given a location */
function findLocation(location){
      geocoder.geocode( { 'address': location}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        console.log('status ok; in findLocation');
        console.log(location);
        console.log(results);
        var latLng = results[0].geometry.location;
        geoLocations[location] = latLng; //store in list of locations

        markLocation(location);
        sendAPIRequest(location);
        
      }
    });
} //end findLocation

function markLocation(location) {
  var marker = new google.maps.Marker({
    map: map,
    position: geoLocations[location],
    name: location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(location);
    infoWindow.open(map, marker);
  });

  marker.setMap(map);
  drawPath(home, location);
} //end markLocation


function drawPath(home, location) {
  var flightPath = new google.maps.Polyline({
    path: [geoLocations[home], geoLocations[location]],
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  flightPath.setMap(map);
} //end drawPath


function getDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd<10) {
      dd='0'+dd
  } 

  if(mm<10) {
      mm='0'+mm
  } 

  today = yyyy + '-' + mm + '-' + dd;
  return today;

} //end getDate

// function createJSON() {

//   var j = {
//     "request": {
//       "passengers": {
//         "adultCount": 1
//       },
//       "slice": [
//         {
//           "origin": homeThreeLetter,
//           "destination": "LAX",
//           "date": getDate();
//         },
//         {
//           "origin": "LAX",
//           "destination": "BOS",
//           "date": getDate();
//         }
//       ]
//     }
//   };
//   JSON.stringify(j);
// } //end createJSON

// function ajaxRequest(file) {
//   var request = new XMLHttpRequest(); 
//   request.open("POST", file, true); 

//   request.onload = function() {
//     if (request.status == 201) {
       
//       console.log(request.responseText);
//     }
//   };
//   request.send(null); 
// } //end ajaxRequest 

// ajaxRequest('request.json');

//API key = AIzaSyA2WyJeAK6SUxRULLyOClckB6ROnBlRSv8
 
  