import assert, { rejects } from 'assert'
import { Then } from '@cucumber/cucumber'
import { getLocations, textToLngLat, lnglatToTile, getTile } from '../support/module.js'
import { geoContains } from 'd3-geo'

Then(/^現在の座標は(.+?)であるべきである。$/, async function(text) {
  const expected = await textToLngLat(text)
  const current = getLocations(this).slice(-1)[0]

  assert.deepStrictEqual(current, expected)
});

Then(/そこには建築物がある。/, function() {
  let result = false

  const current = getLocations(this).slice(-1)[0]

  if (current.length) {
    const tile = lnglatToTile(current[0], current[1], 16)

    return getTile('https://cyberjapandata.gsi.go.jp/xyz/optimal_bvmap-v1/{z}/{x}/{y}.pbf', ...tile).then(features => {
      for (let i = 0; i < features.length; i++) {
        if (geoContains(features[i], current)) {
          if (features[i].features[0].properties.vt_code && 3100 <= features[i].features[0].properties.vt_code && 4000 >= features[i].features[0].properties.vt_code) {
            result = true
          }
        }
      }

      if (false === result) {
        throw new Error('建築物が見つかりませんでした。')
      }
    })
  } else {
    throw new Error('建築物が見つかりませんでした。')
  }
})

Then(/そこには建築物がない。/, function() {
  let result = false

  const current = getLocations(this).slice(-1)[0]

  if (current.length) {
    const tile = lnglatToTile(current[0], current[1], 16)

    return getTile('https://cyberjapandata.gsi.go.jp/xyz/optimal_bvmap-v1/{z}/{x}/{y}.pbf', ...tile).then(features => {
      for (let i = 0; i < features.length; i++) {
        if (geoContains(features[i], current)) {
          if (features[i].features[0].properties.vt_code && 3100 <= features[i].features[0].properties.vt_code && 4000 >= features[i].features[0].properties.vt_code) {
            result = true
          }
        }
      }

      if (true === result) {
        throw new Error('建築物があります。')
      }
    })
  }
})
