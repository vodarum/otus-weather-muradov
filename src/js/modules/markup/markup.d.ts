import { CoordModel } from "../../models/coord";
import { WeatherInfoModel } from "../../models/weather-info";

export declare class Markup {
  addStaticMapOnScreen(coord: CoordModel): void;
  addWeatherHistoryOnScreen(): void;
  addWeatherMainOnScreen(weatherInfo: WeatherInfoModel): void;
  createInitialMarkup(): void;
  createMarkupElement(
    tagName: string,
    attributes: { [key: string]: string }
  ): HTMLElement;
  removeMarkup(): void;
}

declare const _default: Markup;
export default _default;
