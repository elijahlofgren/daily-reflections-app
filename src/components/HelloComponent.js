import L from 'leaflet';
import MarkersData from '../data/MarkersData';
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
      markers: null
    };
  },
  created() {
    const vm = this;

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
  },
  methods: {
    gpsReady() {
      let vm = this;
      const preppedData = MarkersData.markers;
      // URL like
      // https://www.google.com/maps/?q=32.37685,-86.30078333
      const gmapUrlPrefix = 'https://www.google.com/maps/?q=';
      const hereMapsUrlPrefix = 'https://wego.here.com/search/';
      const waymarkUrlPrefix = 'http://www.waymarking.com/waymarks/';
      const latUrlPrefix = 'http://www.lat34north.com/HistoricMarkersAL/MarkerDetail.cfm?KeyID=';
      for (let i = 0; i < preppedData.length; i += 1) {
        const marker = preppedData[i];
        if (marker.Coordinates && marker.Coordinates.length > 1) {
          // Map URLS
          preppedData[i].gmapsUrl = `${gmapUrlPrefix}${marker.Coordinates[0]},${marker.Coordinates[1]}`;
          preppedData[i].hereMapsUrl = `${hereMapsUrlPrefix}${marker.Coordinates[0]},${marker.Coordinates[1]}`;
          preppedData[i].waymarkUrl = `${waymarkUrlPrefix}${marker.Waymark}`;
          preppedData[i].latUrl = `${latUrlPrefix}${marker.LatKey}`;

          // Measure between two points:
          const lat = preppedData[i].Coordinates[0];
          const lon = preppedData[i].Coordinates[1];
          const result = GpsUtils.distanceTo(
            { lat, lon },
            { lat: userLat, lon: userLon },
          );
          preppedData[i].distance = result;
        }
      }

      // console.log(JSON.stringify(preppedData));

      // JSON responses are automatically parsed.
      vm.markers = preppedData;
    }
  },
  mounted() {
    const mymap = L.map('mapid').setView([userLat, userLon], 15);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoiZWxvZmdyZW4iLCJhIjoiY2poZmUxanNpMTd5dzMwbWQybTN2MjhjaiJ9.cKtaDiFIjeHJAoIt7h7ZDw',
    }).addTo(mymap);

    const marker = L.marker([userLat, userLon], { icon: createLabelIcon('mapLabel', 'a place') }).addTo(mymap);
    marker.bindPopup('<b>Hello world!</b><br>I am a popup.').openPopup();
  },
};
