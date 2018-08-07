<script src="./HelloComponent.js"></script>
<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <div v-if="reflection" class='hello'>
            <v-card 
              v-touch="{
                left: () => swipe('left', reflection),
                right: () => swipe('right', reflection)
              }">
                <!-- <v-card-media src="/static/doc-images/cards/desert.jpg" height="200px"></v-card-media> -->        
                <v-card-title primary-title>
                  <div>
                    <h3>
                    {{ reflection.title}}
                  </h3>
                    <div v-html="reflection.sections[currentSectionIndex]"></div>
                  </div>
                </v-card-title>
                <v-card-actions>
 <v-btn v-if="currentSectionIndex > 0"
                   dark small color="primary"
                    @click="currentSectionIndex--">
                    Back
                  </v-btn>

                  <v-btn v-if="reflection.sections[currentSectionIndex + 1]"
                   dark small color="primary"
                    @click="currentSectionIndex++">
                    Next
                  </v-btn>
                </v-card-actions>
              </v-card>
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

