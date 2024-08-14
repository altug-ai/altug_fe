export const getTimeData = async () => {
  // Create a new Date object
  let date = new Date();

  // Extract hours, minutes, and seconds
  let hours: any = date.getHours();
  let minutes: any = date.getMinutes();

  // Convert hours to 12-hour format
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)

  // Format hours, minutes, and seconds to ensure they have leading zeros if needed
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  // Construct the time string
  let formattedTime = hours + ':' + minutes + ' ' + ampm;

  return formattedTime;
};
