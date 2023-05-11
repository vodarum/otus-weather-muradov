import { CoordModel } from "./coord";
import { OpenWeatherInfoType, WeatherInfoType } from "../types/types";

export class WeatherInfoModel implements WeatherInfoType {
  city?: string;

  temp?: number;

  icon?: string;

  coord?: CoordModel;

  constructor(weatherInfo?: OpenWeatherInfoType) {
    this.city = weatherInfo?.name;
    this.temp = weatherInfo?.main.temp;
    this.icon = weatherInfo?.weather[0].icon;
    this.coord = weatherInfo
      ? new CoordModel(weatherInfo.coord.lat, weatherInfo.coord.lon)
      : new CoordModel();
  }
}
