import React from 'react';
// import { Router, Route, Switch, Redirect } from 'react-router';
import { Route, Router, Switch, Redirect } from "react-router-dom";
import { history } from '../helpers/history';
import { PrivateRoute } from '../components/PrivateRoutes/PrivateRoutes';
import { Home } from '../containers/Home/Home';
import { SubmitPhone } from '../containers/Signup/SubmitPhone/SubmitPhone';
import { SubmitEmail } from '../containers/Signup/SubmitEmail/SubmitEmail';
import { VerifyPhone } from '../containers/Signup/VerifyPhone/VerifyPhone';
import { VerifyEmail } from '../containers/Signup/VerifyEmail/VerifyEmail';
import { RegisterAccount } from '../containers/Signup/RegisterAccount/RegisterAccount';
import { Chat } from '../containers/Chat/Chat';
import { ChatContact } from '../containers/Chat/ChatContact';
import { AccountSetting } from '../containers/Chat/AccountSetting/AccountSetting';
import { ContactLrgProfile } from '../containers/Chat/ContactProfile/ContactLrgProfile/ContactLrgProfile';
import ViewProfile  from '../containers/ViewProfile/index';
import { NotFound } from '../containers/notFound/notFound';
import LandingMain from '../containers/LandingHome/index';
import { Sticker } from '../containers/Chat/Stickers/index';
import { NotificationSetting } from '../containers/Chat/AccountSetting/NotificationSetting/NotificationSetting';
import Registration from '../containers/LandingHome/Registration/Registration';



function Routes() {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/submitphone" component={SubmitPhone} />
        <Route exact path="/submitemail" component={SubmitEmail} />
        <Route exact path="/verifyphone" component={VerifyPhone} />
        <Route exact path="/verifyemail" component={VerifyEmail} />
        <Route exact path="/register" component={RegisterAccount} />
        <Route exact path="/viewprofile" component={ViewProfile} />
        <Route exact path="/home" component={Home}/>
        <Route exact path="/chat" component={Chat}/>
        <PrivateRoute exact path="/chat" component={Chat} />
        <PrivateRoute path="/conversation/:id" component={ChatContact} />
        <PrivateRoute exact path="/contact/:id/profile" component={ContactLrgProfile} />
        <PrivateRoute path="/setting" component={AccountSetting} />
        <PrivateRoute path="/sticker" component={Sticker} />
        <Route path="/" component={LandingMain}/>
        {/*<Route path="/main/registration" component={LandingMain} />*/}
        {/*<Route exact path="/registration" component={Registration} />*/}
        <Route component={NotFound}/>
      </Switch>
    </Router>
  )
}

export default Routes
