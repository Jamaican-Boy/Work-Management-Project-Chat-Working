import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    user: null,
    allUsers: [],
    notifications: [],
    allChats: [],
    selectedChat: null,
  },
  reducers: {
    SetUser(state, action) {
      state.user = action.payload;
    },
    SetAllUsers(state, action) {
      state.allUsers = action.payload;
    },
    SetNotifications(state, action) {
      state.notifications = action.payload;
    },
    SetAllChats: (state, action) => {
      state.allChats = action.payload;
    },
    SetSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
  },
});

export const { SetUser, SetAllUsers,SetAllChats, SetSelectedChat,  SetNotifications } = usersSlice.actions;

export default usersSlice.reducer;
