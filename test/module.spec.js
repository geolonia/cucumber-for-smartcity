const assert = require('assert')
const { lnglatToTile, getTile, textToLngLat, addressToLngLat } = require('../features/support/module')

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

describe('Tests for addressToLngLat()', () => {
  it('valid address returns correct lng/lat', async () => {
    const result = await addressToLngLat('東京都千代田区丸の内1丁目');

    assert.deepStrictEqual(result.length, 2);
    assert.deepStrictEqual(typeof result[0], 'number');
    assert.deepStrictEqual(typeof result[1], 'number');
  });

  it('non-existent address returns empty result', async () => {
    const expected = [0, 0];
    const result = await addressToLngLat('This address does not exist');
    assert.deepStrictEqual(result, expected);
  });
});
