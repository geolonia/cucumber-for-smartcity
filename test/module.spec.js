const assert = require('assert')
const { lnglatToTile, getTile, textToLngLat, addressToLngLat, getAddressFromText, getTakamatsuHazard } = require('../features/support/module')

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
  it('should return lnglat as expected',  async () => {
    const text = '現在位置は、緯度 "1111" 経度 "2222" である'
    const lnglat = await textToLngLat(text)

    assert.deepStrictEqual(lnglat, [2222, 1111])
  })

  it('should return lnglat as expected',  async () => {
    const text = '現在位置は、緯度 "1111.1111" 経度 "2222.2222" である'
    const lnglat = await textToLngLat(text)

    assert.deepStrictEqual(lnglat, [2222.2222, 1111.1111])
  })

  it('should return lnglat as expected',  async () => {
    const text = '現在位置は緯度:"1111.1111"経度:"2222.2222"である'
    const lnglat = await textToLngLat(text)

    assert.deepStrictEqual(lnglat, [2222.2222, 1111.1111])
  })

  it('should return lnglat as expected',  async () => {
    const text = '現在位置は、緯度:1111.1111/経度:"2222.2222"である'
    const lnglat = await textToLngLat(text)

    assert.deepStrictEqual(lnglat, [2222.2222, 1111.1111])
  })

  it('should return lnglat as expected',  async () => {
    const text = '1111.1111/2222.2222'
    const lnglat = await textToLngLat(text)

    assert.deepStrictEqual(lnglat, [2222.2222, 1111.1111])
  })

  it('should return lnglat as expected',  async () => {
    const text = '緯度経度が1111.1111,2222.2222'
    const lnglat = await textToLngLat(text)

    assert.deepStrictEqual(lnglat, [2222.2222, 1111.1111])
  })

  it('should return lnglat as expected',  async () => {
    const text = '緯度経度が "1111.1111 / 2222.2222"'
    const lnglat = await textToLngLat(text)

    assert.deepStrictEqual(lnglat, [2222.2222, 1111.1111])
  })

  it('should return lnglat as expected',  async () => {
    const text = '現在位置は、「東京都千代田区丸の内1丁目1番1号」である'
    const lnglat = await textToLngLat(text)

    assert.deepStrictEqual(lnglat.length, 2);
    assert.deepStrictEqual(typeof lnglat[0], 'number');
    assert.deepStrictEqual(typeof lnglat[1], 'number');
  })

  it('should return lnglat as expected',  async () => {
    const text = '現在位置は、"東京都千代田区丸の内1丁目1番1号" である'
    const lnglat = await textToLngLat(text)

    assert.deepStrictEqual(lnglat.length, 2);
    assert.deepStrictEqual(typeof lnglat[0], 'number');
    assert.deepStrictEqual(typeof lnglat[1], 'number');
  })

  it('should return lnglat as expected',  async () => {
    const text = '現在位置は、"東京都千代田区丸の内1-1-1" である'
    const lnglat = await textToLngLat(text)

    assert.deepStrictEqual(lnglat.length, 2);
    assert.deepStrictEqual(typeof lnglat[0], 'number');
    assert.deepStrictEqual(typeof lnglat[1], 'number');
  })

  it('should return empty arrayt as expected with wrong address',  async () => {
    const text = '現在位置は、"東京都千代田区丸の内100-200-20" である'
    const lnglat = await textToLngLat(text)

    assert.deepStrictEqual(lnglat, []);
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
    const expected = [];
    const result = await addressToLngLat('This address does not exist');
    assert.deepStrictEqual(result, expected);
  });
});

describe('getTakamatsuHazard', () => {

  it('should return expected feature', async () => {

    const expected = [
      {
        "suisin": 1.27,
        "x": 51105,
        "y": 150535,
        "vt_layer": "高潮浸水想定区域図（想定最大規模）"
      },
      {
        "keizoku": 1,
        "vt_layer": "高潮浸水想定区域図（浸水継続時間）"
      }
    ]

    const lng = 134.0555496
    const lat = 34.3560728

    const result = await getTakamatsuHazard(lng, lat)
    assert.deepStrictEqual(result, expected)
  })

  it('should return layers with expected layers', async () => {

    const expected = [
      "土砂災害警戒区域",
      "急傾斜地崩壊危険区域",
      "急傾斜地崩壊危険箇所",
      "洪水浸水想定区域図（想定最大規模）",
      "洪水浸水想定区域図（浸水継続時間）",
      "高潮浸水想定区域図（想定最大規模）",
      "高潮浸水想定区域図（浸水継続時間）"
    ]

    const lng = 134.0918781
    const lat = 34.3598964

    const res = await getTakamatsuHazard(lng, lat)
    const result = res.map(properties => properties.vt_layer)

    assert.deepStrictEqual(result.sort(), expected.sort())
  })
})
