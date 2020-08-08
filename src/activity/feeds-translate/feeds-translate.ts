import { FeedsCard } from '../feeds-apis'

(async () => {
  if (!document.URL.startsWith('https://t.bilibili.com/')
    && !document.URL.startsWith('https://space.bilibili.com/')) {
    return
  }
  resources.applyStyle('feedsTranslateStyle')
  const { getTranslator } = await import('./feeds-translate-providers')
  const Translator = Vue.extend({
    template: /*html*/`
      <div class="translate-container">
        <div class="translate" v-if="!working && !translated" @click="translate()">
          <i class="mdi mdi-earth"></i>翻译
        </div>
        <i v-if="working" class="translating mdi mdi-18px mdi-loading mdi-spin"></i>
        <div class="translated" v-if="translated">翻译自<a :href="activeTranslator.link" target="_blank">{{activeTranslator.name}}</a>:</div>
        <div v-if="translated" class="translate-result">{{result}}</div>
      </div>
    `,
    props: {
      card: {
        type: Object,
        required: true,
      }
    },
    data() {
      return {
        result: '',
        working: false,
        activeTranslator: {},
      }
    },
    computed: {
      translated() {
        return this.result !== ''
      }
    },
    methods: {
      async translate() {
        const card = this.card as FeedsCard
        try {
          this.working = true
          const text = (await card.getText()).replace(/#(.+?)#/g, '') // 移除 #话题# , '#'似乎会干扰翻译器
          const translator = this.activeTranslator = getTranslator()
          this.result = await translator.translate(text, {
            targetLanguage: (() => {
              if (settings.i18n) {
                return languageNameToCode[settings.i18nLanguage]
              }
              if (settings.feedsTranslateLanguage !== '') {
                return settings.feedsTranslateLanguage
              }
              return
            })(),
          })
        } catch (error) {
          logError(error)
        } finally {
          this.working = false
        }
      },
    },
  })
  const injectButton = (card: FeedsCard) => {
    if (card.text.replace(/#(.+?)#/g, '') === '') {
      return
    }
    if (dq(card.element, '.card-content .translate-container')) {
      return
    }
    const cardContent = card.element.querySelector('.card-content') as HTMLElement
    const translator = new Translator({
      propsData: {
        card: _.clone(card),
      },
    }).$mount()
    cardContent.insertAdjacentElement('beforeend', translator.$el)
  }

  const { forEachFeedsCard } = await import('../feeds-apis')
  forEachFeedsCard({
    added: injectButton
  })
})()