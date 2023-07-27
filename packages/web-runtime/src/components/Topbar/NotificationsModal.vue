<template>
    <oc-modal
      :title="$gettext('Notification Settings')"
      :button-cancel-text="$gettext('Discard')"
      :button-confirm-text="$gettext('Save')"
      @cancel="$emit('cancel')"
      @confirm="onConfirm"
    >
      <template #content>
        <oc-checkbox 
          v-model="localNotifyEnabled" 
          label="Disable all notifications" 
        />
      </template>
    </oc-modal>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, watch, PropType } from 'vue'
  import { useGraphClient } from 'web-pkg'
  
  export default defineComponent({
    name: 'NotificationsModal',
    emits: ['cancel', 'update:initialNotifyEnabled', 'confirm'],
    props: {
      initialNotifyEnabled: {
        type: Boolean as PropType<boolean>,
        required: true
      },
    },
    setup(props, { emit }) {
      const localNotifyEnabled = ref(props.initialNotifyEnabled);

      watch(
        () => props.initialNotifyEnabled,
        (newVal) => {
          localNotifyEnabled.value = newVal;
        }
      );

      const onConfirm = () => {
        emit('update:initialNotifyEnabled', localNotifyEnabled.value);
        emit('confirm', localNotifyEnabled.value);
      };

      return {
        localNotifyEnabled,
        onConfirm,
        ...useGraphClient()
      };
    }
  })
  </script>
  