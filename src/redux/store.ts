import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import reducers from "./slices";
import { PersistPartial } from "redux-persist/es/persistReducer";

const persistConfig = {
  key: "perpustakaan-unsurya",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: true,
      },
    }),
});

export type RootState = ReturnType<typeof store.getState> & PersistPartial;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
export default store;
