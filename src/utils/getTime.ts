function getTime(dateObj: Date) {
  const hours = dateObj.getHours();
  const minutes =
    dateObj.getUTCMinutes() < 10
      ? "0" + dateObj.getUTCMinutes()
      : dateObj.getUTCMinutes();

  return hours + ":" + minutes
}
export default getTime;
