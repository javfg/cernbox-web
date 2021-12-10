import { mapGetters } from 'vuex'

export default {
  data: () => ({
    isPublic: false
  }),
  computed: {
    ...mapGetters(['Files/publicLinkPassword'])
  },
  methods: {
    fileInfo(filePath, davProperties) {
      if (this.isPublic) {
        return this.$client.publicFiles.getFileInfo(
          filePath,
          this.publicLinkPassword,
          davProperties
        )
      }
      return this.$client.files.fileInfo(filePath, davProperties)
    },

    getFileUrl(filePath) {
      if (this.isPublic) {
        // Token is already in the path, just pass all together
        return this.$client.publicFiles.getFileUrl('', filePath)
      } else {
        return this.$client.files.getFileUrl(filePath)
      }
    },

    putFileContents(filePath, text, options) {
      if (this.isPublic) {
        // Token is already in the path, just pass all together
        return this.$client.publicFiles.putFileContents(
          '',
          filePath,
          this.publicLinkPassword,
          text,
          options
        )
      } else {
        return this.$client.files.putFileContents(filePath, text, options)
      }
    },

    getFileContents(filePath) {
      if (this.isPublic) {
        return new Promise((resolve, reject) => {
          // Token is already in the path, just pass all together
          this.$client.publicFiles
            .download('', filePath, this.publicLinkPassword)
            .then(async (res) => {
              res.statusCode = res.status
              resolve({
                response: res,
                body: await res.text(),
                headers: {
                  ETag: res.headers.get('etag'),
                  'OC-FileId': res.headers.get('oc-fileid')
                }
              })
            })
            .catch(reject)
        })
      } else {
        return this.$client.files.getFileContents(filePath, {
          resolveWithResponseObject: true
        })
      }
    }
  }
}
