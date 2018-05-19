<script>
// import MarkersData from '../data/MarkersData';

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
          Coordinates: ['33.45123333', '-86.71606666'],
          County: 'Jackson',
          Title: 'Anthony L. Barnes/The Cahaba Pumping Station',
          LatKey: '37-175',
          Waymark: 'WMKTM7',
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
      }
    }

    // console.log(JSON.stringify(preppedData));

    // JSON responses are automatically parsed.
    vm.markers = preppedData;
  },
};
</script>
<template>
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
      <a :href='marker.latUrl'>Description of marker</a>
    </li>
  </ul>

  </div>
</template>


<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
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
