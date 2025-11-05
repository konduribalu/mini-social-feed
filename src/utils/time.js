export function timeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const secondsPast = Math.floor((now - past) / 1000);

    if (secondsPast < 60) {
        return `${secondsPast} seconds ago`;
    }
    if (secondsPast < 3600) {
        const minutes = Math.floor(secondsPast / 60);
        return `${minutes} minutes ago`;
    }
    if (secondsPast < 86400) {
        const hours = Math.floor(secondsPast / 3600);
        return `${hours} hours ago`;
    }
    const days = Math.floor(secondsPast / 86400);
    return `${days} days ago`;
}