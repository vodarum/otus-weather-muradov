import { LocationInfoModel } from "../../models/location-info";
import { WeatherInfoModel } from "../../models/weather-info";
import { GeoInfoType, OpenWeatherInfoType } from "../../types/types";

class API {
  LOCATION_URL = "https://get.geojs.io/v1/ip/geo.json";

  WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

  WEATHER_API_KEY = "1cf44d73b10a208539e8d4267c92ac9f";

  /**
   * Получить геоданные пользователя
   */
  async getCurrentLocationInfo(): Promise<LocationInfoModel> {
    let result = new LocationInfoModel();

    try {
      const response = await fetch(this.LOCATION_URL);

      if (!response.ok) {
        throw new Error(`HTTP response status ${response.status}`);
      }

      const json = (await response.json()) as GeoInfoType;

      result = new LocationInfoModel(json);
    } catch (error) {
      console.error(
        `Error in API.getCurrentLocationInfo: ${
          error instanceof Error ? error.message : error
        }`
      );
    }

    return result;
  }

  /**
   * Получить информацию о погоде по географическим координатам
   * @param {*} latitude Широта
   * @param {*} longitude Долгота
   */
  async getWeatherInfoByLocationCoord(
    latitude?: number,
    longitude?: number
  ): Promise<WeatherInfoModel> {
    let result = new WeatherInfoModel();

    try {
      const url = `${this.WEATHER_URL}?lat=${latitude}&lon=${longitude}&appid=${this.WEATHER_API_KEY}&units=metric&lang=ru`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP response status ${response.status}`);
      }

      const json = (await response.json()) as OpenWeatherInfoType;

      result = new WeatherInfoModel(json);
    } catch (error) {
      console.error(
        `Error in API.getWeatherInfoByLocationCoord: ${
          error instanceof Error ? error.message : error
        }`
      );
    }

    return result;
  }

  /**
   * Получить информацию о погоде по названию города
   * @param {*} locationName Название города
   */
  async getWeatherInfoByLocationName(
    locationName: string
  ): Promise<WeatherInfoModel> {
    let result = new WeatherInfoModel();

    if (locationName) {
      try {
        const url = `${this.WEATHER_URL}?q=${locationName}&appid=${this.WEATHER_API_KEY}&units=metric&lang=ru`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP response status ${response.status}`);
        }

        const json = (await response.json()) as OpenWeatherInfoType;

        result = new WeatherInfoModel(json);
      } catch (error) {
        console.error(
          `Error in API.getWeatherInfoByLocationName: ${
            error instanceof Error ? error.message : error
          }`
        );
      }
    }

    return result;
  }
}

export default new API();
