import {filterRecords} from "./search.js";
export function getDriveRecords(catalog,query){return filterRecords(catalog?.items||[],query);}
