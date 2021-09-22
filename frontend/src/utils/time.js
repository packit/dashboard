/*
 * Get a pretty string like 'an hour ago', 'yesterday', '3 months ago',
 * 'just now'.
 * https://stackoverflow.com/questions/1551382/user-friendly-time-format-in-python
 */
const prettyTime = (time) => {
    if (time === null) {
        return null;
    }

    // Convert UNIX timestamp into date object, Date gets passed **milliseconds**
    // since Epoch.
    time = new Date(1000 * time);

    let now = Date.now();
    let diff = Math.floor((now - time) / 1000);

    let secondDiff = diff % 60;
    let dayDiff = Math.floor(diff / (60 * 60 * 24));

    if (dayDiff == 0) {
        if (secondDiff < 10) {
            return "just now";
        } else if (secondDiff < 60) {
            return secondDiff + " seconds ago";
        } else if (secondDiff < 120) {
            return "a minute ago";
        } else if (secondDiff < 3600) {
            return secondDiff / 60 + " minutes ago";
        } else if (secondDiff < 7200) {
            return "an hour ago";
        }
        return secondDiff / 3600 + " hours ago";
    }

    if (dayDiff == 1) {
        return "yesterday";
    } else if (dayDiff < 7) {
        return dayDiff + " days ago";
    } else if (dayDiff < 31) {
        return dayDiff / 7 + " weeks ago";
    } else if (dayDiff < 365) {
        return dayDiff / 30 + " months ago";
    }
    return dayDiff / 365 + " years ago";
};

export { prettyTime };
