import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './App.scss';
import AppRoutes from './AppRoutes';
import Navbar from './shared/Navbar';
import UserSidebar from './shared/CategorySidebar';
import Sidebar from './shared/Sidebar';
import SettingsPanel from './shared/SettingsPanel';
import UserItemsPanel from './shared/UserItemsPanel';
import Footer from './shared/Footer';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

const App = () => {

  const [isFullPageLayout, setIsFullPageLayout] = useState(false);
  const location = useLocation();

  const [tokenBool, setTokenBool] = useState(false);
  const [roleBool, setRoleBool] = useState(false);
  const [aboutMySelf, setAboutMySelf] = useState();

  const authorization = localStorage.getItem("Online-Shopping Authorization") !== null;
  const role = localStorage.getItem("Online-Shopping User-Role") !== null;


  useEffect(() => {
    const currentPath = location.pathname;
    onRouteChanged(currentPath);
  }, [location.pathname]);

  
  


  let navbarComponent = !isFullPageLayout ? <Navbar authentification={tokenBool} role={roleBool} about={aboutMySelf} rightSidebarBool={true} /> : '';
  let sidebarComponent = !isFullPageLayout ? (role ? <Sidebar /> : <UserSidebar />) : '';
  let SettingsPanelComponent = !isFullPageLayout ? <SettingsPanel /> : '';
  let UserItemsPAnelComponent = !isFullPageLayout ? <UserItemsPanel /> : '';
  let footerComponent = !isFullPageLayout ? <Footer /> : '';

  let conditionNavbarComponent = location.pathname === "/cart/chekout" || location.pathname === "/user-pages/settings" ? <Navbar authentification={tokenBool} role={roleBool} about={aboutMySelf} rightSidebarBool={false} /> : '';

  let conditionFooterComponent = location.pathname === "/cart/chekout" || location.pathname === "/user-pages/settings" ? <Footer /> : '';


  const onRouteChanged = (location) => {
    let fullPageLayoutRoutes = ['/user-pages/sign-in', '/user-pages/sign-up', '/user-pages/settings', '/user-pages/lockscreen', '/cart/chekout', '/error-pages/error-404', '/error-pages/error-500', '/general-pages/landing-page'];
    let b = true;
    for (var i = 0; i < fullPageLayoutRoutes.length; i++) {
      if (location === fullPageLayoutRoutes[i]) {
        setIsFullPageLayout(true);
        document.querySelector('.page-body-wrapper').classList.add('full-page-wrapper');
        b = false;
        break;
      }
    }

    if (b) {
      setIsFullPageLayout(false);
      document.querySelector('.page-body-wrapper').classList.remove('full-page-wrapper');
    }
  }


  return (
    <div className="container-scroller">
      { navbarComponent}
      {conditionNavbarComponent}
      <div className="container-fluid page-body-wrapper">
        {sidebarComponent}
        <div className="main-panel">
          <div className="content-wrapper p-3 p-md-5">
            <AppRoutes authentification={tokenBool} role={roleBool} />
            {SettingsPanelComponent}
            {UserItemsPAnelComponent}
          </div>
          {footerComponent}
          {conditionFooterComponent}
        </div>
      </div>
    </div>
  )
}

export default App;