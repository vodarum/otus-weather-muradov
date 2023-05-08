import { CoordModel } from "./coord";
import { WeatherInfoType } from "../types/types";

export class WeatherInfoModel {
  city: string = null;

  temp: number = null;

  icon: string = null;

  coord: CoordModel = new CoordModel();

  constructor(weatherInfo?: WeatherInfoType) {
    this.city = weatherInfo?.name ?? null;
    this.temp = weatherInfo?.main.temp ?? null;
    this.icon = weatherInfo?.weather[0].icon ?? null;
    this.coord = new CoordModel(
      weatherInfo?.coord.lat ?? null,
      weatherInfo?.coord.lon ?? null
    );
  }
}
