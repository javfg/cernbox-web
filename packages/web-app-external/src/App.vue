<template>
  <main
    class="oc-height-1-1"
    :class="{
      'oc-flex oc-flex-center oc-flex-middle': loading || loadingError
    }"
  >
    <h1 class="oc-invisible-sr" v-text="pageTitle" />
    <loading-screen v-if="loading" />
    <error-screen v-else-if="loadingError" :message="errorMessage" />
    <iframe
      v-if="appUrl && method === 'GET'"
      :src="appUrl"
      class="oc-width-1-1 oc-height-1-1"
      :title="iFrameTitle"
      allowfullscreen
    />
    <div v-if="appUrl && method === 'POST' && formParameters" class="oc-height-1-1">
      <form :action="appUrl" target="app-iframe" method="post">
        <input ref="subm" type="submit" :value="formParameters" class="oc-hidden" />
        <div v-for="(item, key, index) in formParameters" :key="index">
          <input :name="key" :value="item" type="hidden" />
        </div>
      </form>
      <iframe
        name="app-iframe"
        class="oc-width-1-1 oc-height-1-1"
        :title="iFrameTitle"
        allowfullscreen
      />
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import ErrorScreen from './components/ErrorScreen.vue'
import LoadingScreen from './components/LoadingScreen.vue'
import { DavProperties } from 'web-pkg/src/constants'
import { buildResource } from '../../web-app-files/src/helpers/resources'
import { useAppDefaults } from 'web-pkg/src/composables'

export default {
  name: 'ExternalApp',

  components: {
    ErrorScreen,
    LoadingScreen
  },
  setup() {
    return {
      ...useAppDefaults({
        applicationName: 'external'
      })
    }
  },

  data: () => ({
    loading: false,
    loadingError: false,
    errorMessage: '',
    appUrl: '',
    method: '',
    formParameters: {}
  }),
  computed: {
    ...mapGetters(['getToken', 'capabilities', 'configuration']),
    ...mapGetters('Files', ['publicLinkPassword']),

    pageTitle() {
      const translated = this.$gettext('"%{appName}" app page')
      return this.$gettextInterpolate(translated, {
        appName: this.appName
      })
    },
    iFrameTitle() {
      const translated = this.$gettext('"%{appName}" app content area')
      return this.$gettextInterpolate(translated, {
        appName: this.appName
      })
    },
    appName() {
      return this.$route.query.app
    },
    fileName() {
      return this.currentFileContext.fileName
    }
  },
  mounted() {
    const appNameTitle = this.appName ? `${this.appName} - ` : ''
    document.title = `${this.fileName} - ${appNameTitle}${this.configuration.currentTheme.general.name}`
  },
  async created() {
    this.loading = true
    const filePath = this.currentFileContext.path
    const fileInfo = await this.getFileInfoResource(filePath)

    // build headers with respect to the actual auth situation
    const { 'public-token': publicToken } = this.$route.query
    const publicLinkPassword = this.publicLinkPassword
    const accessToken = this.getToken
    const headers = {
      'X-Requested-With': 'XMLHttpRequest',
      ...(publicToken && { 'public-token': publicToken }),
      ...(publicLinkPassword && {
        Authorization:
          'Basic ' + Buffer.from(['public', publicLinkPassword].join(':')).toString('base64')
      }),
      ...(accessToken && {
        Authorization: 'Bearer ' + accessToken
      })
    }

    // fetch iframe params for app and file
    const configUrl = this.configuration.server
    const appOpenUrl = this.capabilities.files.app_providers[0].open_url.replace(/^\/+/, '')
    const url =
      configUrl +
      appOpenUrl +
      `?file_id=${fileInfo.fileId}` +
      (this.appName ? `&app_name=${this.appName}` : '')

    const response = await fetch(url, {
      method: 'POST',
      headers
    })

    if (response.status !== 200) {
      this.errorMessage = response.message
      this.loading = false
      this.loadingError = true
      console.error('Error fetching app information', response.status, this.errorMessage)
      return
    }

    const data = await response.json()

    if (!data.app_url || !data.method) {
      this.errorMessage = this.$gettext('Error in app server response')
      this.loading = false
      this.loadingError = true
      console.error('Error in app server response')
      return
    }

    this.appUrl = data.app_url
    this.method = data.method
    if (data.form_parameters) this.formParameters = data.form_parameters

    if (this.method === 'POST' && this.formParameters) {
      this.$nextTick(() => this.$refs.subm.click())
    }
    this.loading = false
  },
  methods: {
    // FIXME make getFileInfo return a Resource instead?
    async getFileInfoResource(path) {
      const file = await this.getFileInfo(path, DavProperties.Default)
      return buildResource(file)
    }
  }
}
</script>
