import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "antd/dist/reset.css";
import { Button, ConfigProvider, Result } from "antd";
import locale from "antd/locale/de_DE";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createHashRouter,
  useLocation,
} from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./store";
import TopicMapContextProvider from "react-cismap/contexts/TopicMapContextProvider";
import {
  additionalLayerConfiguration,
  backgroundConfigurations,
  backgroundModes,
  extendBaseLayerConf,
  offlineConfig,
} from "./constants/background.jsx";
import { defaultLayerConf } from "react-cismap/tools/layerFactory";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import LoginPage from "./pages/LoginPage.jsx";
import { checkJWTValidation, getJWT } from "./store/slices/auth.js";
import { useEffect } from "react";
import NavBar from "./components/commons/Navbar.jsx";
import TablePage from "./pages/TablePage.jsx";
import DetailsPage from "./pages/DetailsPage.jsx";
import DetailsWrapper from "./pages/DetailsWrapper.jsx";
import TimelinePage from "./pages/TimelinePage.jsx";

const baseLayerConf = extendBaseLayerConf({ ...defaultLayerConf });

const persistor = persistStore(store);

const AuthWrapper = () => {
  const jwt = useSelector(getJWT);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkJWTValidation());
  }, []);

  if (!jwt) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="h-screen w-full">
      <NavBar />
      <ConfigProvider>
        <Outlet />
      </ConfigProvider>
    </div>
  );
};

const productionMode = process.env.NODE_ENV === "production";

const router = createHashRouter([
  {
    path: "/",
    element: <AuthWrapper />,
    errorElement: productionMode && (
      <Result
        status="404"
        title="404"
        subTitle="Die Seite wurde nicht gefunden"
        extra={
          <Button type="primary" href="/">
            Zurück
          </Button>
        }
      />
    ),
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/tabelle",
        element: <TablePage />,
      },
      {
        path: "/antrag/:id",
        element: <DetailsWrapper />,
        children: [
          {
            path: "uebersicht",
            element: <DetailsPage />,
          },
          {
            path: "verlauf",
            element: <TimelinePage />,
          },
          {
            path: "zeichnen",
            element: <></>,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PersistGate loading={null} persistor={persistor}>
      <ConfigProvider
        locale={locale}
        theme={{
          components: {
            Timeline: {
              dotBg: "inherit",
            },
          },
        }}
      >
        <Provider store={store}>
          <TopicMapContextProvider
            appKey="verdis-desktop.map"
            backgroundModes={backgroundModes}
            backgroundConfigurations={backgroundConfigurations}
            baseLayerConf={baseLayerConf}
            offlineCacheConfig={offlineConfig}
            additionalLayerConfiguration={additionalLayerConfiguration}
          >
            <RouterProvider router={router} />
          </TopicMapContextProvider>
        </Provider>
      </ConfigProvider>
    </PersistGate>
  </React.StrictMode>
);
