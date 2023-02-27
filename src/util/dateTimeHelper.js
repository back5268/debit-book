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
    },

    formatMonney: function(num) {
        let numStr = String(Math.abs(num));
        let words = '';
        let x = Math.ceil(numStr.length / 3);

        if (x > 1) {
            let i = 0;
            while(i < x) {
                if (words === '') {
                    words = numStr.slice(-3);
                } else {
                    words = numStr.slice(-3) + ',' + words;
                }
                numStr = numStr.slice(0, -3);
                i += 1;
            }
        } else {
            words = numStr;
        }

        words = words.trim();
        return words;
    }
}