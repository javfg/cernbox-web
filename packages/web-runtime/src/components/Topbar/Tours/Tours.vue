<template>
  <div id="tours">
    <oc-button
      v-if="tours.length === 1"
      id="toursButton"
      v-oc-tooltip="'aa'"
      size="small"
      @click.stop="startTour(0)"
    >
      <oc-icon name="map" />
      {{ tours[0].options.tourName }}
    </oc-button>

    <div v-else>
      <oc-button id="toursButton" v-oc-tooltip="'See tours through the interface'" size="small">
        <oc-icon name="map" />
        <translate>Tours</translate> </oc-button
      ><oc-drop
        ref="menu"
        drop-id="tours"
        toggle="#toursButton"
        mode="click"
        close-on-click
        padding-size="small"
      >
        <oc-list class="user-menu-list">
          <li
            v-for="(tour, id) in tours"
            :id="tour.options.tourName"
            :key="`tour-${tour.title}-list-${id}`"
            class="user-menu-list"
            @click.stop="startTour(id)"
          >
            <oc-button appearance="raw">
              <span class="profile-info-wrapper" :class="'oc-py-xs'">
                {{ tour.options.tourName }}
              </span></oc-button
            >
          </li></oc-list
        >
      </oc-drop>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { isLocationPublicActive } from 'files/src/router'
import { useActiveLocation } from 'files/src/composables'

export default {
  props: {
    resources: {
      type: Array,
      required: false,
      default: null
    },
    route: {
      type: String,
      required: false,
      default: null
    }
  },
  setup() {
    return {
      isPublicLocation: useActiveLocation(isLocationPublicActive, 'files-public-files')
    }
  },
  data() {
    return {}
  },

  computed: {
    ...mapState(['user']),
    ...mapState('Files', ['files']),
    ...mapGetters(['user', 'configuration', 'getSettingsValue', 'toursCurrentLanguage']),

    tours() {
      return this.toursCurrentLanguage
    }
  },
  methods: {
    ...mapGetters(['toursByLanguage']),

    startTour(id) {
      this.tours[id].start()
    }
  }
}
</script>
<style src="shepherd.js/dist/css/shepherd.css"></style>

<style lang="scss">
.guide-highlight {
  background-color: var(--oc-color-background-highlight);
}

#tour {
  height: 100%;
  width: 100%;
}
.guide-img {
  width: 100%;
}
.shepherd-element {
  max-width: 700px !important;
}

.shepherd-header {
  align-items: center !important;
  background-color: var(--oc-color-swatch-brand-default) !important;
  border: 1px solid var(--oc-color-swatch-brand-default) !important;
  border: 0 !important;
  box-shadow: 5px 0 25px rgb(0 0 0 / 30%) !important;
  display: flex !important;
  flex-flow: row wrap !important;
  padding: var(--oc-space-small) var(--oc-space-medium) !important;
  h3 {
    color: var(--oc-color-swatch-inverse-default) !important;
    font-size: 1rem !important;
    font-weight: 700 !important;
    margin: 0 !important;
  }
}
.shepherd-text {
  border-top: 1px solid var(--oc-color-swatch-brand-default) !important;
}
.shepherd-element {
  border-radius: 15px !important;
  background-color: var(--oc-color-background-default) !important;
}

.shepherd-text,
.shepherd-footer {
  background-color: var(--oc-color-background-default) !important;
  border: 0 !important;
  //box-shadow: 5px 0 25px rgb(0 0 0 / 30%) !important;
  color: var(--oc-color-text-default) !important;
  padding: var(--oc-space-medium) !important;
}
.shepherd-footer {
  border: 0 !important;
}
.shepherd-button {
  background-color: var(--oc-color-swatch-primary-default) !important;
  border-color: var(--oc-color-swatch-primary-default) !important;
}
.shepherd-button-secondary {
  background-color: initial !important;
  color: var(--oc-color-swatch-passive-default) !important;
  border: 1px solid transparent !important;
  border-color: var(--oc-color-swatch-passive-default) !important;
}
</style>
