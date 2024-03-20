// this will store date with YYYY-MM-DD format
export function storageDate(date: Date): string {
  let formatedDate = date.getFullYear() + "-";
  if (date.getMonth() + 1 < 10) {
    formatedDate += "0";
  }
  formatedDate += date.getMonth() + 1 + "-";
  if (date.getDate() < 10) {
    formatedDate += "0";
  }
  formatedDate += date.getDate();
  return formatedDate;
}

// could obsiously be done via moment or the new libraries of the browser
export function frenchMonth(index: number) {
  return [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ][index];
}
