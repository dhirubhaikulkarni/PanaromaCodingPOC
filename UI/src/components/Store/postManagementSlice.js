import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


export const getPosts = () => async dispatch => {
  await axios.get(`${process.env.REACT_APP_API_URL}/posts`)
    .then(response => {
      dispatch(setPost(response.data))
    }).catch((e) => {
      dispatch(setPost([]))
    })

};
export const getCategories = () => async dispatch => {
  await axios.get(`${process.env.REACT_APP_API_URL}/categories`)
    .then(response => {
      dispatch(setCategories(response.data.filter(category => category.isActive)))
    }).catch((e) => {
      dispatch(setCategories([]))
    })

};

export const addPost = (title, content, selectedCategory) => async dispatch => {
   
  try {
    setLoading(true)
    await axios.post(`${process.env.REACT_APP_API_URL}/posts/addPost`, {
      title,
      content,
      author: JSON.parse(localStorage.getItem('user'))._id,
      categoryId: selectedCategory,
    })
      .then(response => {
        if (response.status === 200) {
          dispatch(setLoading(false))
          dispatch(setSuccess('Post added successfully!'));
          const timer = setTimeout(() => {
            dispatch(setSuccess(null));
          }, 1000);
          // Clear timeout if the component is unmounted
          return () => clearTimeout(timer);
        }
      }).catch((error) => {
        dispatch(setLoading(false))
        dispatch(setError('Failed to Add Post.'));
      })

  } catch (error) {
    dispatch(setLoading(false))
    dispatch(setError('Failed to Add Post.'));
  }

};


export const updatePost = (postId, title, content, selectedCategory) => async dispatch => {
  try {
    dispatch(setLoading(true));
    await axios.put(`${process.env.REACT_APP_API_URL}/posts/editPost/${postId}`, {
      title,
      content,
      selectedCategory
    })
      .then(response => {
        if (response.status === 200) {
          dispatch(setLoading(false));
          dispatch(setSuccess('Post updated successfully!'));
          const timer = setTimeout(() => {
            dispatch(setSuccess(null));
          }, 1000);
          // Clear timeout if the component is unmounted
          return () => clearTimeout(timer);
        }
      }).catch((error) => {
        dispatch(setLoading(false));
        dispatch(setError('Failed to Update Post.'));
      });
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(setError('Failed to Update Post.'));
  }
};

export const deletePost = (ID) => async (dispatch) => {
  try {
    await axios.delete(`${process.env.REACT_APP_API_URL}/posts/${ID}`)
      .then((response) => {
        if (response.status == 200) {
          dispatch(setSuccess("Post Deleted Successfully"));
          dispatch(getPosts())
          const timer = setTimeout(() => {
            dispatch(setSuccess(null));
          }, 1000);
          // Clear timeout if the component is unmounted
          return () => clearTimeout(timer);

        }
        else {
          dispatch(setError('Failed to Delete Post.'));
        }

      })
      .catch((error) => {
        dispatch(setError('Failed to Delete Post.'));
      });
  } catch (e) {
    return console.error(e.message);
  }
};


const initialState = {
  data: [],
  categories: [],
  success: null,
  error: "",
  loading: false


};

const postManagementSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPost: (state, action) => {
      state.data = action.payload
    },
    setCategories: (state, action) => {
      state.categories = action.payload
    },
    setSuccess: (state, action) => {
      state.success = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    }
  }
});

export const {
  setPost,
  setCategories,
  setSuccess,
  setError,
  setLoading
} = postManagementSlice.actions;

export default postManagementSlice.reducer;

