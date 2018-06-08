<script>
// import MarkersData from '../data/MarkersData';
import L from 'leaflet';

// createLabelIcon is from https://gis.stackexchange.com/questions/157696/leaflet-js-text-is-not-showing-on-map
function createLabelIcon(labelClass, labelText) {
  return L.divIcon({
    className: labelClass,
    html: labelText,
  });
}

// Begin adapted from https://github.com/chrisveness/geodesy/blob/master/latlon-spherical.js
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Latitude/longitude spherical geodesy tools                         (c) Chris Veness 2002-2017  */
/*                                                                                   MIT Licence  */
/* www.movable-type.co.uk/scripts/latlong.html                                                    */
/* www.movable-type.co.uk/scripts/geodesy/docs/module-latlon-spherical.html                       */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/** converts numeric degrees to radians */
function toRadians(number) {
  return number * (Math.PI / 180);
}

/**
 * Returns the distance between two GPS points (using haversine formula).
 *
 * @param   {LatLon} point - Latitude/longitude of source point.
 * @param   {LatLon} point - Latitude/longitude of destination point.
 * @returns {number} Distance between this point and destination point, in miles.
 *
 * @example
 *     var p1 = new LatLon(52.205, 0.119);
 *     var p2 = new LatLon(48.857, 2.351);
 *     var d = p1.distanceTo(p2); // 404.3 km
 */
function distanceTo(point1, point2) {
  const radius = 6371e3; // Radius of earth in meters

  // a = sin²(Δφ/2) + cos(φ1)⋅cos(φ2)⋅sin²(Δλ/2)
  // tanδ = √(a) / √(1−a)
  // see mathforum.org/library/drmath/view/51879.html for derivation

  const R = radius;
  const φ1 = toRadians(point1.lat);
  const λ1 = toRadians(point1.lon);
  const φ2 = toRadians(point2.lat);
  const λ2 = toRadians(point2.lon);
  const Δφ = φ2 - φ1;
  const Δλ = λ2 - λ1;

  const a = (Math.sin(Δφ / 2) * Math.sin(Δφ / 2))
        + (Math.cos(φ1) * Math.cos(φ2)
        * Math.sin(Δλ / 2) * Math.sin(Δλ / 2));
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  const miles = d * 0.000621;
  const rounded = miles.toFixed(2);
  return rounded;
}
// End adapted from https://github.com/chrisveness/geodesy/blob/master/latlon-spherical.js

export default {
  name: 'HelloWorld',
  data() {
    return {
      markers: null,
      msg: 'Welcome to Your Vue.js App',
    };
  },
  created() {
    const vm = this;
    const MarkersData = {
      markers: [
        {
          City: 'Vestavia',
          Coordinates: [33.45123333, -86.71606666],
          County: 'Jackson',
          Title: 'Anthony L. Barnes/The Cahaba Pumping Station',
          LatKey: '37-175',
          Waymark: 'WMKTM7',
        },
        {
          City: 'Montgomery',
          Coordinates: [32.37685, -86.30078333],
          County: 'Montgomery',
          Title: 'Alabama Highway Patrol',
          LatKey: 'tbd',
          Waymark: 'tbd',
        },
        {
          City: 'Headland',
          Coordinates: [31.35148333, -85.33825],
          County: 'Henry',
          Title: 'First Baptist Church of Headland',
          LatKey: 'tbd',
          Waymark: 'tbd',
        },
        {
          City: 'Screamer Community',
          Coordinates: [31.68158333, -85.2021],
          County: 'Henry',
          Title: 'Liberty United Methodist Church / Hilliardsville',
          LatKey: 'tbd',
          Waymark: 'tbd',
        },
        {
          City: 'Fort Mitchell',
          Coordinates: [32.3441, -85.021],
          County: 'Russell',
          Title: 'Indian Ball Ground',
          LatKey: 'tbd',
          Waymark: 'tbd',
        },
        {
          City: 'Holy Trinity',
          Coordinates: [32.22061666, -85.00588333],
          County: 'Russell',
          Title: 'Spanish Fort',
          LatKey: 'tbd',
          Waymark: 'tbd',
        },
        {
          City: 'Highland Home',
          Coordinates: [31.95226666, -86.3137],
          County: 'Crenshaw',
          Title: 'Site of Highland Home College',
          LatKey: 'tbd',
          Waymark: 'tbd',
        },
        {
          City: 'Birmingham',
          Coordinates: [33.5704, -86.7248],
          County: 'Jefferson',
          Title: 'East Lake Park',
          LatKey: 'tbd',
          Waymark: 'tbd',
        },
      ],
    };
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
        const result = distanceTo(
          { lat: 33.45123333, lon: -86.71606666 },
          { lat: 32.37685, lon: -86.30078333 },
        );
        preppedData[i].distance = result;
      }
    }

    // console.log(JSON.stringify(preppedData));

    // JSON responses are automatically parsed.
    vm.markers = preppedData;
  },
  mounted() {
    const mymap = L.map('mapid').setView([32.37685, -86.30078333], 15);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoiZWxvZmdyZW4iLCJhIjoiY2poZmUxanNpMTd5dzMwbWQybTN2MjhjaiJ9.cKtaDiFIjeHJAoIt7h7ZDw',
    }).addTo(mymap);

    const marker = L.marker([32.37685, -86.30078333], { icon: createLabelIcon('mapLabel', 'a place') }).addTo(mymap);
    marker.bindPopup('<b>Hello world!</b><br>I am a popup.').openPopup();
  },
};
</script>
<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>

        <div class='hello'>
            <h1>{{ msg }}</h1>
              <ul v-if='markers && markers.length'>
              <li>MARKERS EXIST! test</li>
            <li v-for='(marker,index) of markers' :key='index'>
              <p><strong>title: {{marker.Title}}</strong></p>
              <p>{{marker.County}}</p>
              <a :href='marker.hereMapsUrl'>Directions (Here Map)</a><br />
              <a :href='marker.gmapsUrl'>Directions (Google Map)</a><br />
              <a :href='marker.waymarkUrl'>Waymark</a><br />
              <a :href='marker.latUrl'>Description of marker</a><br />
              <b>Distance: {{marker.distance}}</b><br />
            </li>
          </ul>

        Your location:
        <div id="mapid"></div>

  </div>

        <img src="../../static/img/v.png" alt="Vuetify.js" class="mb-5">
        <blockquote>
          &#8220;First, solve the problem. Then, write the code.&#8221;
          <footer>
            <small>
              <em>&mdash;John Johnson</em>
            </small>
          </footer>
        </blockquote>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>


<style>

.mapLabel{
  font-size:20px;
  white-space:nowrap;
  color: red;
}</style>
<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
#mapid { height: 580px; }


h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

