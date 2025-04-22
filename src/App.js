import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";// Import Routes all
import { authProtectedRoutes, publicRoutes } from "./routes"

// Import all middleware
import Authmiddleware from "./routes/route"
import "./i18n"
// layouts Format
import VerticalLayout from "./components/VerticalLayout/"
import HorizontalLayout from "./components/HorizontalLayout/"
import NonAuthLayout from "./components/NonAuthLayout"

// Import scss
import "./assets/scss/theme.scss"
import i18n from "./i18n"

const getLayout = (layoutType, type) => {
  let Layout = VerticalLayout;
  
  if (type !== "admin") {
    Layout = HorizontalLayout;
  }

  return Layout;
};



const App = () => {
  const type = localStorage.getItem("type");
  const { layoutType } = useSelector(state => ({
    layoutType: state.Layout.layoutType,
  }));

  const Layout = getLayout(layoutType, type);

  return (
    <React.Fragment>
      <Routes>
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <NonAuthLayout>
                {route.component}
              </NonAuthLayout>
            }
            key={idx}
            exact={true}
          />
        ))}

        {authProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <Authmiddleware>
                <div
                  className={`${i18n.language === "fa" ? "rtlFont" : "ltrFont"
                    }`}
                >
                  <Layout>{route.component}</Layout>
                </div>
              </Authmiddleware>}
            key={idx}
            exact={true}
          />
        ))}
      </Routes>
    </React.Fragment>
  );
};

App.propTypes = {
  layout: PropTypes.any
};

export default App;