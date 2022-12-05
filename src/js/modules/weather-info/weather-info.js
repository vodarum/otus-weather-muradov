import { CoordModel } from "../../models/coord";
import { WeatherInfoModel } from "../../models/weather-info";
import Util from "../../util/util";

class WeatherInfo {
  /**
   * Сохранить информацию о погоде в Local Storage
   * @param {WeatherInfoModel} weatherInfo Информация о погоде
   */
  saveWeatherInfo(weatherInfo) {
    const weatherHistory = JSON.parse(
      localStorage.getItem("weatherHistory") ?? "[]"
    );
    const filteredWeatherHistory = weatherHistory.filter(
      (wI) => wI.city !== weatherInfo.city
    );

    filteredWeatherHistory.unshift(weatherInfo);

    localStorage.setItem(
      "weatherHistory",
      JSON.stringify(filteredWeatherHistory.slice(0, 10))
    );
  }

  /**
   * Проверить корректность координат
   * @param {CoordModel} coord Координаты
   */
  validateCoord(coord) {
    /**
     * Проверить корректность широты
     * @param {number} latitude Широта
     */
    function _validateLatitude(latitude) {
      return Util.isDefined(latitude) && +latitude <= 90 && +latitude >= -90;
    }

    /**
     * Проверить корректность долготы
     * @param {number} longitude Долгота
     */
    function _validateLongitude(longitude) {
      return (
        Util.isDefined(longitude) && +longitude <= 180 && +longitude >= -180
      );
    }

    return (
      coord instanceof CoordModel &&
      _validateLatitude(coord.latitude) &&
      _validateLongitude(coord.longitude)
    );
  }

  /**
   * Проверить корректность информации о погоде
   * @param {WeatherInfoModel} weatherInfo Информация о погоде
   */
  validateWeatherInfo(weatherInfo) {
    return (
      weatherInfo instanceof WeatherInfoModel &&
      Util.isDefined(weatherInfo.city) &&
      Util.isDefined(weatherInfo.temp) &&
      typeof weatherInfo.temp === "number" &&
      this.validateCoord(weatherInfo.coord)
    );
  }
}

export default new WeatherInfo();
