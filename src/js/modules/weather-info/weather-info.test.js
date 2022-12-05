import * as testData from "../../__test__/test-data.json";
import { CoordModel } from "../../models/coord";
import { WeatherInfoModel } from "../../models/weather-info";
import Util from "../../util/util";
import WeatherInfo from "./weather-info";

describe.only("WeatherInfo", () => {
  // 1) Функция saveWeatherInfo
  describe("saveWeatherInfo", () => {
    /**
     * Установить localStorage для тестов
     * @param {*} value Значение для weatherHistory
     */
    function setLocalStorageForWeatherHistory(value) {
      if (Util.isDefined(value)) {
        localStorage.setItem("weatherHistory", JSON.stringify(value));
      }
    }

    // Элемент для добавления в weatherHistory
    const weatherInfoForAdding = {
      city: "Москва",
      temp: 0.52,
      icon: "04d",
      coord: new CoordModel(55.7504, 37.6175),
    };

    afterEach(() => {
      localStorage.removeItem("weatherHistory");
    });

    // 1.1) Проверяем, является ли WeatherInfo.saveWeatherInfo экземпляром класса Function
    test("is a function", () => {
      expect(WeatherInfo.saveWeatherInfo).toBeInstanceOf(Function);
    });

    // 1.2) Проверяем корректность сохранения записей
    describe("correct saving", () => {
      // 1.2.1) Если в localStorage содержит Историю
      describe("if localStorage is full", () => {
        let lastIndex;
        let firstItemInWeatherHistory;
        let preLastItemInWeatherHistory;
        let lastItemInWeatherHistory;

        beforeEach(() => {
          lastIndex = testData.weatherInfoArray.length - 1;
          firstItemInWeatherHistory = testData.weatherInfoArray[0];
          preLastItemInWeatherHistory =
            testData.weatherInfoArray[lastIndex - 1];
          lastItemInWeatherHistory = testData.weatherInfoArray[lastIndex];

          setLocalStorageForWeatherHistory(testData.weatherInfoArray); // testData.weatherHistory.length = 10
        });

        // 1.2.1 - 1) Проверяем соблюдение требования о сохранении в Истории не более 10 записей
        test("no more than 10 items saved", () => {
          // Выполним несколько раз сохранение (добавление) информации о погоде в Историю
          WeatherInfo.saveWeatherInfo(weatherInfoForAdding); // Сохраняем новый элемент
          WeatherInfo.saveWeatherInfo(preLastItemInWeatherHistory); // Сохраняем клон предпоследнего элемента
          WeatherInfo.saveWeatherInfo(lastItemInWeatherHistory); // Сохраняем клон последнего элемента

          const weatherHistory = JSON.parse(
            localStorage.getItem("weatherHistory")
          );

          expect(weatherHistory.length).toBeLessThanOrEqual(
            testData.weatherInfoArray.length
          );
        });

        // 1.2.1 - 2) Проверяем соблюдение правильной последовательности записей при сохранении Истории
        describe("correct order", () => {
          // 1.2.1 - 2.1) Если добавляемого элемента еще не было в Истории
          test("if a new weatherInfo is added", () => {
            WeatherInfo.saveWeatherInfo(weatherInfoForAdding);

            const weatherHistory = JSON.parse(
              localStorage.getItem("weatherHistory")
            );

            expect(weatherHistory[0]).toEqual(weatherInfoForAdding); // Проверяем, что добавленный элемент стал первым в Истории
            expect(weatherHistory[1]).toEqual(firstItemInWeatherHistory); // Проверяем, что бывший первым элемент стал вторым в Истории
            expect(weatherHistory[lastIndex]).toEqual(
              preLastItemInWeatherHistory
            ); // Проверяем, что бывший предпоследним элемент стал последним в Истории
            expect(
              weatherHistory.find(
                (x) => x.city === lastItemInWeatherHistory.city
              )
            ).toBeUndefined(); // Проверяем, что бывший последним элемент отсутствует в Истории
          });

          // 1.2.1 - 2.2) Если в качестве добавляемого элемента используется элемент, бывший предпоследним в Истории
          test("if the prelast element of weatherHistory was used to add", () => {
            WeatherInfo.saveWeatherInfo(preLastItemInWeatherHistory);

            const weatherHistory = JSON.parse(
              localStorage.getItem("weatherHistory")
            );

            expect(weatherHistory[0]).toEqual(preLastItemInWeatherHistory); // Проверяем, что добавленный элемент (бывший предпоследним) стал первым в Истории
            expect(weatherHistory[1]).toEqual(firstItemInWeatherHistory); // Проверяем, что бывший первым элемент стал вторым в Истории
            expect(weatherHistory[lastIndex]).toEqual(lastItemInWeatherHistory); // Проверяем, что последний элемент остался на своем месте в Истории
          });

          // 1.2.1 - 2.3) Если в качестве добавляемого элемента используется элемент, бывший последним в Истории
          test("if the last element of weatherHistory was used to add", () => {
            WeatherInfo.saveWeatherInfo(lastItemInWeatherHistory);

            const weatherHistory = JSON.parse(
              localStorage.getItem("weatherHistory")
            );

            expect(weatherHistory[0]).toEqual(lastItemInWeatherHistory); // Проверяем, что добавленный элемент (бывший последним) стал первым в Истории
            expect(weatherHistory[1]).toEqual(firstItemInWeatherHistory); // Проверяем, что бывший первым элемент стал вторым в Истории
            expect(weatherHistory[lastIndex]).toEqual(
              preLastItemInWeatherHistory
            ); // Проверяем, что бывший предпоследним элемент стал последним в Истории
          });
        });

        // 1.2.1 - 3) Проверяем соблюдение требования о недопустимости дублирования записей в Истории
        test("weatherHistory does not contain duplicate elements", () => {
          WeatherInfo.saveWeatherInfo(lastItemInWeatherHistory); // Сохраняем клон последнего элемента
          WeatherInfo.saveWeatherInfo(preLastItemInWeatherHistory); // Сохраняем клон предпоследнего элемента
          WeatherInfo.saveWeatherInfo(lastItemInWeatherHistory); // Еще раз сохраняем клон последнего элемента

          const weatherHistory = JSON.parse(
            localStorage.getItem("weatherHistory")
          );

          expect(
            weatherHistory.filter(
              (x) => x.city === preLastItemInWeatherHistory.city
            ).length
          ).toBe(1);
          expect(
            weatherHistory.filter(
              (x) => x.city === lastItemInWeatherHistory.city
            ).length
          ).toBe(1);
        });
      });

      // 1.2.2) Если в localStorage пустой
      describe("if localStorage is empty", () => {
        test("", () => {
          setLocalStorageForWeatherHistory();

          WeatherInfo.saveWeatherInfo(weatherInfoForAdding);

          const weatherHistory = JSON.parse(
            localStorage.getItem("weatherHistory")
          );

          expect(weatherHistory[0]).toEqual(weatherInfoForAdding);
          expect(weatherHistory.length).toBe(1);
        });
      });
    });
  });

  // 2) Функция validateCoord
  describe("validateCoord", () => {
    // 2.1) Проверяем, является ли WeatherInfo.validateCoord экземпляром класса Function
    test("is a function", () => {
      expect(WeatherInfo.validateCoord).toBeInstanceOf(Function);
    });

    // 2.2) Проверяем корректность выполнения валидации координат
    describe.each([
      {
        coord: new CoordModel(55.7504, 37.6175),
        result: true,
      },
      {
        // coord must be instance of CoordModel
        coord: {
          latitude: 55.7504,
          longitude: 37.6175,
        },
        result: false,
      },
      {
        coord: new CoordModel(),
        result: false,
      },
      {
        coord: new CoordModel(90, -180),
        result: true,
      },
      {
        coord: new CoordModel(-90, 180),
        result: true,
      },
      {
        // latitude must be at least -90 and greater than 90
        coord: new CoordModel(91.2315, 54.3467),
        result: false,
      },
      {
        // longitude must be at least -180 and greater than 180
        coord: new CoordModel(75.4595, -180.0001),
        result: false,
      },
    ])("executed correctly", ({ coord, result }) => {
      test(`returns "${result}" for coord (instance of ${
        coord instanceof CoordModel ? "CoordModel" : "Object"
      }): "${JSON.stringify(coord)}"`, () => {
        expect(WeatherInfo.validateCoord(coord)).toBe(result);
      });
    });
  });

  // 3) Функция validateWeatherInfo
  describe("validateWeatherInfo", () => {
    // 3.1) Проверяем, является ли WeatherInfo.validateWeatherInfo экземпляром класса Function
    test("is a function", () => {
      expect(WeatherInfo.validateWeatherInfo).toBeInstanceOf(Function);
    });

    // 3.2) Проверяем корректность выполнения валидации информации о погоде
    describe.each([
      {
        translationToWeatherInfoModel: true,
        weatherInfo: {
          city: "Москва",
          temp: 0.52,
          icon: "04d",
          coord: new CoordModel(55.7504, 37.6175),
        },
        result: true,
      },
      {
        translationToWeatherInfoModel: true,
        weatherInfo: {
          city: "Минск",
          temp: null,
          icon: "04n",
          coord: new CoordModel(53.9025, 27.5618),
        },
        result: false,
      },
      {
        translationToWeatherInfoModel: true,
        weatherInfo: {
          city: "Ейск",
          temp: 9.55,
          icon: null,
          coord: new CoordModel(46.7112, 38.2748),
        },
        result: true,
      },
      {
        // coord must be instance of WeatherInfoModel
        translationToWeatherInfoModel: false,
        weatherInfo: {
          city: "Якутск",
          temp: -32.01,
          icon: "01n",
          coord: new CoordModel(62.0274, 129.732),
        },
        result: false,
      },
      {
        translationToWeatherInfoModel: true,
        weatherInfo: {
          city: undefined,
          temp: 9.55,
          icon: null,
          coord: new CoordModel(46.7112, 38.2748),
        },
        result: false,
      },
      {
        // properties must not be null
        translationToWeatherInfoModel: true,
        weatherInfo: {},
        result: false,
      },
    ])(
      "executed correctly",
      ({ translationToWeatherInfoModel, weatherInfo, result }) => {
        const newWeatherInfo = translationToWeatherInfoModel
          ? Object.assign(new WeatherInfoModel(), weatherInfo)
          : weatherInfo;

        test(`returns "${result}" for weatherInfo (instance of ${
          newWeatherInfo instanceof WeatherInfoModel
            ? "WeatherInfoModel"
            : "Object"
        }): "${JSON.stringify(newWeatherInfo)}"`, () => {
          expect(WeatherInfo.validateWeatherInfo(newWeatherInfo)).toBe(result);
        });
      }
    );
  });
});
