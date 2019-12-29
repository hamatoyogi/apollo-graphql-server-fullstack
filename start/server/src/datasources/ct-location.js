const { RESTDataSource } = require('apollo-datasource-rest')

class LocationAPI extends RESTDataSource {
  constructor () {
    super()
    this.baseURL = 'https://dev-app.theculturetrip.com/cultureTrip-api/'
  }

  async getLocationByPath (path) {
    const response = await this.get(`/v1/locations?locationPath=${path}`);
    console.log('%c this is response', 'background: black; color: red; font-size:30px', response);
    
    return response.hasOwnProperty('locationResources')
      ? this.locationReducer(response.locationResources[0])
      : {}
  }

  locationReducer (location) {
    return {
      parentName: location.parentName,
      parentKgID: location.parentID,
      kgID: location.kgID,
      synonym: location.synonym,
      articleCounter: location.articleCounter,
      displayName: location.displayName,
      locationID: location.locationID,
      parentID: location.parentID,
      locationType: location.locationType,
      isParent: location.isParent,
      lat: location.lat,
      lng: location.lng
    }
  }
}

module.exports = LocationAPI;
