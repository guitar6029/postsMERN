let bgColors = ['#CD6A65', '#368C76', '#D18134', '#D06DA7', '#516DBE', '#8160B7']

export const getColor = (index) => {
    // go through each color, start from start if index is out of range
    return bgColors[index % bgColors.length]  
}