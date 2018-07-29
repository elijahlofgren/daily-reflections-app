import axios from 'axios';
import L from 'leaflet';
import GpsUtils from '../util/GpsUtils';

// createLabelIcon is from https://gis.stackexchange.com/questions/157696/leaflet-js-text-is-not-showing-on-map
function createLabelIcon(labelClass, labelText) {
  return L.divIcon({
    className: labelClass,
    html: labelText,
  });
}

const useHardCodedGps = true;
let userLat = 32.37685;
let userLon = -86.30078333;

/* eslint-enable */

export default {
  name: 'HelloWorld',
  data() {
    return {
      markets: null,
      rawSpreadsheetData: null,
      rawMarkersData: null
    };
  },
  created() {
    const vm = this;
    vm.rawMarkersData = [];
    axios.get("https://sheets.googleapis.com/v4/spreadsheets/15wmNoQh5XE0KygS1N1zIYuejPPDRm6tNUdFt9GyhEUc/values/Sheet1?key=AIzaSyAEgmM-Fnzc3ihs54orFIiwkyaZo9ywKQs")
      .then((response) => {
        vm.rawSpreadsheetData = response.data;
        console.log(vm.rawSpreadsheetData.values);
        // Start at index 1 since index 0 is column headers
        const startRowIndex = 1;
        for (let i = startRowIndex; i < vm.rawSpreadsheetData.values.length; i++) {
          let row = vm.rawSpreadsheetData.values[i];
          let item = {
            county: row[0],
            name: row[1],
            hours: row[2].replace('\n', '<br />'),
            website: row[3],
            facebook: row[4],
            address: row[5],
            lat: row[6],
            lng: row[7]
          };
          vm.rawMarkersData.push(item);
        }

        if (useHardCodedGps) {
          vm.gpsReady();
        } else {
          /* eslint-disable */
          navigator.geolocation.getCurrentPosition(
            function success(position) {
              userLat = position.coords.latitude;
              userLon = position.coords.longitude;
              //alert('Latitude: ' + position.coords.latitude + ' Longitude: ' + position.coords.longitude);
              vm.gpsReady();
            },
            function error(error) {
              alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
            },
          );
        }
      }).catch((err) => {
        alert('Error' + err);
      })
  },
  methods: {
    /*swipe(direction, marker) {
      console.log("Swipe to " + direction + " for maker id: " + marker.Id);
      var storage = window.localStorage;
      if (direction === 'right') {
        marker.visited = true;
        storage.setItem(marker.Id, "visited") // Pass a key name and its value to add or update that key.
        var isVisited = storage.getItem(marker.Id); // Pass a key name to get its value.
        console.log("isVisited for " + marker.Id + " is set to: " + isVisited);
      }
      if (direction === 'left') {
        marker.visited = false;
        storage.removeItem(marker.Id) // Pass a key name to remove that key from storage.
      }
    },*/
    gpsReady() {
      let vm = this;
      //var storage = window.localStorage;
      const preppedData = vm.rawMarkersData;


      // URL like
      // https://www.google.com/maps/?q=123 Somewhere,Montgomery, AL 36109
      const gmapUrlPrefix = 'https://www.google.com/maps/?q=';
      for (let i = 0; i < preppedData.length; i += 1) {
        const marker = preppedData[i];
        if (marker.lat && marker.lng) {
          // Map URLS
          preppedData[i].gmapsUrl = `${gmapUrlPrefix}${marker.address}`;
          //preppedData[i].visited = false;

          //var isVisited = storage.getItem(marker.Id); // Pass a key name to get its value.
          /*console.log("isVisited for " + marker.Id + " is set to: " + isVisited);
          if (isVisited != null) {
            preppedData[i].visited = true;
          }*/
          // Measure between two points:
          const lat = preppedData[i].lat;
          const lon = preppedData[i].lng;
          const result = GpsUtils.distanceTo({
            lat,
            lon
          }, {
            lat: userLat,
            lon: userLon
          }, );
          preppedData[i].distance = result;
        }
      }

      // console.log(JSON.stringify(preppedData));

      // JSON responses are automatically parsed.
      vm.markets = preppedData.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    }
  },
  mounted() {
    /*
    demo of showing label on map.
    const mymap = L.map('mapid').setView([userLat, userLon], 15);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoiZWxvZmdyZW4iLCJhIjoiY2poZmUxanNpMTd5dzMwbWQybTN2MjhjaiJ9.cKtaDiFIjeHJAoIt7h7ZDw',
    }).addTo(mymap);

    const marker = L.marker([userLat, userLon], { icon: createLabelIcon('mapLabel', 'a place') }).addTo(mymap);
    marker.bindPopup('<b>Hello world!</b><br>I am a popup.').openPopup(); */
  },
};
