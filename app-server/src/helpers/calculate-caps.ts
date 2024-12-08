

function calculateCaps(tokens: {in: number, out: number}, rate: {in: number, out: number}) {
  return Math.ceil(tokens.in * rate.in + tokens.out * rate.out)
}

export default calculateCaps