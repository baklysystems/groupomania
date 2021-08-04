<template>
  <div>
    <DeleteAccountButton @onDeleteAccount="confirmDeletion" />
  </div>
</template>

<script>
import { apiClient } from '../services/ApiClient'
import DeleteAccountButton from '../components/DeleteAccountButton'

export default {
  name: 'UserDeleteAccount',
  components: {
    DeleteAccountButton
  },
  data () {
    return {
      userData: JSON.parse(localStorage.getItem('userData'))
    }
  },
  methods: {
    async confirmDeletion () {
      if (confirm('Are you sure you want to delete account?')) {
        await apiClient.delete(`api/users/${this.userData.id}`)

        localStorage.clear()
        this.$router.push({
          path: '/login?deletedAccount=true'
        })
      }
    }
  }
}
</script>

<style lang="scss"></style>