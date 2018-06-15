function randomBiased(bias, influence) {
    let mix = Math.random() * (influence || 1)
    return Math.random() * (1 - mix) + bias * mix
}

export default randomBiased
