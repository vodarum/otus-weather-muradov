import { WeatherInfoModel } from "../../models/weather-info";

export declare class Main {
  init(): void;
  saveStateAndRefresh(weatherInfo: WeatherInfoModel): Promise<void>;
  selectItemFromWeatherHistory(id: string): Promise<void>;
  search(): Promise<void>;
}

declare const _default: Main;
export default _default;
