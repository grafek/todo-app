function getDate(dateObj: Date) {
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();

  return day + "-" + month + "-" + year;
}
export default getDate;
