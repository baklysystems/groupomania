<template>
  <div>
    <b-form @submit="onSubmit">
      <PostForm
        @onFileSelected="onFileSelected"
        v-model="content"
        :onFormSubmit="didSubmitForm"
        :isCreating="true"
        
      />
    </b-form>
  </div>
</template>

<script>
import { apiClient } from '../services/ApiClient'
import { mapActions } from 'vuex'
import PostForm from './PostForm'

export default {
  name: 'CreatePost',
  components: {
    PostForm
  },
  props: {},
  data () {
    return {
      content: '',
      selectedFile: null,
      didSubmitForm: false
    }
  },
  methods: {
    ...mapActions(['createPost', 'displayNotification']),

    onFileSelected (file) {
      if (
      this.selectedFile = file
        ) {
          apiClient
            .post('api/auth/posts', this.file)
            .then(data => {
            if (!data.token) {
              this.errorMessage = data.error.errors[0].message
            } else {
              /*localStorage.setItem('userToken', data.token)
              localStorage.setItem('userData', JSON.stringify(data.user))*/
              router.push({ name: 'Posts' })
            }
          })
           .catch(error => {
            if (error.error) {
              return (this.errorMessage = error.error.errors[0].message)
            }

            this.errorMessage = 'Uploading issue'
            })
      } else {
        this.errorMessage = 'Please upload text or an image'
      }
    },

    async onSubmit (event) {
      await this.createPost({
        selectedFile: this.selectedFile,
        content: this.content
      })
      this.displayNotification('Post Created!')
      this.resetForm(event)
    },

    resetForm (event) {
      event.target.reset()
      this.content = ''
      this.selectedFile = null
      this.didSubmitForm = !this.didSubmitForm
    } 
  } 
}
</script>

<style lang="scss">
.custom-file-label {
  text-align: left;
}
</style>