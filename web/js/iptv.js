import {filterRecords} from "./search.js";
export function getIptvRecords(catalog,query){return filterRecords(catalog?.items||[],query);}
