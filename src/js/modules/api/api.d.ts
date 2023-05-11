import { LocationInfoModel } from "../../models/location-info";
import { WeatherInfoModel } from "../../models/weather-info";

export declare class API {
  LOCATION_URL: string;
  WEATHER_URL: string;
  WEATHER_API_KEY: string;

  getCurrentLocationInfo(): Promise<LocationInfoModel>;
  getWeatherInfoByLocationCoord(
    latitude: number,
    longitude: number
  ): Promise<WeatherInfoModel>;
  getWeatherInfoByLocationName(locationName: string): Promise<WeatherInfoModel>;
}

declare const _default: API;
export default _default;
