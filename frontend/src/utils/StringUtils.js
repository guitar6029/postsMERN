export const getGreeting = () => {
    let greeting = '';
    const hour = new Date().getHours();
    if (hour < 12) {
        greeting = 'Good Morning, ';
    } else if (hour < 18) {
        greeting = 'Good Afternoon, ';
    } else {
        greeting = 'Good Evening, ';
    }

    return greeting;
}
