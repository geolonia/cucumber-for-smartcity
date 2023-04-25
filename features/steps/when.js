const { When } = require('@cucumber/cucumber')
const { addLocations, textToLngLat } = require('../support/module')

When(/^現在位置は(.+?)である。$/, function(text) {
  addLocations(this, textToLngLat(text))
});
