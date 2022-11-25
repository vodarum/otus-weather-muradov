import { LocationInfoModel } from "../../models/location-info";

class LocationInfo {
  LOCATION_URL = "https://get.geojs.io/v1/ip/geo.json";

  /**
   * Получить геоданные пользователя
   */
  async getCurrentLocationInfo() {
    let result = new LocationInfoModel();

    try {
      const response = await fetch(this.LOCATION_URL);

      if (!response.ok) {
        throw new Error(`HTTP response status ${response.status}`);
      }

      const json = await response.json();

      result = new LocationInfoModel(json);
    } catch (error) {
      console.error(
        `Error in Location.getCurrentLocationInfo: ${error.message}`
      );
    }

    return result;
  }
}

export default new LocationInfo();
