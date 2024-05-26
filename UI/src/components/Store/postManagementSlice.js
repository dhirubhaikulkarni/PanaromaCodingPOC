import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


export const getPosts = () => async dispatch => {
  await axios.get('http://localhost:4000/api/posts')
    .then(response => {
      dispatch(setPost(response.data))
    }).catch((e)=> {
      dispatch(setPost([]))
    })

};



const initialState = {
  data: [],


};

const postManagementSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPost: (state, action) => {
      state.data = action.payload
    }
  }
});

export const {
  setPost
} = postManagementSlice.actions;

export default postManagementSlice.reducer;

