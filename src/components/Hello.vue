<script src="./HelloComponent.js"></script>
<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <div class='hello'>
            <v-flex xs12 sm12 v-for='(market,index) of markets' :key='index'>
             <!-- <v-card 
              v-touch="{
                left: () => swipe('left', market),
                right: () => swipe('right', market)
              }">-->
              <v-card >
                <!-- <v-card-media src="/static/doc-images/cards/desert.jpg" height="200px"></v-card-media> -->        
                <v-card-title primary-title>
                  <div>
                    <h3>
                    {{ market.name}}
                   <!-- <v-icon v-if="market.visited">fa fa-check-circle</v-icon>
                    <a :href='market.latUrl' target="_blank">{{ market.Title }}</a> -->
                    </h3>
                    <div v-html="market.hours"></div>
                    <div>County: {{ market.county }}</div>
                    <b>Distance: {{market.distance}} miles</b>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-btn dark small color="primary" :href='market.gmapsUrl' target="_blank">
                    <v-icon dark>fa fa-map-marker</v-icon>
                  </v-btn>
                  <v-btn v-if="market.facebook" dark small color="primary" :href='market.facebook' target="_blank">
                    <v-icon dark>fa fa-facebook</v-icon>
                  </v-btn>
                  <v-btn v-if="market.website" dark small color="primary" :href='market.website' target="_blank">
                    <v-icon dark>fa fa-globe</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>

        <!-- Your location:
         <div id="mapid"></div> -->
  </div> 
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>


<style>
.mapLabel {
  font-size: 20px;
  white-space: nowrap;
  color: red;
}
</style>
<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
#mapid {
  height: 580px;
}

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

