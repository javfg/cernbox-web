<template>
    <oc-modal
      :title="$gettext('Notification Settings')"
      :button-cancel-text="$gettext('Discard')"
      :button-confirm-text="$gettext('Save')"
      :checkbox-label="$gettext('Disable all notifications')"
      focus-trap-initial="#create-user-input-display-name"
      @cancel="$emit('cancel')"
      @confirm="$emit('confirm')"
    >
      <template #content>
        
      </template>
    </oc-modal>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  import { useGraphClient } from 'web-pkg'
  
  export default defineComponent({
    name: 'NotificationsModal',
    emits: ['cancel', 'confirm'],
    setup() {
      return {
        ...useGraphClient()
      }
    },
    data: function () {
      return {
      }
    },
    computed: {
    },
    methods: {
    }
  })
  </script>
  