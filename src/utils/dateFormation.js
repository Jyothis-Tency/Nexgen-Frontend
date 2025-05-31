import { formatDistanceToNow } from 'date-fns';

export const calculateTimeAgo = (dateString) => {
    const timeDifference = formatDistanceToNow(new Date(dateString), { addSuffix: false });
    const parts = timeDifference.split(' '); // Split the formatted string

    if (timeDifference.includes('minute')) return parts[0] + ' minutes';
    if (timeDifference.includes('hour')) return parts[1] + ' hours';
    if (timeDifference.includes('day')) return parts[0] + ' days';
    if (timeDifference.includes('month')) return parts[1] + ' months';
    if (timeDifference.includes('year')) return parts[1] + ' year';

    return 'Just now'; // Default case for seconds or unknown cases
};
