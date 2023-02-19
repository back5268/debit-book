module.exports = {
    dateTimeHelper: function (time) {
        let date = new Date(time);
        let day = date.getDate();
        day = day < 10 ? '0' + day : day; 
        let month = date.getMonth() + 1;
        month = month < 10 ? '0' + month : month; 
        let year = date.getFullYear();
        let hours = date.getHours();
        hours = hours < 10 ? '0' + hours : hours; 
        let minutes = date.getMinutes();
        minutes = minutes < 10 ? '0' + minutes : minutes; 
        let seconds = date.getSeconds();
        seconds = seconds < 10 ? '0' + seconds : seconds; 
        
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }
}