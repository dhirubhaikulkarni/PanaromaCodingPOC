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

export const updateUser = (updatedUser) => async dispatch => {
  await axios.post(`${process.env.REACT_APP_API_URL}/users/userEdit`, updatedUser)
    .then(response => {
      dispatch(getUsers());
    }).catch((e) => {
      console.error('Failed to update user', e);
    });
};

export const deleteUser = (ID) => async (dispatch) => {
  try {
    await axios.delete(`${process.env.REACT_APP_API_URL}/users/${ID}`)
      .then((response) => {
        if (response.status == 200) {
          dispatch(setSuccess("User Deleted Successfully"));
          dispatch(getUsers())
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
  user: null,
  userData: []
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
    setSuccess: (state, action) => {
      state.success = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
});

export const { SetUser, ResetUser, setUsersData, setSuccess, setError } = userSlice.actions;
export const getUser = (state) => state.user.user;
export default userSlice.reducer;
