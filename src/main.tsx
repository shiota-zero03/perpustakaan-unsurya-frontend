import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";
import './index.css'
import App from './App.tsx'
import Loader from './components/Loader/index.tsx';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/store.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<Loader />}>
      <NextUIProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
            <Toaster position="top-center" />
          </PersistGate>
        </Provider>
      </NextUIProvider>
    </Suspense>
  </StrictMode>,
)
