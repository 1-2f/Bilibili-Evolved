const matchList = matchMedia('(prefers-color-scheme: dark)')
const check = (isSystemDark: boolean) => {
  if (isSystemDark !== settings.useDarkStyle) {
    settings.useDarkStyle = isSystemDark
  }
}
check(matchList.matches)
matchList.addEventListener('change', e => {
  check(e.matches)
})
