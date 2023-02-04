import Component from "../modules/Component/Component";
import { WeatherInfoModel } from "../models/weather-info";

import WeatherMainComponent from "./weather-main";
import WeatherMapComponent from "./weather-map";
import WeatherHistoryComponent from "./weather-history";

import API from "../modules/api/api";
import WeatherInfo from "../modules/weather-info/weather-info";
import Util from "../util/util";

export default class AppComponent extends Component {
  #weatherMain;

  #weatherMap;

  #weatherHistory;

  constructor(el, initialState = new WeatherInfoModel()) {
    super(el, initialState);

    this.#weatherMain = new WeatherMainComponent(
      document.querySelector("#weather-main")
    );
    this.#weatherMap = new WeatherMapComponent(
      document.querySelector("#weather-map")
    );
    this.#weatherHistory = new WeatherHistoryComponent(
      document.querySelector("#weather-history")
    );

    this.events = {
      "submit@#form": (e) => {
        e?.preventDefault();
        this.search();
      },
      "click@#weather-history": (e) => {
        const weatherHistoryItem = e?.target.closest(".weather-history__item");

        if (weatherHistoryItem) {
          this.selectItemFromWeatherHistory(
            weatherHistoryItem.dataset.whItemId
          );
        }
      },
    };
  }

  onMount() {
    API.getCurrentLocationInfo()
      .then((currentLocationInfo) =>
        API.getWeatherInfoByLocationCoord(
          currentLocationInfo.latitude,
          currentLocationInfo.longitude
        )
      )
      .then((weatherInfo) => this.setState(weatherInfo))
      .catch((error) => console.error(error));
  }

  render() {
    return `<main class="main">
                    <section class="section">
                        <h1 class="title">Weather App</h1>

                        <form class="form" id="form">
                            <input type="text" placeholder="Enter an address or city name" class="input" id="input">

                            <button type="submit" class="btn" id="btn">Enter</button>
                        </form>

                        <div class="weather-info" id="weather-info">
                            <div class="weather-info__item weather-main" id="weather-main"></div>
                            <div class="weather-info__item weather-map" id="weather-map"></div>
                            <div class="weather-info__item weather-history" id="weather-history"></div>
                        </div>
                    </section>
                </main>`;
  }

  /**
   * Сохранить состояние
   * @param {WeatherInfoModel} state
   */
  setState(state) {
    if (WeatherInfo.validateWeatherInfo(state)) {
      WeatherInfo.saveWeatherInfo(state);

      this.state = state;

      this.#weatherMain.setState(this.state);
      this.#weatherMap.setState(this.state.coord);
      this.#weatherHistory.setState(
        localStorage.getItem("weatherHistory")
          ? {
              weatherHistory: JSON.parse(
                localStorage.getItem("weatherHistory")
              ),
            }
          : {}
      );
    }
  }

  /**
   * Выбрать элемент Истории
   * @param {string} id ID записи Истории
   */
  async selectItemFromWeatherHistory(id) {
    if (!Util.isDefined(id)) {
      return;
    }

    const weatherHistory = JSON.parse(
      localStorage.getItem("weatherHistory") ?? "[]"
    );

    const weatherInfoByLocationCoord = await API.getWeatherInfoByLocationCoord(
      weatherHistory[+id].coord.latitude,
      weatherHistory[+id].coord.longitude
    );

    this.setState(weatherInfoByLocationCoord);
  }

  /**
   * Найти информацию о погоде в выбранном населенном пункте
   */
  async search() {
    const input = document.getElementById("input");

    try {
      const weatherInfoByLocationName = await API.getWeatherInfoByLocationName(
        input.value
      );

      this.setState(weatherInfoByLocationName);
    } catch (error) {
      console.error(`Error in AppComponent.search: ${error}`);
    } finally {
      input.value = "";
    }
  }
}
