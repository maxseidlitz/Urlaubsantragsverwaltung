const ics = require("ics");

const generateICS = (row) => {
  const reason = row.reason === "-" ? "" : row.reason;
  const syear = row.start_date.getFullYear();
  const smonth = row.start_date.getMonth() + 1; // bc it counts from 0 to 11
  const sday = row.start_date.getDate();
  const eyear = row.end_date.getFullYear();
  const emonth = row.end_date.getMonth() + 1; // bc it counts from 0 to 11
  const eday = row.end_date.getDate() + 1; // bc of ics
  const ev = {
    start: [syear, smonth, sday], // TODO -> To create an all-day event, pass only three values (year, month, and date) to the start and end properties.
    end: [eyear, emonth, eday], // TODO -> The date of the end property should be the day after your all-day event.
    title: row.vacation_type,
    description: reason,
    categories: ["urlaub"],
    status: "CONFIRMED",
    busyStatus: "OOF",
    transp: "OPAQUE",
    classification: "PUBLIC",
    organizer: { name: row.username, email: row.email },
  };

  var icsObj;

  ics.createEvent(ev, (error, icsFile) => {
    if (error) {
      console.log(error);
      return;
    } else {
      icsObj = icsFile;
    }
  });

  return icsObj;
};

module.exports = generateICS;
