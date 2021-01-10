const colors = {
  red: '#e57373',
  pink: '#F06292',
  purple: '#BA68C8',
  deepPurple: '#9575CD',
  indigo: '#7986CB',
  blue: '#2196F3',
  lightBlue: '#00A0D8',
  cyan: '#00ACC1',
  teal: '#26A69A',
  green: '#81C784',
  lightGreen: '#9CCC65',
  orange: '#FF9800',
  deepOrange: '#FF7043',
  brown: '#A1887F',
  grey: '#757575',
  blueGrey: '#78909C'
}
export class ThemeColors {
  constructor () {
    this.reloadColor = (() => {
      const html = document.querySelector('html')
      return function (newColor) {
        const color = new ColorProcessor(newColor)
        const hexToRgba = input => color.rgbToString(color.hexToRgba(input))

        html.style.setProperty('--theme-color', newColor)
        for (let opacity = 10; opacity <= 90; opacity += 10) {
          html.style.setProperty(`--theme-color-${opacity}`, hexToRgba(newColor + opacity))
        }
        html.style.setProperty('--foreground-color', color.foreground)
        html.style.setProperty('--foreground-color-b', hexToRgba(color.foreground + 'b'))
        html.style.setProperty('--foreground-color-d', hexToRgba(color.foreground + 'd'))
        html.style.setProperty('--blue-image-filter', color.blueImageFilter)
        html.style.setProperty('--pink-image-filter', color.pinkImageFilter)
        html.style.setProperty('--brightness', color.brightness)
        html.style.setProperty('--invert-filter', color.filterInvert)
      }
    })()
  }
  setupDom () {
    const input = document.querySelector(`input[key='customStyleColor']`)
    // input.addEventListener('change', () => {
    //   this.reloadColor(input.value)
    // })
    addSettingsListener('customStyleColor', value => this.reloadColor(value))
    addSettingsListener('foregroundColorMode', () => this.reloadColor(settings.customStyleColor))
    const grid = document.querySelector('.predefined-colors-grid')
    for (const color of Object.values(colors)) {
      const block = document.createElement('div')
      grid.insertAdjacentElement('beforeend', block)
      block.classList.add('predefined-colors-grid-block')
      block.style.background = color
      block.setAttribute('data-color', color)
      block.addEventListener('click', e => {
        const newColor = e.target.getAttribute('data-color')
        input.value = newColor
        raiseEvent(input, 'input')
        raiseEvent(input, 'change')
      })
    }
    const box = document.querySelector('.predefined-colors')
    const toggleButton = document.querySelector('div.custom-color-preview')
    const outsideHandler = e => {
      if (e.target !== toggleButton && !toggleButton.contains(e.target) && e.target !== input) {
        box.classList.remove('opened')
        document.removeEventListener('click', outsideHandler)
      }
    }
    toggleButton.addEventListener('click', () => {
      if (!box.classList.contains('opened')) {
        document.addEventListener('click', outsideHandler)
      } else {
        document.removeEventListener('click', outsideHandler)
      }
      box.classList.toggle('opened')
    })
  }
}
export default {
  export: { ThemeColors }
}
