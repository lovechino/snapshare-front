import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice"
import postSlice from "./postSlice"
import socketSlice from "./socketSlice"
import ntfSlice from "./notificationSlice"
import messNoti from "./messNoti"
import chat from "./chatSlice"
import {persistReducer,FLUSH,REHYDRATE,PAUSE,PERSIST, PURGE,REGISTER } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from 'redux-persist/lib/storage'



const persistConfig = {
    key: 'root',
    version: 1,
    storage,
  }
  const rootReducer = combineReducers({
    auth : authSlice,
    post : postSlice,
    socketio : socketSlice,
    chat : chat,
    notification : ntfSlice,
    messNoti : messNoti
  })

  const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export default store