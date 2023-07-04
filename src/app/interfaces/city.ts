export interface City {
    country: string;
    lat: number;
    lon: number;
    local_names: {[key: string]: string};
    name: string;
    state: string;
}
  