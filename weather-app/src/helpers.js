export const dateBuilder = (d) => {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let monthIndex = months.indexOf(months[d.getMonth()]) + 1;
  let year = d.getFullYear();

  let dateTimeAttr = `${year}-${monthIndex}-${date}`;
  let dateText = `${day} ${date} ${month} ${year}`;

  return [dateTimeAttr, dateText];
}