const colors = ['050609', 'F5D0C5', 'D69F7E', '774936', '3C0000', '6C5A49', '6C4B5E', 'D7907B']

const generateColors = (num) => {
    const l = []
    for (let i = 0; i < num; i++ ){
        l.push(colors[Math.floor(Math.random() * colors.length)])
    }
    return l
}

export { generateColors }