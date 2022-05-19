import Shepherd from 'shepherd.js'
const state = {
  // static nav items are set during extension loading and will not be modified later on
  tours: {},
  toursCurrentLanguage: {}
}

const mutations = {
  /**
   * Sets the tours
   *
   * @param state
   * @param navItems
   * @constructor
   */
  SET_TOURS(state, tours) {
    state.tours = tours
  },
  SET_TOURS_CURRENT_LANGUAGE(state, { tours, language }) {
    if (state.tours) state.toursCurrentLanguage = createToursFromConfig(tours, language)
  }
}

const getters = {
  tours: (state) => {
    return state.tours
  },
  toursCurrentLanguage: (state) => {
    return state.toursCurrentLanguage
  }
}

const actions = {
  setTours(context, tours) {
    context.commit('SET_TOURS', tours)
  },
  setToursCurrentLanguage(context) {
    const language = document.documentElement.lang || 'en'
    const tours = context.getters.tours
    context.commit('SET_TOURS_CURRENT_LANGUAGE', { tours, language })
  }
}
export default {
  state,
  mutations,
  getters,
  actions
}

function createToursFromConfig(tours, language) {
  const createdTours = []
  tours.forEach((t, i) => {
    const translatedTour = t[language] ? t[language] : t.en

    const tour = new Shepherd.Tour({
      tourName: translatedTour.tourName,
      useModalOverlay: translatedTour.useModalOverlay ? translatedTour.useModalOverlay : false,
      defaultStepOptions: {
        cancelIcon: {
          enabled: translatedTour.defaultStepOptions?.cancelIcon
            ? translatedTour.defaultStepOptions.cancelIcon
            : false
        },
        classes: translatedTour.defaultStepOptions?.classes
          ? translatedTour.defaultStepOptions.classes
          : [],
        scrollTo: translatedTour.defaultStepOptions?.scrollTo
          ? translatedTour.defaultStepOptions.scrollTo
          : null
      }
    })

    translatedTour.steps.forEach((s, j) => {
      const buttons = addButtons(s.buttons, s.moreInfoLink)
      tour.addStep({
        title: s.title,
        text: s.text,
        buttons: buttons,
        id: j
      })
    })

    tour.autostart = translatedTour.autostart

    createdTours.push(tour)
  })
  return createdTours
}

function addButtons(buttons, moreInfoLink) {
  const actionButtons = []
  buttons.includes('Learn more') &&
    actionButtons.push({
      action() {
        return window.open(moreInfoLink, '_blank').focus()
      },
      classes: 'oc-button oc-button-m oc-button-passive',
      text: 'Learn more',
      secondary: true
    })

  if (buttons.includes('back') || buttons.includes('Back'))
    actionButtons.push({
      action() {
        return this.back()
      },
      classes: 'oc-button oc-button-m oc-button-passive',
      text: 'Back',
      secondary: true
    })

  if (buttons.includes('next') || buttons.includes('Next'))
    actionButtons.push({
      action() {
        return this.next()
      },
      classes: 'oc-button oc-button-m oc-button-primary',
      text: 'Next'
    })

  return actionButtons
}
