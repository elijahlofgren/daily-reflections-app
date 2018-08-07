import axios from 'axios';
import AppSettings from '../config/AppSettings';

/* eslint-enable */

function convertNewLinesToBrTag(val) {
  if (!val) {
    return val;
  } else {
    return val.replace(/\n/g, '<br />')
  }

}

export default {
  name: 'HelloWorld',
  data() {
    return {
      reflection: null,
      reflections: null,
      rawSpreadsheetData: null,
      currentSectionIndex: 0,
    };
  },
  created() {
    console.log('AppSettings = ');
    console.log(AppSettings);

    const vm = this;
    let reflections = [];
    axios.get('https://sheets.googleapis.com/v4/spreadsheets/' +
        AppSettings.sheetId + '/values/Sheet1?key=' + AppSettings.key)
      .then((response) => {
        vm.rawSpreadsheetData = response.data;
        console.log(vm.rawSpreadsheetData.values);
        // Start at index 1 since index 0 is column headers
        const startRowIndex = 1;
        for (let i = startRowIndex; i < vm.rawSpreadsheetData.values.length; i++) {
          let row = vm.rawSpreadsheetData.values[i];
          let item = {
            date: row[0],
            title: row[1],
            sections: [
              convertNewLinesToBrTag(row[2]),
              convertNewLinesToBrTag(row[3]),
              convertNewLinesToBrTag(row[4]),
              convertNewLinesToBrTag(row[5]),
              convertNewLinesToBrTag(row[6])
            ]
          };
          reflections.push(item);
        }

        vm.reflections = reflections;
        // TODO: Select by date instead of hard coded.
        vm.reflection = vm.reflections[0];
      }).catch((err) => {
        alert('Error' + err);
      })
  },
  methods: {
    swipe(direction, marker) {
      console.log("Swipe to " + direction);

      if (direction === 'left') {
        if (vm.currentSectionIndex > 0) {
          vm.currentSectionIndex--;
        }
      } else {
        let nextSectionIndex = vm.currentSectionIndex + 1;
        if (vm.reflection.sections.length > nextSectionIndex) {
          vm.currentSectionIndex--;
        }
      }
    },
    dataReady() {
      let vm = this;

    }
  },
  mounted() {},
};
