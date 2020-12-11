const host = `www.biliplus.com`
const supportedUrls = [
  'bilibili.com/video/',
  'bilibili.com/bangumi/play',
  //'bilibili.com/bangumi/media',
  'space.bilibili.com',
  // 'manga.bilibili.com'
]
export default {
  widget: {
    condition: () => {
      return supportedUrls.some(url => document.URL.includes(url))
    },
    content: /*html*/`
      <a class="gui-settings-flat-button" id="biliplus-redirect">
        <i class="icon-biliplus"></i>
        <span>转到BiliPlus</span>
      </a>`,
    success: () => {
      const button = document.querySelector('#biliplus-redirect') as HTMLAnchorElement & HTMLButtonElement
      const videoRegex = /\/video\/(av[\d]+|BV.+)/i
      const cancelUrl = () => {
        button.href = ''
        button.disabled = true
      }
      const setUrl = (url: string) => {
        if (document.URL !== url) {
          button.href = url
        } else {
          cancelUrl()
        }
      }

      if (location.host === 'space.bilibili.com') {
        const url = document.URL.replace('space.bilibili.com/', `${host}/space/`)
        setUrl(url)
      }
      // else if (document.URL.includes('/bangumi/media')) {
      //   const mediaMatch = document.URL.match(/media\/md(\d+)/)
      //   if (mediaMatch) {
      //     const [, mediaID] = mediaMatch
      //     setUrl(`https://${host}/bangumi/i/${mediaID}`)
      //   } else {
      //     cancelUrl()
      //   }
      // }
      else if (document.URL.includes('/bangumi/play')) {
        setUrl(`https://${host}${window.location.pathname}${window.location.search}`)
        Observer.videoChange(() => {
          const bangumiAid = document.querySelector('.av-link,.info-sec-av') as HTMLElement
          const aid = unsafeWindow.aid || bangumiAid.innerText.replace(/[aAvV]/g, '')
          const url = `https://${host}/video/av${aid}/`
          setUrl(url)
        })
      }
      else if (videoRegex.test(document.URL)) {
        const [, id] = document.URL.match(videoRegex)!
        setUrl(`https://${host}/video/${id}/`)
      }
      else {
        Observer.videoChange(() => {
          const url = document.URL.replace(window.location.host, host)
          setUrl(url)
        })
      }
    },
  }
}