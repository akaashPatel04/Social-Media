import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist'
import userReducer from './userSlice';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
}

const rootReducer = combineReducers({ user: userReducer });

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaltMiddleware) => getDefaltMiddleware({
        serializableCheck: false,
    })
})

export default store;

export const persistor = persistStore(store);