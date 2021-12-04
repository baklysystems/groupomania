<template>
  <div> <!-- v-model updates automatically, so content gets uploaded automatically -->
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
      content: '', //variables in data get displayed in {{ }} or "" above
      selectedFile: null,
      didSubmitForm: false
    }
  },
  methods: {
    ...mapActions(['createPost', 'displayNotification']), //...let's code result in having an array with duplicate elements


    onFileSelected (file) { //define new method should have an argument called file
      console.log("Hello");
      console.log(file);
      let body = this.input
      
      const isFormData = !!this.selectedFile
      this.selectedFile = file //single equal assignment , == comparison 
        
        if (isFormData) {
          const formData = new FormData()
          formData.append('image', this.file)
          formData.append('user', JSON.stringify(body))
          body = formData
                   apiClient.post('api/posts', formData, {
                    'Content-Type': 'multipart/form-data'
            }).then(res => {
              localStorage.setItem('userData', JSON.stringify(res.user))
              this.userData = res.user
              window.location.reload()
            })
            .catch(error => {
              if (error.error) {
                return (this.errorMessage = error.error.errors[0].message)
              }

              this.errorMessage = 'Uploading issue'
            })
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