const assert = require('assert')
const { lnglatToTile, getTile, textToLngLat, addressToLngLat, getTakamatsuHazard } = require('../features/support/module')

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

describe('getTakamatsuHazard', () => {

  it('should return expected feature', async () => {

    const expected = [
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                134.0555191040039,
                34.356111121015545
              ],
              [
                134.05561096966267,
                34.35611070583673
              ],
              [
                134.05561038292944,
                34.35602054278951
              ],
              [
                134.0555191040039,
                34.35602095796875
              ],
              [
                134.05551239848137,
                34.35602095796875
              ],
              [
                134.05551239848137,
                34.356111121015545
              ],
              [
                134.0555191040039,
                34.356111121015545
              ]
            ]
          ]
        },
        "properties": {
          "suisin": 1.27,
          "x": 51105,
          "y": 150535,
          "vt_layer": "高潮浸水想定区域図（想定最大規模）"
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                134.0555191040039,
                34.356111121015545
              ],
              [
                134.05561096966267,
                34.35611070583673
              ],
              [
                134.05561038292944,
                34.35602054278951
              ],
              [
                134.0555191040039,
                34.35602095796875
              ],
              [
                134.05551239848137,
                34.35602095796875
              ],
              [
                134.05551239848137,
                34.356111121015545
              ],
              [
                134.0555191040039,
                34.356111121015545
              ]
            ]
          ]
        },
        "properties": {
          "keizoku": 1,
          "vt_layer": "高潮浸水想定区域図（浸水継続時間）"
        }
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
    const result = res.map(feature => feature.properties.vt_layer)

    assert.deepStrictEqual(result.sort(), expected.sort())
  })
})
