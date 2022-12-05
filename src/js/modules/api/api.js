import { LocationInfoModel } from "../../models/location-info";
import { WeatherInfoModel } from "../../models/weather-info";

class API {
  LOCATION_URL = "https://get.geojs.io/v1/ip/geo.json";

  WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

  WEATHER_API_KEY = "1cf44d73b10a208539e8d4267c92ac9f";

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
      console.error(`Error in API.getCurrentLocationInfo: ${error.message}`);
    }

    return result;
  }

  /**
   * Получить информацию о погоде по географическим координатам
   * @param {*} latitude Широта
   * @param {*} longitude Долгота
   */
  async getWeatherInfoByLocationCoord(latitude, longitude) {
    let result = new WeatherInfoModel();

    try {
      const url = `${this.WEATHER_URL}?lat=${latitude}&lon=${longitude}&appid=${this.WEATHER_API_KEY}&units=metric&lang=ru`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP response status ${response.status}`);
      }

      const json = await response.json();

      result = new WeatherInfoModel(json);
    } catch (error) {
      console.error(
        `Error in API.getWeatherInfoByLocationCoord: ${error.message}`
      );
    }

    return result;
  }

  /**
   * Получить информацию о погоде по названию города
   * @param {*} locationName Название города
   */
  async getWeatherInfoByLocationName(locationName) {
    let result = new WeatherInfoModel();

    if (locationName) {
      try {
        const url = `${this.WEATHER_URL}?q=${locationName}&appid=${this.WEATHER_API_KEY}&units=metric&lang=ru`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP response status ${response.status}`);
        }

        const json = await response.json();

        result = new WeatherInfoModel(json);
      } catch (error) {
        console.error(
          `Error in API.getWeatherInfoByLocationName: ${error.message}`
        );
      }
    }

    return result;
  }
}

export default new API();
