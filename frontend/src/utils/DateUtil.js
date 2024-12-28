export const getDateStringWIthTime = (date) => {
    return new Date(date).toLocaleString()
}

export const getDateString = (date) => { return new Date(date).toLocaleDateString(); }