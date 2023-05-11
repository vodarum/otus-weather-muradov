import { CoordModel } from "../../models/coord";
import { WeatherInfoModel } from "../../models/weather-info";

export declare class WeatherInfo {
  saveWeatherInfo(weatherInfo: WeatherInfoModel): void;
  validateCoord(coord: CoordModel): boolean;
  validateWeatherInfo(weatherInfo: WeatherInfoModel): boolean;
}

declare const _default: WeatherInfo;
export default _default;
