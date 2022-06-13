const alpha = Array.from(Array(26)).map((e, i) => i + 65);
const alphabet = new Set(alpha.map((x) => String.fromCharCode(x)));
const alphabetLower = new Set(Array.from(alphabet).map((x) => x.toLowerCase()))

export const camelToHuman = (s) => {
  const chars = Array.from(s).map((char, index) => {
    if (index === 0) {
      return char.toUpperCase()
    }
    if (alphabet.has(char)) {
      return ` ${char}`
    }
    return char
  })
  return chars.join('')
}