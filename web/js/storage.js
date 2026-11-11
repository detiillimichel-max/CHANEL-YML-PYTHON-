const KEY="chanel-yml-python:favorites:v1";
export function getFavorites(){try{return new Set(JSON.parse(localStorage.getItem(KEY)||"[]"));}catch{return new Set();}}
export function toggleFavorite(id){const s=getFavorites();s.has(id)?s.delete(id):s.add(id);localStorage.setItem(KEY,JSON.stringify([...s]));return s.has(id);}
