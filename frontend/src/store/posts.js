import { apiClient } from '../services/ApiClient'

export default {
  state: {
    errorMessage: '',
    page: 1,
    isOnLastPage: false,
    list: []
  },
  mutations: {
    UPDATE_POSTS_LIST (state, posts) {
      state.list = posts
    },
    ERROR_MESSAGE (state, message) {
      state.message = message
    },
    INCREMENT_PAGE (state) {
      state.page++
    },
    REACHED_LAST_PAGE (state) {
      state.isOnLastPage = true
    },
    REMOVE_POST (state, postId) {
      state.list = state.list.filter(post => post.id !== postId)
    },
    UPDATE_ONE_POST (state, modifiedPost) {
      const postIndex = state.list.findIndex(
        post => post.id === modifiedPost.id
      )
      state.list[postIndex] = modifiedPost
      state.list = [...state.list]
    },
    CREATE_POST (state, newPost) {
      state.list.unshift(newPost)
      state.list = [...state.list]
    },
    RESET_STORE (state) {
      state.list = []
      state.page = 1
      state.isOnLastPage = false
    }
  },
  actions: {
    initializePostStore ({ dispatch, commit }, params = {}) {
      commit('RESET_STORE')
      dispatch('fetchPosts', params)
    },

    fetchPosts ({ state, commit }, params = {}) {
      //console.log(params);
      let userIdParams = ''
      if (params.userId) {
        userIdParams = `&userId=${params.userId}`
      }

      //console.log(state.page, userIdParams);

      return apiClient
        //.get(`api/posts?page=${state.page}&userId=48`)
        .get(`api/posts?page=${state.page}${userIdParams}`)
        .then(response => {
          //console.log("response:", response);
          if (response.posts) {
            commit('UPDATE_POSTS_LIST', state.list.concat(response.posts))
          }
        })
        .catch(() => {
          commit('ERROR_MESSAGE', 'Connection problem')
        })
    },

    async loadMore ({ state, commit, dispatch }, params) {
      if (state.isOnLastPage) return

      commit('INCREMENT_PAGE')
      const initialLength = state.list.length

      await dispatch('fetchPosts', params)

      if (state.list.length === initialLength) {
        commit('REACHED_LAST_PAGE')
      }
    },

    deletePost ({ commit }, postId) {
      apiClient
        .delete('api/posts/' + postId)
        .then(() => commit('REMOVE_POST', postId))
        .catch(error => {
          console.log({ error: error })
          commit('ERROR_MESSAGE', 'Connection problem')
        })
    },

    modifyPost ({ commit }, { postId, selectedFile, content }) {
      let body = {
        content: content
      }

      const isFormData = !!selectedFile

      if (isFormData) {
        const formData = new FormData()
        formData.append('image', selectedFile)
        formData.append('post', JSON.stringify({
          content: content
        }));
        body = formData;

      return apiClient
        //.put('api/posts/' + postId, body, { isFormData })
        .put('api/posts/' + postId, body, {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*' ,
            'Accept': 'application/json'
          },true)
        .then(response => {
          //console.log("Test update post");
          commit('UPDATE_ONE_POST', response.post)
        })
        .catch((error) => {
          commit('ERROR_MESSAGE', error)
        })

    }
      return apiClient
      .put('api/posts/' + postId, body)
        .then(response => {
          //console.log("Testupdated post");
          commit('UPDATE_ONE_POST', response.post)
        })
        .catch((error) => {
          commit('ERROR_MESSAGE', error)
        })
      },

    createPost ({ commit }, { selectedFile, content }) {
      var body = {
        content: content
      }
      const isFormData = !!selectedFile

      if (isFormData) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('post', JSON.stringify({
          content: content
        }));
        body = formData;
        return apiClient
            .post('api/posts/', body,{
              'Content-Type': 'multipart/form-data',
              'Access-Control-Allow-Origin': '*' ,
              'Accept': 'application/json'
            },true)
            .then(response => {
              commit('CREATE_POST', response.post)
            })
            .catch((error) => {
              commit('ERROR_MESSAGE', error)
            })
      }
      return apiClient
        .post('api/posts/', body)
        .then(response => {
          commit('CREATE_POST', response.post)
        })
        .catch((error) => {
          commit('ERROR_MESSAGE', error)
        })
    }
  }
}