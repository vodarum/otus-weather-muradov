import { CoordModel } from "./coord";

export class WeatherInfoModel {
  city = null;

  temp = null;

  icon = null;

  coord = new CoordModel();

  constructor(weatherInfo) {
    this.city = weatherInfo?.name ?? null;
    this.temp = weatherInfo?.main.temp ?? null;
    this.icon = weatherInfo?.weather[0].icon ?? null;
    this.coord = new CoordModel(
      weatherInfo?.coord.lat ?? null,
      weatherInfo?.coord.lon ?? null
    );
  }
}
