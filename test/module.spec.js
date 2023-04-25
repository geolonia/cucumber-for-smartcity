const assert = require('assert')
const { lnglatToTile, getTile, textToLngLat } = require('../features/support/module')

describe('Tests for lnglatToTile()', () => {
  it('should return tile number as expected', () => {
    assert.deepStrictEqual(lnglatToTile(139.766195, 35.681304), [14552, 6451, 14])
  })

  it('should return tile number as expected with custom zoom', () => {
    assert.deepStrictEqual(lnglatToTile(139.766195, 35.681304, 16), [58211, 25806, 16])
  })
})

describe('Tests for getTile()', () => {
  it('should return tile data as expected', async () => {
    const url = 'https://cyberjapandata.gsi.go.jp/xyz/optimal_bvmap-v1/{z}/{x}/{y}.pbf'
    const features = await getTile(url, 14552, 6451, 14)

    assert.deepStrictEqual(!! features.length, true)
  })
})

describe('Tests for textToLngLat()', () => {
  it('should return lnglat as expected', () => {
    const text = '現在位置は、緯度 "1111" 経度 "2222" である'
    const lnglat = textToLngLat(text)

    assert.deepStrictEqual(lnglat, [2222, 1111])
  })
  it('should return lnglat as expected', () => {
    const text = '現在位置は、緯度 "1111.1111" 経度 "2222.2222" である'
    const lnglat = textToLngLat(text)

    assert.deepStrictEqual(lnglat, [2222.2222, 1111.1111])
  })
  it('should return lnglat as expected', () => {
    const text = '現在位置は緯度:"1111.1111"経度:"2222.2222"である'
    const lnglat = textToLngLat(text)

    assert.deepStrictEqual(lnglat, [2222.2222, 1111.1111])
  })
  it('should return lnglat as expected', () => {
    const text = '現在位置は、緯度:1111.1111/経度:"2222.2222"である'
    const lnglat = textToLngLat(text)

    assert.deepStrictEqual(lnglat, [2222.2222, 1111.1111])
  })
  it('should return lnglat as expected', () => {
    const text = '1111.1111/2222.2222'
    const lnglat = textToLngLat(text)

    assert.deepStrictEqual(lnglat, [2222.2222, 1111.1111])
  })
  it('should return lnglat as expected', () => {
    const text = '緯度経度が1111.1111,2222.2222'
    const lnglat = textToLngLat(text)

    assert.deepStrictEqual(lnglat, [2222.2222, 1111.1111])
  })
  it('should return lnglat as expected', () => {
    const text = '緯度経度が "1111.1111 / 2222.2222"'
    const lnglat = textToLngLat(text)

    assert.deepStrictEqual(lnglat, [2222.2222, 1111.1111])
  })
  it('should return lnglat as expected', () => {
    const text = '現在位置は、1111.1111/2222.2222で高度は10mである'
    const lnglat = textToLngLat(text)

    assert.deepStrictEqual(lnglat, [2222.2222, 1111.1111])
  })
})

