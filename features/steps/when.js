const { When } = require('@cucumber/cucumber')
const { addLocations, textToLngLat } = require('../support/module')

When(/^現在位置は(.+?)である。$/, async function(text) {
  addLocations(this, await textToLngLat(text))
});
