export interface WeatherForecast {
  timeSeries: TimeSeries[];
  location: Location;
}

export interface TimeSeries {
  timeDefines: string[];
  areas: Area[];
}

export interface Area {
  area: {
    name: string;
    code: string;
  };
  weatherCodes?: string[];
  weathers?: string[];
  winds?: string[];
  waves?: string[];
  pops?: string[];
  temps?: string[];
  tempsMin?: string[];
  tempsMax?: string[];
}

export interface AreaInfo {
  name: string;
  code: string;
}

export interface Location {
  area: {
    name: string;
    code: string;
  };
  city: {
    name: string;
    code: string;
  };
}

export interface OverviewForecast {
  publishingOffice: string;
  title: string;
  headlineText: string;
  text: string;
  forecastArea: {
    area: {
      name: string;
      code: string;
    };
  };
}

export interface DailyForecast {
  date: string;
  dateLabel: string;
  weather: string;
  weatherCode: string;
  wind: string;
  wave: string;
  pop: string;
  tempMin: string;
  tempMax: string;
}
