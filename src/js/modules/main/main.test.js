import * as testData from "../../__test__/test-data.json";
import { LocationInfoModel } from "../../models/location-info";
import { WeatherInfoModel } from "../../models/weather-info";
import API from "../api/api";
import Main from "./main";
import Markup from "../markup/markup";
import WeatherInfo from "../weather-info/weather-info";
import Util from "../../util/util";

describe("Main", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // 1) Функция init
  describe("init", () => {
    afterAll(() => Markup.removeMarkup());

    // 1.1) Проверяем, является ли Main.init экземпляром класса Function
    test("is a function", () => {
      expect(Main.init).toBeInstanceOf(Function);
    });

    // 1.2) Проверяем выполнение функции
    test("is executed", async () => {
      const spyCreateInitialMarkup = jest.spyOn(Markup, "createInitialMarkup");
      const spyGetCurrentLocationInfo = jest
        .spyOn(API, "getCurrentLocationInfo")
        .mockResolvedValue(new LocationInfoModel(testData.geoInfo));
      const spyGetWeatherInfoByLocationCoord = jest
        .spyOn(API, "getWeatherInfoByLocationCoord")
        .mockResolvedValue(new WeatherInfoModel());
      const spySaveStateAndRefresh = jest
        .spyOn(Main, "saveStateAndRefresh")
        .mockReturnValueOnce();

      Main.init();

      expect(spyCreateInitialMarkup).toHaveBeenCalledTimes(1);
      expect(spyGetCurrentLocationInfo).toHaveBeenCalledTimes(1);

      await spyGetCurrentLocationInfo();
      expect(spyGetWeatherInfoByLocationCoord).toHaveBeenCalledWith(
        testData.geoInfo.latitude,
        testData.geoInfo.longitude
      );

      await spyGetWeatherInfoByLocationCoord();
      expect(spySaveStateAndRefresh).toHaveBeenCalledTimes(1);
    });
  });

  // 2) Функция saveStateAndRefresh
  describe("saveStateAndRefresh", () => {
    // 2.1) Проверяем, является ли Main.saveStateAndRefresh экземпляром класса Function
    test("is a function", () => {
      expect(Main.saveStateAndRefresh).toBeInstanceOf(Function);
    });

    describe.each([true, false])("is executed", (resultOfValidation) => {
      // 2.2) Проверяем выполнение функции
      test(`if result of validation is '${resultOfValidation}'`, () => {
        Main.mainWeatherInfo = new WeatherInfoModel();

        const newWeatherInfo = Object.assign(
          new WeatherInfoModel(),
          testData.weatherInfoArray[0] // For example, first item in 'weatherInfoArray' of testData
        );
        const spyValidateWeatherInfo = jest
          .spyOn(WeatherInfo, "validateWeatherInfo")
          .mockReturnValueOnce(resultOfValidation);
        const spySaveWeatherInfo = jest
          .spyOn(WeatherInfo, "saveWeatherInfo")
          .mockReturnValueOnce();
        const spyAddWeatherInfoOnScreen = jest
          .spyOn(Markup, "addWeatherMainOnScreen")
          .mockReturnValueOnce();
        const spyAddStaticMapOnScreen = jest
          .spyOn(Markup, "addStaticMapOnScreen")
          .mockReturnValueOnce();
        const spyAddWeatherInfoHistoryOnScreen = jest
          .spyOn(Markup, "addWeatherHistoryOnScreen")
          .mockReturnValueOnce();

        expect(Main.mainWeatherInfo).not.toEqual(newWeatherInfo);

        Main.saveStateAndRefresh(newWeatherInfo);

        expect(spyValidateWeatherInfo).toHaveBeenCalledTimes(1);
        expect(spyValidateWeatherInfo).toHaveBeenCalledWith(newWeatherInfo);

        expect(spySaveWeatherInfo).toHaveBeenCalledTimes(+resultOfValidation);
        expect(spyAddWeatherInfoOnScreen).toHaveBeenCalledTimes(
          +resultOfValidation
        );
        expect(spyAddStaticMapOnScreen).toHaveBeenCalledTimes(
          +resultOfValidation
        );
        expect(spyAddWeatherInfoHistoryOnScreen).toHaveBeenCalledTimes(
          +resultOfValidation
        );

        if (resultOfValidation) {
          expect(spySaveWeatherInfo).toHaveBeenCalledWith(Main.mainWeatherInfo);

          expect(Main.mainWeatherInfo).toEqual(newWeatherInfo);

          expect(spyAddWeatherInfoOnScreen).toHaveBeenCalledWith(
            newWeatherInfo
          );
          expect(spyAddStaticMapOnScreen).toHaveBeenCalledWith(
            newWeatherInfo.coord
          );
        }
      });
    });
  });

  // 3) Функция selectItemFromWeatherHistory
  describe("selectItemFromWeatherHistory", () => {
    // 3.1) Проверяем, является ли Main.selectItemFromWeatherHistory экземпляром класса Function
    test("is a function", () => {
      expect(Main.selectItemFromWeatherHistory).toBeInstanceOf(Function);
    });

    describe("is executed", () => {
      beforeAll(() => {
        localStorage.setItem(
          "weatherHistory",
          JSON.stringify(testData.weatherInfoArray)
        );

        Markup.createInitialMarkup();
        Markup.addWeatherHistoryOnScreen();
      });

      afterAll(() => {
        localStorage.clear();
        Markup.removeMarkup();
      });

      [...testData.weatherInfoArray.keys(), undefined, null].forEach(
        (whItemId) => {
          // 3.2) Проверяем выполнение функции
          test(`for data-wh-item-id '${whItemId}'`, async () => {
            const spyGetWeatherInfoByLocationCoord = jest
              .spyOn(API, "getWeatherInfoByLocationCoord")
              .mockResolvedValue(
                Object.assign(
                  new WeatherInfoModel(),
                  testData.weatherInfoArray[whItemId]
                )
              );
            const spySavePrevStateAndRefresh = jest.spyOn(
              Main,
              "saveStateAndRefresh"
            );

            if (Util.isDefined(whItemId)) {
              await Main.selectItemFromWeatherHistory(`${whItemId}`);

              expect(spyGetWeatherInfoByLocationCoord).toHaveBeenCalledTimes(1);
              expect(spyGetWeatherInfoByLocationCoord).toHaveBeenCalledWith(
                testData.weatherInfoArray[whItemId].coord.latitude,
                testData.weatherInfoArray[whItemId].coord.longitude
              );

              expect(spySavePrevStateAndRefresh).toHaveBeenCalledTimes(1);
              expect(spySavePrevStateAndRefresh).toHaveBeenCalledWith(
                await spyGetWeatherInfoByLocationCoord()
              );
            } else {
              await Main.selectItemFromWeatherHistory(whItemId);

              expect(spyGetWeatherInfoByLocationCoord).toHaveBeenCalledTimes(0);
              expect(spySavePrevStateAndRefresh).toHaveBeenCalledTimes(0);
            }
          });
        }
      );
    });
  });

  // 4) Функция search
  describe("search", () => {
    beforeAll(() => {
      Markup.createInitialMarkup();
    });

    afterAll(() => {
      Markup.removeMarkup();
    });

    // 4.1) Проверяем, является ли Main.search экземпляром класса Function
    test("is a function", () => {
      expect(Main.search).toBeInstanceOf(Function);
    });

    let input;
    let spyGetWeatherInfoByLocationName;
    let spySaveStateAndRefresh;
    let spyError;

    describe.each(["", "Москва", "_Москва"])("is executed", (value) => {
      beforeEach(() => {
        input = document.getElementById("input");

        spyGetWeatherInfoByLocationName = jest.spyOn(
          API,
          "getWeatherInfoByLocationName"
        );
        spySaveStateAndRefresh = jest.spyOn(Main, "saveStateAndRefresh");
        spyError = jest.spyOn(console, "error").mockReturnValue();
      });

      // 4.2) Проверяем безошибочное выполнение функции
      test("without an exception", async () => {
        input.value = value;

        spyGetWeatherInfoByLocationName.mockResolvedValueOnce(
          new WeatherInfoModel()
        );
        spySaveStateAndRefresh.mockResolvedValueOnce();

        await Main.search();

        expect(spyGetWeatherInfoByLocationName).toHaveBeenCalledTimes(1);
        expect(spyGetWeatherInfoByLocationName).toHaveBeenCalledWith(value);

        expect(spySaveStateAndRefresh).toHaveBeenCalledTimes(1);
        expect(spySaveStateAndRefresh).toHaveBeenCalledWith(
          await spyGetWeatherInfoByLocationName()
        );

        expect(spyError).toHaveBeenCalledTimes(0);

        expect(input.value).toBe("");
      });

      // 4.3) Проверяем выполнение функции с исключением в API.getWeatherInfoByLocationName
      test("with an exception in 'getWeatherInfoByLocationName'", async () => {
        input.value = value;

        const errorMessage = "Error in API.getWeatherInfoByLocationName";

        spyGetWeatherInfoByLocationName.mockRejectedValueOnce(errorMessage);
        spySaveStateAndRefresh.mockResolvedValueOnce();

        await Main.search();

        expect(spyGetWeatherInfoByLocationName).toHaveBeenCalledTimes(1);
        expect(spyGetWeatherInfoByLocationName).toHaveBeenCalledWith(value);

        expect(spySaveStateAndRefresh).toHaveBeenCalledTimes(0);

        expect(spyError).toHaveBeenCalledTimes(1);
        expect(spyError).toHaveBeenCalledWith(
          `Error in Main.search: ${errorMessage}`
        );

        expect(input.value).toBe("");
      });

      // 4.4) Проверяем выполнение функции с исключением в Main.saveStateAndRefresh
      test("with an exception in 'saveStateAndRefresh'", async () => {
        input.value = value;

        const errorMessage = "Error in Main.saveStateAndRefresh";

        spyGetWeatherInfoByLocationName.mockResolvedValueOnce(
          new WeatherInfoModel()
        );
        spySaveStateAndRefresh.mockRejectedValueOnce(errorMessage);

        await Main.search();

        expect(spyGetWeatherInfoByLocationName).toHaveBeenCalledTimes(1);
        expect(spyGetWeatherInfoByLocationName).toHaveBeenCalledWith(value);

        expect(spySaveStateAndRefresh).toHaveBeenCalledTimes(1);
        expect(spySaveStateAndRefresh).toHaveBeenCalledWith(
          await spyGetWeatherInfoByLocationName()
        );

        expect(spyError).toHaveBeenCalledTimes(1);
        expect(spyError).toHaveBeenCalledWith(
          `Error in Main.search: ${errorMessage}`
        );

        expect(input.value).toBe("");
      });
    });
  });
});
