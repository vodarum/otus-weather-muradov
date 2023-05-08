type GeoInfoType = {
  region: string;
  latitude: string;
  longitude: string;
  accuracy: number;
  country_code: string;
  timezone: string;
  asn: number;
  organization: string;
  area_code: string;
  country: string;
  city: string;
  organization_name: string;
  ip: string;
  country_code3: string;
  continent_code: string;
};

type WeatherInfoType = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    }
  ];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

export { GeoInfoType, WeatherInfoType };
