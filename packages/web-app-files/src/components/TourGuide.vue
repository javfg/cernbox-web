<template>
</template>

<script>
import Shepherd from 'shepherd.js'
import tourDefinition from '../helpers/tourContents'

export default {
  mounted() {
    const tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        cancelIcon: {
          "enabled": true
        },
        classes: 'new-features',
        scrollTo: {
          behavior: 'smooth',
          block: 'center'
        },
      },
      tourName: "What's new?",
      tooltip: 'See new features',

      // TODO: we have route in this.$route.name
      autostart: {
        timeout: 3000,
        location: 'files-spaces-personal-home'
      }
    });

    tourDefinition.steps.forEach((step, index) => {
      // TODO: buttons depend on index, add learn more if present in step
      step['buttons'] = [{
        text: 'Back',
        action: tour.back
      }, {
        text: 'Next',
        action: tour.next
      }]

      tour.addStep(step)
    });

    tour.addSteps(tourDefinition.steps)

    this.$nextTick(() => {
      tour.start()
    })
  }
}
</script>

<style src="shepherd.js/dist/css/shepherd.css">
</style>
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
