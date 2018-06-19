<script src="./HelloComponent.js"></script>
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

