import { CoordModel } from "./coord";
import { WeatherInfoType } from "../types/types";

export declare class WeatherInfoModel {
  city: string;
  temp: number;
  icon: string;
  coord: CoordModel;
  constructor(weatherInfo: WeatherInfoType);
}
