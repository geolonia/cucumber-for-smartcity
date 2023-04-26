const assert = require('assert')
const { lnglatToTile, getTile, textToLngLat, addressToLngLat, getAddressFromText } = require('../features/support/module')

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
    const text = '現在位置は、1111.1111/2222.2222で高度は10mである'
    const lnglat = await textToLngLat(text)

    assert.deepStrictEqual(lnglat, [2222.2222, 1111.1111])
  })
  it('should return lnglat as expected',  async () => {
    const text = '現在位置は、「東京都千代田区丸の内1丁目」である'
    const lnglat = await textToLngLat(text)

    assert.deepStrictEqual(lnglat.length, 2);
    assert.deepStrictEqual(typeof lnglat[0], 'number');
    assert.deepStrictEqual(typeof lnglat[1], 'number');
  })
})

describe('Tests for addressToLngLat()', () => {
  it('valid address returns correct lng/lat', async () => {
    const result = await addressToLngLat('東京都千代田区丸の内1丁目2番1号');

    assert.deepStrictEqual(result.length, 2);
    assert.deepStrictEqual(typeof result[0], 'number');
    assert.deepStrictEqual(typeof result[1], 'number');
  });

  it('valid address returns correct lng/lat', async () => {
    const result = await addressToLngLat('東京都千代田区丸の内1-2-1');

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

describe('getAddressFromText', () => {
  it('should return an array with the address surrounded by 「」', () => {
    const text = '住所は「東京都千代田区丸の内1丁目1番1号」です';
    const result = getAddressFromText(text);
    assert.deepStrictEqual(result, '東京都千代田区丸の内1丁目1番1号');
  });

  it('If there are multiple addresses enclosed in 「」, the first one should returned.', () => {
    const text = '住所は、「和歌山県東牟婁串本町串本1丁目1番1号」と「東京都千代田区丸の内1丁目」です';
    const result = getAddressFromText(text);
    assert.deepStrictEqual(result, '和歌山県東牟婁串本町串本1丁目1番1号');
  });

  it('should return null when no address is found', () => {
    const text = '本文に住所はありません';
    const result = getAddressFromText(text);
    assert.strictEqual(result, '');
  });
});
