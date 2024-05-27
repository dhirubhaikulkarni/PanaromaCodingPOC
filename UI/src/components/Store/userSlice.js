import { createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

export const getUsers = () => async dispatch => {
  await axios.get(`${process.env.REACT_APP_API_URL}/users/getUsers`)
    .then(response => {
      dispatch(setUsersData(response.data))
    }).catch((e) => {
      dispatch(setUsersData([]))
    })

};

const initialState = {
  user: null, // Initialize with null instead of an empty array
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    SetUser: (state, action) => {
      state.user = action.payload;
    },
    setUsersData: (state, action) => {
      state.userData = action.payload;
    },
    ResetUser: (state, action) => {
      state.user = null;
    },
  },
});

export const { SetUser, ResetUser, setUsersData } = userSlice.actions;
export const getUser = (state) => state.user.user;
export default userSlice.reducer;
