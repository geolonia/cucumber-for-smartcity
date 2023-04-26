import { When } from '@cucumber/cucumber'
import { addLocations, textToLngLat } from '../support/module.js'

When(/^現在位置は(.+?)である。$/, function(text) {
  addLocations(this, textToLngLat(text))
});
