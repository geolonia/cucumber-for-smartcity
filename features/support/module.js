const globalMercator = require('global-mercator')
const axios = require('axios')
const turf = require('@turf/turf')
const { VectorTile } = require('mapbox-vector-tile')
const { Location } = require("@aws-sdk/client-location");

const defaultZoom = 14

const locationService = new Location({
  region: 'ap-northeast-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

/**
 * 住所を緯度経度に変換する
 *
 * @param {string} text
 * @returns {number[]} [lng, lat]
 */
const addressToLngLat = async (address) => {
  const params = {
    IndexName: 'bbd-for-smartcity',
    Text: address,
    Language: 'ja',
  };

  try {
    const response = await locationService.searchPlaceIndexForText(params)
    if (response.Results.length > 0 && response.Results[0].Relevance >= 1) {
      return response.Results[0].Place.Geometry.Point;
    } else {
      return []
    }
  } catch(e) {
    throw new Error(e)
  }
}

/**
 * 緯度経度からタイル番号に変換する
 *
 * @param {*} lng
 * @param {*} lat
 * @param {*} zoom
 * @returns
 */
const lnglatToTile = (lng, lat, zoom = defaultZoom) => {
  return google = globalMercator.lngLatToGoogle([lng, lat], zoom)
}

/**
 * ベクトルタイルを取得してGeoJSONに変換する
 *
 * @param {*} tileUrl
 * @param {*} x
 * @param {*} y
 * @param {*} z
 * @param {*} option axios's option
 * @returns
 */
const getTile = async (tileUrl, x, y, z, option={}) => {
  const url = tileUrl.replace('{z}', String(z)).replace('{x}', String(x)).replace('{y}', String(y))

  let buffer

  try {
    const res = await axios.get(url, { responseType: 'arraybuffer', ...option})
    buffer = Buffer.from(res.data, 'binary')
  } catch (error) {
    throw new Error(error)
  }

  const tile = new VectorTile(buffer)

  let layers = Object.keys(tile.layers)

  if (!Array.isArray(layers)) layers = [layers]

  const features = []

  for (let i = 0; i < layers.length; i++) {
    const layerID = layers[i]

    const layer = tile.layers[layerID]
    if (layer) {
      for (let j = 0; j < layer.length; j++) {
        const feature = layer.feature(j).toGeoJSON(x, y, z)
        if (layers.length > 1) feature.properties.vt_layer = layerID

        const geojson = {
          type: 'FeatureCollection',
          features: [feature],
        }

        features.push(geojson)
      }
    }
  }

  return features
}

/**
 * 緯度経度から高松市のハザード情報を取得する
 * @param {*} lng
 * @param {*} lat
 * @returns
 */
const getTakamatsuHazard = async (lng, lat) => {

  const header = {
    headers: {
      'Origin': process.env.ORIGIN,
    },
  }

  const tile = lnglatToTile(lng, lat, 20)
  const tileUrl = `https://tileserver.geolonia.com/takamatsu-hazard_v3/tiles/{z}/{x}/{y}.pbf?key=${process.env.API_KEY}`

  const geojsons = await getTile(tileUrl, ...tile, header)

  const properties = []

  for (let i = 0; i < geojsons.length; i++) {
    const geojson = geojsons[i]
    const feature = geojson.features[0]

    const isPolygonInvalid = feature.geometry.coordinates[0].length < 4

    if (isPolygonInvalid) {
      continue
    }

    const point = turf.point([lng, lat])
    const polygon = turf.polygon(feature.geometry.coordinates)

    if(turf.booleanPointInPolygon(point, polygon)) {
      properties.push(feature.properties)
    }
  }

  return properties
}

/**
 * テキストから緯度経度を抽出する。「」か "" で囲われた住所があれば住所を緯度経度に変換する。
 * @param {*} text
 * @returns
 */
const textToLngLat = async (text) => {
  let match = []
  let lnglat = []

  match = text.match(/緯度.*?(\-?[0-9]+\.?[0-9]+).*?経度.*?(\-?[0-9]+\.?[0-9]+)/)
  if (match) {
    lnglat = [Number(match[2]), Number(match[1])]
  } else {
    match = text.match(/.*?(\-?[0-9]+\.?[0-9]+)\s*(\/|,)\s*(\-?[0-9]+\.?[0-9]+)/)
    if (match) {
      lnglat = [Number(match[3]), Number(match[1])]
    }
  }

  if (! lnglat.length) {
    try {
      const match = text.match(/「(.*?)」/) || text.match(/"(.*?)"/)
      if (match) {
        lnglat = await addressToLngLat(match[1].trim())
      }
    } catch(e) {
      lnglat = []
    }
  }

  return lnglat
}

const addLocations = (object, lnglat) => {
  object.locations.push(lnglat)
}

const getLocations = (object) => {
  return object.locations
}

module.exports = {
  lnglatToTile,
  getTile,
  textToLngLat,
  addLocations,
  getLocations,
  addressToLngLat,
  getTakamatsuHazard,
}
