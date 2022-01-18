<template>
  <div>
    <b-card
      class="mx-auto border-0 shadow p-0 p-lg-3 mb-2 mt-2 mb-lg-5 mt-lg-3 bg-white rounded"
    >
      <div class="d-flex align-items-center">
        <div class="d-flex mr-3">
          <router-link
            :to="{ name: 'UserProfile', params: { userId: this.post.userId } }"
          >
          <ProfileImage
            :src="this.post.User.imageUrl"
            customClass="post-profile-picture"
            divCustomClass="div-post-picture"
          /></router-link>
        </div>
        <div class="text-left">
          <router-link
            :to="{ name: 'UserProfile', params: { userId: this.post.userId } }"
            
          ><p class="user-name font-weight-bold mb-0">
          {{ this.post.User.username }}
        </p></router-link
          >
          <p class="text-secondary">
            {{
              moment(this.post.createdAt)
                .locale('en')
                .format('LL')
            }}
          </p>
        </div>
      </div>

      <EditButton
          customClass="post-button"
          classCollapse="post-btn-collapsed"
          :isCreator="this.post.userId == userData.userId"
          :isAdmin="userData.admin"
          @clickedEditButton="startEditing"
          @onDelete="onDelete"
          modifyText="Edit"
          deleteText="Delete"
        />
     
      <b-card-text class="text-left mt-3 mb-0 mb-lg-3" v-if="post.content">
        {{ this.post.content }}
      </b-card-text>

      <div
        class="post d-flex align-items-center justify-content-center my-1 mb-lg-4"
        v-if="post.imageUrl"
      >
        <img
          v-b-modal="`modal-photo-${this.post.id}`"
          class="post__image"
          :src="post.imageUrl"
          alt=""
        />
        <b-modal
          :id="`modal-${this.post.id}`"
          size="xl"
          class="modal-photo"
          header-class="header-style"
        >
          <div slot="modal-title"></div>
          <div class="d-flex align-items-center justify-content-center">
            <img class="modal-photo__img" :src="post.imageUrl" alt="" />
          </div>
          <div slot="modal-footer"></div>
        </b-modal>
      </div>

      <LikesList :post="post" :likesCount="likesCount" />

      <div class="line"></div>

      <div class="footer d-flex justify-content-around">
        <button
          @click="likeOrUnlikePost"
          class="react-btn footer-btn btn-block"
          aria-label="Like or dislike"
        >
          <svg
            v-if="likesThisPost"
            style="width:24px;height:24px"
            viewBox="0 0 24 24"
          >
            <path
              fill="rgb(32, 120, 244)"
              d="M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10M1,21H5V9H1V21Z"
            />
          </svg>
          <svg v-else style="width:24px;height:24px" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M5,9V21H1V9H5M9,21A2,2 0 0,1 7,19V9C7,8.45 7.22,7.95 7.59,7.59L14.17,1L15.23,2.06C15.5,2.33 15.67,2.7 15.67,3.11L15.64,3.43L14.69,8H21C22.11,8 23,8.9 23,10V12C23,12.26 22.95,12.5 22.86,12.73L19.84,19.78C19.54,20.5 18.83,21 18,21H9M9,19H18.03L21,12V10H12.21L13.34,4.68L9,9.03V19Z"
            />
          </svg>

          <span :class="`ml-2 ${likesThisPost ? 'blue' : ''}`">Like</span>
        </button>
        <button
          class="react-btn footer-btn btn-block"
          @click="focusInput(post)"
          aria-label="Comment"
        >
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z"
            />
          </svg>
          <span class="ml-2">Comment</span>
        </button>
      </div>
      <div class="line mb-3"></div>
      <CommentsList :post="post" />
    </b-card>
  </div>
</template>

<script>

import { mapActions } from 'vuex'
import { apiClient } from '../services/ApiClient'
import router from '../router/index'
import EditPost from '../components/EditPost'
import EditButton from '../components/EditButton'
import ProfileImage from './ProfileImage'
import CommentsList from '../components/CommentsList'
import LikesList from '../components/LikesList'

export default {
  name: 'Post',
  components: {
    EditButton,
    EditPost,
    ProfileImage,
    CommentsList,
    LikesList
  },
  props: [
    'post'
  ],

  data () {
    //console.log("please work", this.post);
    return {
      userData: JSON.parse(localStorage.getItem('userData')),
      likesThisPost: false,
      likesCount: this.post.Likes.length,
      isEditing: false
    }
  },
  methods: {
    async likeOrUnlikePost () {
      const res = await apiClient.post(`api/posts/${this.post.id}/likes`)

      //console.log("What is the response?", res.like);

      if (res.like !== this.likesThisPost) {

        this.post.likesCount += res.like ? 1 : -1
        this.likesCount += res.like ? 1 : -1
      }

      this.likesThisPost = res.like
      //window.location.reload()
    },

    ...mapActions(['displayNotification']),

    async mounted () { /*when the page loads*/
      const res = await apiClient.get(`api/posts/${this.post.id}/likes`)
      this.likesThisPost = res.like
      //console.log(this.post);
    },

    focusInput () {
      document.getElementById(`post-area-${this.post.id}`).focus()
    },

    toggleActions () {
      this.areActionsVisible = !this.areActionsVisible
    },

    async onDelete () {
      const res = await apiClient.delete(
        `api/posts/${this.post.id}`
      )
      this.$emit('PostDeleted', this.post)
      this.displayNotification('Post deleted!')

      window.location.reload()
    },

    startEditing () {
      this.isEditing = true
      setTimeout(() => {
        //console.log(this.$refs);
        this.$refs.inputContent.focus()
      }, 30)
    },
    newline () {
      this.post.content = `${this.post.content}\n`
    },

    async modifyPost () {
      const res = await apiClient.put(
        `api/posts/${this.post.id}`,
        { content: this.post.content }
      )
      this.post.updatedAt = res.post.updatedAt
      this.isEditing = false
      this.displayNotification('Post edited!')
    }

  }
}
</script>

<style lang="scss">
.div-post-picture {
  width: 50px;
  height: 50px;
  margin-bottom: 1rem;
}

.post-profile-picture {
  height: 50px;
}

@media screen and (min-width: 280px) and (max-width: 769px) {
  .div-post-picture {
    width: 42px;
    height: 42px;
  }

  .post-profile-picture {
    height: 42px;
  }
}

.btn-block + .btn-block {
  margin-top: 0px;
}

.line {
  display: block;
  width: 100%;
  height: 1px;
  background-color: rgba(192, 192, 192, 0.5);
}

.blue {
  color: rgb(32, 120, 244);
}
.react-btn {
  background: white;
  border: none;
  margin: 3px;
  color: #747474;
  border-radius: 0.25rem;
  font-weight: bold;
  padding: 0.375rem 0.75rem;
  &:focus {
    border: none !important;
    outline: none !important;
  }
  &:hover {
    color: #747474 !important;
    background-color: rgba(108, 117, 125, 0.1) !important;
  }
}

.like-btn {
  color: #747474;
  font-weight: normal;
  &:hover,
  &:focus,
  &:active {
    color: #747474 !important;
    font-weight: normal;
    background: none !important;
  }
}

.modal-photo {
  &__img {
    max-width: 100%;
    max-height: calc(100vh - 110px);
  }
}

.header-style {
  padding-bottom: 0;
  border-bottom: none;
}
</style>