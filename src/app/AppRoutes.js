import React, { Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Spinner from '../app/shared/Spinner';

const Home = lazy(() => import('./dashboard/Home'));
const Dashboard = lazy(() => import('./dashboard/DashboardCopy'));

const Category = lazy(() => import('./category/Category'));

const NewOrders = lazy(() => import('./order/NewOrders'));
const DeliveryOrders = lazy(() => import('./order/DeliveryOrders'));
const ReceiveOrders = lazy(() => import('./order/ReceiveOrders'));

const Products = lazy(() => import('./product/Products'));
const AddProducts = lazy(() => import('./product/AddProduct'));
const EditProducts = lazy(() => import('./product/EditProduct'));

const Members = lazy(() => import('./member/Members'));


const Buttons = lazy(() => import('./basic-ui/Buttons'));
const Dropdowns = lazy(() => import('./basic-ui/Dropdowns'));
const Typography = lazy(() => import('./basic-ui/Typography'));

const BasicElements = lazy(() => import('./form-elements/BasicElements'));

const BasicTable = lazy(() => import('./tables/BasicTable'));



const Mdi = lazy(() => import('./icons/Mdi'));


const ChartJs = lazy(() => import('./charts/ChartJs'));

const Error404 = lazy(() => import('./error-pages/Error404'));
const Error500 = lazy(() => import('./error-pages/Error500'));

const Login = lazy(() => import('./user-pages/Login'));
const Register1 = lazy(() => import('./user-pages/Register'));
const Lockscreen = lazy(() => import('./user-pages/Lockscreen'));
const Settings = lazy(() => import('./user-pages/Settings'));
const Chekout = lazy(() => import('./card/Chekout'));

const BlankPage = lazy(() => import('./general-pages/BlankPage'));


const AppRoutes = ({ authentification, role}) => {

  if (role) {

    return (
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/categories/category" component={Category} />

          <Route path="/orders/new-orders">
            <NewOrders/>
          </Route>
          <Route path="/orders/delivery-orders" component={DeliveryOrders} />
          <Route path="/orders/receive-orders" component={ReceiveOrders} />

          <Route path="/products/get-products" component={Products} />
          <Route path="/products/add-product" component={AddProducts} />
          <Route path="/products/edit-product" component={EditProducts} />

          <Route path="/member/members" component={Members} />

          {/* <Route path="/basic-ui/buttons" component={Buttons} />
          <Route path="/basic-ui/dropdowns" component={Dropdowns} />
          <Route path="/basic-ui/typography" component={Typography} />
          <Route path="/form-Elements/basic-elements" component={BasicElements} />
          <Route path="/tables/basic-table" component={BasicTable} /> */}
          <Route path="/icons/mdi" component={Mdi} />
          {/* <Route path="/charts/chart-js" component={ChartJs} />
          <Route path="/general-pages/blank-page" component={BlankPage} /> */}

          <Route path="/user-pages/sign-in" component={Login} />
          <Route path="/user-pages/sign-up" component={Register1} />
          <Route path="/user-pages/lockscreen" component={Lockscreen} />
          <Route path="/user-pages/settings" component={Settings} />

          <Route path="/error-pages/error-404" component={Error404} />
          <Route path="/error-pages/error-500" component={Error500} />

          <Redirect to="/dashboard" />
        </Switch>
      </Suspense>
    )
  } else {
    return (
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route path="/home/:id" ><Home authentification={authentification} /></Route>
          <Route path="/cart/chekout" component={Chekout} />

          <Route path="/user-pages/sign-in" component={Login} />
          <Route path="/user-pages/sign-up" component={Register1} />
          <Route path="/user-pages/lockscreen" component={Lockscreen} />
          <Route path="/user-pages/settings" component={Settings} />

          <Route path="/error-pages/error-404" component={Error404} />
          <Route path="/error-pages/error-500" component={Error500} />

          <Redirect to="/home/1" />
        </Switch>
      </Suspense>
    )
  }
  // return (
  //   <Suspense fallback={<Spinner />}>
  //     <Switch>

  //       <Route path="/user-pages/sign-in" component={Login} />
  //       <Route path="/user-pages/sign-up" component={Register1} />
  //       <Route path="/user-pages/lockscreen" component={Lockscreen} />
  //       <Route path="/user-pages/settings" component={Settings} />

  //       <Route path="/error-pages/error-404" component={Error404} />
  //       <Route path="/error-pages/error-500" component={Error500} />

  //       {
  //         role ? (
  //           <>
  //             <Route path="/dashboard" component={Dashboard} />
  //             <Route path="/basic-ui/buttons" component={Buttons} />
  //             <Route path="/basic-ui/dropdowns" component={Dropdowns} />
  //             <Route path="/basic-ui/typography" component={Typography} />
  //             <Route path="/form-Elements/basic-elements" component={BasicElements} />
  //             <Route path="/tables/basic-table" component={BasicTable} />
  //             <Route path="/icons/mdi" component={Mdi} />
  //             <Route path="/charts/chart-js" component={ChartJs} />
  //             <Route path="/general-pages/blank-page" component={BlankPage} />

  //             <Redirect to="/dashboard" />
  //           </>
  //         ) : (

  //           <>
  //             <Route path="/home/:id" >
  //               <Home authentification={authentification} />
  //             </Route>
  //             <Route path="/cart/chekout" component={Chekout} />

  //             <Redirect to="/home/1" />
  //           </>
  //         )
  //       }

  //     </Switch>
  //   </Suspense>
  // );

}

export default AppRoutes;