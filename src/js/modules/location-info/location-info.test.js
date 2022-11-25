import * as testData from "../../__test__/test-data.json";
import { LocationInfoModel } from "../../models/location-info";
import LocationInfo from "./location-info";

describe("Location", () => {
  describe("getCurrentLocationInfo", () => {
    // 1) Проверяем, является ли Location.getCurrentLocationInfo экземпляром класса Function
    test("is a function", () => {
      expect(LocationInfo.getCurrentLocationInfo).toBeInstanceOf(Function);
    });

    // 2) Проверяем выполнение fetch
    describe("fetch", () => {
      const spyError = jest.spyOn(console, "error").mockReturnValue();

      beforeEach(() => {
        jest.clearAllMocks();
      });

      // 2.1) fetch возвращает ответ с успешным статусом
      test("resolved with HTTP successful responses", async () => {
        fetch.mockResponseOnce(JSON.stringify(testData.geoInfo));

        const result = await LocationInfo.getCurrentLocationInfo();

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(LocationInfo.LOCATION_URL);

        expect(spyError).toHaveBeenCalledTimes(0);

        expect(result).toBeInstanceOf(LocationInfoModel);
      });

      // 2.2) fetch возвращает ответ с неуспешным статусом
      test("resolved with HTTP unsuccessful responses", async () => {
        const unsuccessfulResponseStatus = 404; // For example, 404

        fetch.mockResponseOnce(JSON.stringify(testData.geoInfo), {
          status: unsuccessfulResponseStatus,
        });

        const result = await LocationInfo.getCurrentLocationInfo();

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(LocationInfo.LOCATION_URL);

        expect(spyError).toHaveBeenCalledTimes(1);
        expect(spyError).toHaveBeenCalledWith(
          `Error in Location.getCurrentLocationInfo: HTTP response status ${unsuccessfulResponseStatus}`
        );

        expect(result).toBeInstanceOf(LocationInfoModel);
      });

      // 2.3) fetch завершается некоторой ошибкой
      test("rejected", async () => {
        const errorMessage = "Error in fetch";

        fetch.mockRejectOnce(new Error(errorMessage));

        const result = await LocationInfo.getCurrentLocationInfo();

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(LocationInfo.LOCATION_URL);

        expect(spyError).toHaveBeenCalledTimes(1);
        expect(spyError).toHaveBeenCalledWith(
          `Error in Location.getCurrentLocationInfo: ${errorMessage}`
        );

        expect(result).toBeInstanceOf(LocationInfoModel);
      });
    });
  });
});
