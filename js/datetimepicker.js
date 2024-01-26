/**
 * 
 * @param {InputEvent} e
 */
function datepickerChange(e) {
    const day = e.target.value.slice(-2);
    if (day == "") {
        return;
    }
    const hour = timepicker.value.slice(0,2)
    
    datepicker.value = `2022-01-${day}`;
    daterange.value = 24*(Number(day)-1) + Number(hour);
    
    updateMap(new Date(`${datepicker.value} ${timepicker.value}`))
}

/**
 * 
 * @param {InputEvent} e 
 */
function timepickerChange(e) {
    const hour = e.target.value.slice(0,2);
    const day = datepicker.value.slice(-2);

    daterange.value = 24*(Number(day)-1) + Number(hour);

    updateMap(new Date(`${datepicker.value} ${timepicker.value}`))
}

/**
 * 
 * @param {InputEvent} e 
 */
function daterangeChange(e) {
    const day = ~~(e.target.value / 24) + 1;
    const hour = e.target.value % 24;
    
    datepicker.value = `2022-01-${padDynamic(day)}`;
    timepicker.value = `${padDynamic(hour)}:00:00`

    updateMap(new Date(`${datepicker.value} ${timepicker.value}`))
}

/**
 * 
 * @param {Number} x 
 * @returns {String}
 */
function padDynamic(x) {
    let result = String(x);
    if (x < 10) {
        result = "0" + result;
    }
    
    return result;
}

/**
 * 
 * @param {Date} datetime 
 */
function setDateTime(datetime) {
    const day = datetime.getDate();
    const hour = datetime.getHours();

    datepicker.value = `2022-01-${padDynamic(day)}`;
    timepicker.value = `${padDynamic(hour)}:00:00`
    daterange.value = 24*(Number(day)-1) + Number(hour);
    
    updateMap(datetime);
}