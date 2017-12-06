function getDaysByDate(date, num) {
  let dd = new Date(date);
  let dayArr = [dealDate(dd)];
  num = num ? (num - 1) : 29;

  for (let i = 0; i < num; i++) {
    dd.setDate(dd.getDate() - 1);
    dayArr.unshift(dealDate(dd));
  }

  return dayArr;
}

function getMonthsByDate(date, num) {
  let dd = new Date(date);
  let monthArr = [dealMonth(dd)];
  num = num ? (num - 1) : 11;

  for (let i = 0; i < num; i++) {
    dd.setMonth(dd.getMonth() - 1);
    monthArr.unshift(dealMonth(dd));
  }

  return monthArr;
}

function getDateDiff(date1, date2) {
  let ms1 = new Date(date1);
  let ms2 = new Date(date2);
  let days = parseInt(Math.abs(ms1 - ms2) / 1000 / 60 / 60 / 24);

  return days;
}

function getDaysInMonth(year, month){
  return new Date(year, month, 0).getDate();
}

function dealDate(date) {
  return date.getFullYear() + '-' + addZero(date.getMonth() + 1) + '-' + addZero(date.getDate());
}

function dealMonth(date) {
  return date.getFullYear() + '-' + addZero(date.getMonth() + 1);
}

function addZero(num) {
  return num < 10 ? '0' + num : num;
}