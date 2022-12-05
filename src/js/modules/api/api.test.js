import * as testData from "../../__test__/test-data.json";
import { LocationInfoModel } from "../../models/location-info";
import { WeatherInfoModel } from "../../models/weather-info";
import API from "./api";

describe("API", () => {
  const spyError = jest.spyOn(console, "error").mockReturnValue();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1) Функция getCurrentLocationInfo
  describe("getCurrentLocationInfo", () => {
    // 1.1) Проверяем, является ли API.getCurrentLocationInfo экземпляром класса Function
    test("is a function", () => {
      expect(API.getCurrentLocationInfo).toBeInstanceOf(Function);
    });

    describe("fetch", () => {
      // 1.2) Проверяем случай, когда fetch возвращает ответ с успешным статусом
      test("resolved with HTTP successful responses", async () => {
        fetch.mockResponseOnce(JSON.stringify(testData.geoInfo));

        const result = await API.getCurrentLocationInfo();

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(API.LOCATION_URL);

        expect(spyError).toHaveBeenCalledTimes(0);

        expect(result).toBeInstanceOf(LocationInfoModel);
      });

      // 1.3) Проверяем случай, когда fetch возвращает ответ с неуспешным статусом
      test("resolved with HTTP unsuccessful responses", async () => {
        const unsuccessfulResponseStatus = 404; // For example, 404

        fetch.mockResponseOnce(JSON.stringify(testData.geoInfo), {
          status: unsuccessfulResponseStatus,
        });

        const result = await API.getCurrentLocationInfo();

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(API.LOCATION_URL);

        expect(spyError).toHaveBeenCalledTimes(1);
        expect(spyError).toHaveBeenCalledWith(
          `Error in API.getCurrentLocationInfo: HTTP response status ${unsuccessfulResponseStatus}`
        );

        expect(result).toBeInstanceOf(LocationInfoModel);
      });

      // 1.4) Проверяем случай, когда fetch завершается некоторой ошибкой
      test("rejected", async () => {
        const errorMessage = "Error in fetch";

        fetch.mockRejectOnce(new Error(errorMessage));

        const result = await API.getCurrentLocationInfo();

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(API.LOCATION_URL);

        expect(spyError).toHaveBeenCalledTimes(1);
        expect(spyError).toHaveBeenCalledWith(
          `Error in API.getCurrentLocationInfo: ${errorMessage}`
        );

        expect(result).toBeInstanceOf(LocationInfoModel);
      });
    });
  });

  // 2) Функция getWeatherInfoByLocationCoord
  describe("getWeatherInfoByLocationCoord", () => {
    // 2.1) Проверяем, является ли API.getWeatherInfoByLocationCoord экземпляром класса Function
    test("is a function", () => {
      expect(API.getWeatherInfoByLocationCoord).toBeInstanceOf(Function);
    });

    describe.each(testData.openWeatherResponse)("fetch", (x) => {
      // 2.2) Проверяем случай, когда fetch возвращает ответ с успешным статусом
      test("resolved with HTTP successful responses", async () => {
        fetch.mockResponseOnce(JSON.stringify(x));

        const result = await API.getWeatherInfoByLocationCoord(
          x.coord.lat,
          x.coord.lon
        );

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
          `${API.WEATHER_URL}?lat=${x.coord.lat}&lon=${x.coord.lon}&appid=${API.WEATHER_API_KEY}&units=metric&lang=ru`
        );

        expect(spyError).toHaveBeenCalledTimes(0);

        expect(result).toBeInstanceOf(WeatherInfoModel);
      });

      // 2.3) Проверяем случай, когда fetch возвращает ответ с неуспешным статусом
      test("resolved with HTTP unsuccessful responses", async () => {
        const unsuccessfulResponseStatus = 404; // For example, 404

        fetch.mockResponseOnce(JSON.stringify(x), {
          status: unsuccessfulResponseStatus,
        });

        const result = await API.getWeatherInfoByLocationCoord(
          x.coord.lat,
          x.coord.lon
        );

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
          `${API.WEATHER_URL}?lat=${x.coord.lat}&lon=${x.coord.lon}&appid=${API.WEATHER_API_KEY}&units=metric&lang=ru`
        );

        expect(spyError).toHaveBeenCalledTimes(1);
        expect(spyError).toHaveBeenCalledWith(
          `Error in API.getWeatherInfoByLocationCoord: HTTP response status ${unsuccessfulResponseStatus}`
        );

        expect(result).toBeInstanceOf(WeatherInfoModel);
      });

      // 2.4) Проверяем случай, когда fetch завершается некоторой ошибкой
      test("rejected", async () => {
        const errorMessage = "Error in fetch";

        fetch.mockRejectOnce(new Error(errorMessage));

        const result = await API.getWeatherInfoByLocationCoord(
          x.coord.lat,
          x.coord.lon
        );

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
          `${API.WEATHER_URL}?lat=${x.coord.lat}&lon=${x.coord.lon}&appid=${API.WEATHER_API_KEY}&units=metric&lang=ru`
        );

        expect(spyError).toHaveBeenCalledTimes(1);
        expect(spyError).toHaveBeenCalledWith(
          `Error in API.getWeatherInfoByLocationCoord: ${errorMessage}`
        );

        expect(result).toBeInstanceOf(WeatherInfoModel);
      });
    });
  });

  // 3) Функция getWeatherInfoByLocationName
  describe("getWeatherInfoByLocationName", () => {
    // 3.1) Проверяем, является ли API.getWeatherInfoByLocationName экземпляром класса Function
    test("is a function", () => {
      expect(API.getWeatherInfoByLocationName).toBeInstanceOf(Function);
    });

    // 3.2) Проверяем случай, когда в качестве аргумента locationName передана пустая строка
    test("argument 'locationName' is empty", async () => {
      const result = await API.getWeatherInfoByLocationName("");

      expect(fetch).toHaveBeenCalledTimes(0);
      expect(result).toBeInstanceOf(WeatherInfoModel);
    });

    describe.each(testData.openWeatherResponse)("fetch", (x) => {
      // 3.3) Проверяем случай, когда fetch возвращает ответ с успешным статусом
      test("resolved with HTTP successful responses", async () => {
        fetch.mockResponseOnce(JSON.stringify(x));

        const result = await API.getWeatherInfoByLocationName(x.name);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
          `${API.WEATHER_URL}?q=${x.name}&appid=${API.WEATHER_API_KEY}&units=metric&lang=ru`
        );

        expect(spyError).toHaveBeenCalledTimes(0);

        expect(result).toBeInstanceOf(WeatherInfoModel);
      });

      // 3.4) Проверяем случай, когда fetch возвращает ответ с неуспешным статусом
      test("resolved with HTTP unsuccessful responses", async () => {
        const unsuccessfulResponseStatus = 404; // For example, 404

        fetch.mockResponseOnce(JSON.stringify(x), {
          status: unsuccessfulResponseStatus,
        });

        const result = await API.getWeatherInfoByLocationName(x.name);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
          `${API.WEATHER_URL}?q=${x.name}&appid=${API.WEATHER_API_KEY}&units=metric&lang=ru`
        );

        expect(spyError).toHaveBeenCalledTimes(1);
        expect(spyError).toHaveBeenCalledWith(
          `Error in API.getWeatherInfoByLocationName: HTTP response status ${unsuccessfulResponseStatus}`
        );

        expect(result).toBeInstanceOf(WeatherInfoModel);
      });

      // 3.5) Проверяем случай, когда fetch завершается некоторой ошибкой
      test("rejected", async () => {
        const errorMessage = "Error in fetch";

        fetch.mockRejectOnce(new Error(errorMessage));

        const result = await API.getWeatherInfoByLocationName(x.name);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
          `${API.WEATHER_URL}?q=${x.name}&appid=${API.WEATHER_API_KEY}&units=metric&lang=ru`
        );

        expect(spyError).toHaveBeenCalledTimes(1);
        expect(spyError).toHaveBeenCalledWith(
          `Error in API.getWeatherInfoByLocationName: ${errorMessage}`
        );

        expect(result).toBeInstanceOf(WeatherInfoModel);
      });
    });
  });
});
