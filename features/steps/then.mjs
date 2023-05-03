import assert, { rejects } from 'assert'
import { Then } from '@cucumber/cucumber'
import { getLocations, textToLngLat, lnglatToTile, getTile, getTakamatsuHazard } from '../support/module.js'
import { geoContains } from 'd3-geo'
import { openReverseGeocoder } from "@geolonia/open-reverse-geocoder"

Then(/^現在の座標は(.+?)であるべきである。$/, async function(text) {
  const expected = await textToLngLat(text)
  const current = getLocations(this).slice(-1)[0]

  assert.deepStrictEqual(current, expected)
});

Then(/^(そ|こ)こは(.+?)(都|道|府|県)(.+?)?(市|区|町|村)?で(ある|はない)。$/, async function(dummy, pref, prefSuffix, city, citySuffix, existance) {
  const expected = `${pref}${prefSuffix}${city || ''}${citySuffix || ''}`
  let result = false

  const current = getLocations(this).slice(-1)[0]

  if (current.length) {
    return openReverseGeocoder(current).then((response) => {
      const reg = new RegExp(`^${expected}`)
      const place = `${response.prefecture}${response.city}`

      if (place.match(reg)) {
        result = true
      }

      if (('ある' === existance && false === result) || ('はない' === existance && true === result)) {
        assert.fail(`ここは${place}です。`)
      }
    })
  } else if ('ある' === existance) {
    assert.fail('場所を特定できませんでした。')
  }
});

Then(/^(そこに|それ)は(建築?物|普通建物|堅ろう建物|堅牢建物|高層建物)(が|で)(ある|は?ない)。$/, function(dummy1, name, dummy2, existance) {
  let result = false

  const current = getLocations(this).slice(-1)[0]

  if (current.length) {
    const tile = lnglatToTile(current[0], current[1], 16)

    return getTile('https://cyberjapandata.gsi.go.jp/xyz/optimal_bvmap-v1/{z}/{x}/{y}.pbf', ...tile).then(features => {
      for (let i = 0; i < features.length; i++) {
        if (geoContains(features[i], current)) {
          switch(name) {
            case '建築物':
              if (features[i].features[0].properties.vt_code && 3100 <= features[i].features[0].properties.vt_code && 4000 >= features[i].features[0].properties.vt_code) {
                result = true
              }
              break
            case '普通建物':
              if (features[i].features[0].properties.vt_code && 3101 === features[i].features[0].properties.vt_code) {
                result = true
              }
              break
            case '堅ろう建物':
            case '堅牢建物':
              if (features[i].features[0].properties.vt_code && 3102 === features[i].features[0].properties.vt_code) {
                result = true
              }
              break
            case '高層建物':
              if (features[i].features[0].properties.vt_code && 3103 === features[i].features[0].properties.vt_code) {
                result = true
              }
              break
            default:
              result = false
          }
        }
      }

      if ('ある' === existance && false === result) {
        assert.fail(`${name}が見つかりませんでした。`)
      } else if ('ない' === existance && true === result) {
        assert.fail(`${name}があります。`)
      }
    })
  } else if ('ある' === existance) {
    assert.fail('場所を特定できませんでした。')
  }
})

Then(/^そこには災害リスクがある。$/, function() {
  let result = false

  const current = getLocations(this).slice(-1)[0]

  if (current.length) {
    return getTakamatsuHazard(...current).then(array => {
      if (array.length) {
        result = true
      }

      if (false === result) {
        assert.fail('災害リスクが見つかりませんでした。')
      }
    })
  } else {
    assert.fail('場所を特定できませんでした。')
  }
})

Then(/^そこには災害リスクがない。$/, function() {
  let result = false

  const current = getLocations(this).slice(-1)[0]

  if (current.length) {
    return getTakamatsuHazard(...current).then(array => {
      if (array.length) {
        result = true
      }

      if (true === result) {
        assert.fail(JSON.stringify(array, null, '  '))
      }
    })
  } else {
    assert.fail('場所を特定できませんでした。')
  }
})
