import React from "react"
import { Navigate } from "react-router-dom"
// Dashboard
import ExirDashboard_EndUser from "../pages/Dashboard/ExirDashboard_EndUser"
// LetterSerial
import LetterSerialForm from "../pages/Forms-LetterSerial/LetterSerial-Form"
import LetterSerialView from "../pages/Forms-LetterSerial/LetterSerial-view"

// LetterTemplate
import LetterTemplateForm from "../pages/Forms-LetterTemplate/LetterTemplate-Form"
import LetterTemplateView from "../pages/Forms-LetterTemplate/LetterTemplate-view"

// letter pages
import LetterCartabl from "../pages/Forms-Letter/LetterCartabl"
import LetterInbox from "../pages/Forms-Letter/LetterInbox"
import LetterOutbox from "../pages/Forms-Letter/LetterOutbox"
import LetterCreate from "../pages/Forms-Letter/LetterCreate"
import LetterDetail from "../pages/Forms-Letter/LetterDetail"
import InternalLetters from "../pages/Forms-Letter/InternalLetter"
import IssuedLetters from "../pages/Forms-Letter/IssuedLetter"
import LetterEdit from "../pages/Forms-Letter/LetterEdit"

// Authentication related pages
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

// Inner Authentication
import Login1 from "../pages/AuthenticationInner/Login"
import AdminLogin from "../pages/AuthenticationInner/AdminLogin"
import Register1 from "../pages/AuthenticationInner/Register"
import Register2 from "../pages/AuthenticationInner/Register2"
import Recoverpw from "../pages/AuthenticationInner/Recoverpw"
import Recoverpw2 from "../pages/AuthenticationInner/Recoverpw2"
import ForgetPwd1 from "../pages/AuthenticationInner/ForgetPassword"
import ForgetPwd2 from "../pages/AuthenticationInner/ForgetPassword2"
import LockScreen from "../pages/AuthenticationInner/auth-lock-screen"
import LockScreen2 from "../pages/AuthenticationInner/auth-lock-screen-2"
import ConfirmMail from "../pages/AuthenticationInner/page-confirm-mail"
import ConfirmMail2 from "../pages/AuthenticationInner/page-confirm-mail-2"
import EmailVerification from "../pages/AuthenticationInner/auth-email-verification"
import EmailVerification2 from "../pages/AuthenticationInner/auth-email-verification-2"
import TwostepVerification from "../pages/AuthenticationInner/auth-two-step-verification"
import TwostepVerification2 from "../pages/AuthenticationInner/auth-two-step-verification-2"

// Dashboard
import DashboardSaas from "../pages/Dashboard-saas/index"
import DashboardCrypto from "../pages/Dashboard-crypto/index"
import Blog from "../pages/Dashboard-Blog/index"
import DashboardJob from "../pages/DashboardJob/index"

//Correspondence
import NewCorrespondence from "../pages/Tables/NewCorrespondence"
import Correspondence from "../pages/Tables/Correspondence"
import Correspondenceindex from "../pages/Tables/CorrespondenceDetails/Correspondenceindex"
import TracingCorrespondence from "../pages/Tables/TracingCorrespondenceindex"

//Tables
import BasicTables from "../pages/Tables/BasicTables"
import DatatableTables from "../pages/Tables/DatatableTables"
import ResponsiveTablesExir from "../pages/Tables/ResponsiveTables-exir"
import ResponsiveTables from "../pages/Tables/ResponsiveTables"
import DragDropTables from "../pages/Tables/DragDropTables"
// ***
import DatatableInboxMessages from "../pages/Tables/DatatableTablesInboxMessages"
import DatatableOutboxMessages from "../pages/Tables/DatatableTables-outboxMessages"
import DataTablesInboxLetters from "../pages/Tables/DataTablesInboxLetters"
import DataTablesOutboxLetters from "../pages/Tables/DataTablesOutboxLetters"
import DataTablesDraftLetters from "../pages/Tables/DataTablesDraftLetters"
import DatatableDraftMessages from "../pages/Tables/DatatableTablesDraftMessages"
import DatatableNotifications from "../pages/Tables/DatatableTablesNotifications"
import DetailNotification from "../pages/Tables/DetailNotification"
import DraftLetter from "../pages/Tables/EditDraftLetter"
import TracingLetter from "../pages/Tables/TracingLetter"
import ViewLinkedLetter from "../pages/Tables/CorrespondenceDetails/tryDetailLetter"
//Messges
import NewMessage from "../pages/Tables/NewMessage"
import ViewMessages from "../pages/Tables/ViewMessages"
import DraftMessage from "../pages/Tables/DraftMessage"
import DatatableReportMessages from "../pages/Tables/DatatableTablesReportMessages"
import DataTablesReportLetters from "../pages/Tables/DataTablesReportLetters"

// dash
import ExirDashboard from "../pages/Dashboard/ExirDashboard"
import UserProfileExir from "../pages/Authentication/user-profileExir"
import DatatableHeaderNotifications from "../pages/Tables/DatatableTablesHeaderNotifications"

//Pages
import PagesStarter from "../pages/Utility/pages-starter"
import PagesMaintenance from "../pages/Utility/pages-maintenance"
import PagesComingsoon from "../pages/Utility/pages-comingsoon"
import PagesTimeline from "../pages/Utility/pages-timeline"
import PagesFaqs from "../pages/Utility/pages-faqs"
import PagesPricing from "../pages/Utility/pages-pricing"
import Pages404 from "../pages/Utility/pages-404"
import Pages500 from "../pages/Utility/pages-500"

// user
import CreateUser from "../pages/User/CreateUser"
import ListUsers from "../pages/User/ListUsers"
import EditUser from "../pages/User/EditUser"
// userCompany
import CreateUserCompany from "../pages/UserCompany/CreateUserCompany"
import ListUserCompanies from "../pages/UserCompany/ListUserCompanies"
// position
import CreatePosition from "../pages/Forms-Position/CreatePosition"
// company
import CreateCompany from "../pages/Company/CreateCompany"
import ListCompanies from "../pages/Company/ListCompanies"

const authProtectedRoutes = [
  { path: "/dashboard-saas", component: <DashboardSaas /> },
  { path: "/dashboard-crypto", component: <DashboardCrypto /> },
  { path: "/blog", component: <Blog /> },
  { path: "/dashboard-job", component: <DashboardJob /> },

  // user
  { path: "/create-user", component: <CreateUser /> },
  { path: "/users", component: <ListUsers /> },
  { path: "/edit-user/:id", component: <EditUser /> },
  // company
  { path: "/createCompany", component: <CreateCompany /> },
  { path: "/list-company", component: <ListCompanies /> },
  // user compsny
  { path: "/create-user-company", component: <CreateUserCompany /> },
  { path: "/list-user-company", component: <ListUserCompanies /> },
  // position
  { path: "/create-position", component: <CreatePosition /> },

  // Correspondence
  { path: "/tables-newCorrespondence", component: <NewCorrespondence /> },
  { path: "/tables-correspondence", component: <Correspondence /> },
  { path: "/Correspondenceindex", component: <Correspondenceindex /> },
  { path: "/TracingCorrespondence", component: <TracingCorrespondence /> },

  // Tables
  { path: "/tables-basic", component: <BasicTables /> },
  { path: "/tables-datatable", component: <DatatableTables /> },
  { path: "/tables-responsiveExir", component: <ResponsiveTablesExir /> },
  { path: "/tables-responsive", component: <ResponsiveTables /> },
  { path: "/tables-dragndrop", component: <DragDropTables /> },

  //modules
  { path: "/dashboard1", component: <ExirDashboard /> },
  { path: "/profile", component: <UserProfileExir /> },
  { path: "/notif", component: <DatatableNotifications /> },
  { path: "/notif", component: <DatatableNotifications /> },
  { path: "/notif/:id", component: <DetailNotification /> },
  { path: "/notifications", component: <DatatableHeaderNotifications /> },
  // Dashboard
  { path: "/dashboard", component: <ExirDashboard_EndUser /> },
  //LetterSerial
  { path: "/letterSerialForm", component: <LetterSerialForm /> },
  { path: "/letterSerialView", component: <LetterSerialView /> },

  // letterTemplate
  { path: "/letterTemplatelForm", component: <LetterTemplateForm /> },
  { path: "/letterTemplateView", component: <LetterTemplateView /> },

  // letter list
  { path: "/letterCartabl", component: <LetterCartabl /> },
  { path: "/letterInbox", component: <LetterInbox /> },
  { path: "/letterOutbox", component: <LetterOutbox /> },
  { path: "/internalLetters", component: <InternalLetters /> }, //TODO
  { path: "/issuedLetters", component: <IssuedLetters /> }, //TODO

  // create letter
  { path: "/letternew", component: <LetterCreate /> },
  // edit letter
  { path: "/letter/edit/:id", component: <LetterEdit /> },
  // detail letter
  { path: "/letterDetail/:id", component: <LetterDetail /> },
  // detail letter from cartable
  { path: "/letterDetail/:id/:trackId", component:<LetterDetail />},

  // Letter
  { path: "/new-letter", component: <NewCorrespondence /> },
  { path: "/inbox-letters", component: <DataTablesInboxLetters /> },
  { path: "/outbox-letters", component: <DataTablesOutboxLetters /> },
  { path: "/draft-letters", component: <DataTablesDraftLetters /> },
  { path: "/draft-letter/:id", component: <DraftLetter /> },
  { path: "/detail-letter/:id", component: <Correspondenceindex /> },
  { path: "/view-linked-letter/:id", component: <ViewLinkedLetter /> },
  { path: "/tracing-letter/:id", component: <TracingLetter /> },
  { path: "/report-letters", component: <DataTablesReportLetters /> },
  // Messages
  { path: "/new-message", component: <NewMessage /> },
  { path: "/inbox-messages", component: <DatatableInboxMessages /> },
  { path: "/outbox-messages", component: <DatatableOutboxMessages /> },
  { path: "/draft-messages", component: <DatatableDraftMessages /> },
  { path: "/view-messages/:id", component: <ViewMessages /> },
  { path: "/draft-message/:id", component: <DraftMessage /> },
  { path: "/report-messages", component: <DatatableReportMessages /> },


  //Utility
  { path: "/pages-starter", component: <PagesStarter /> },
  { path: "/pages-timeline", component: <PagesTimeline /> },
  { path: "/pages-faqs", component: <PagesFaqs /> },
  { path: "/pages-pricing", component: <PagesPricing /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/login" />,
  },
]

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  // { path: "/login", component: <Login /> },
  { path: "/login", component: <Login1 /> },
  { path: "/admin", component: <AdminLogin /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },

  { path: "/pages-maintenance", component: <PagesMaintenance /> },
  { path: "/pages-comingsoon", component: <PagesComingsoon /> },
  { path: "/pages-404", component: <Pages404 /> },
  { path: "/pages-500", component: <Pages500 /> },

  // Authentication Inner
  { path: "/pages-login1", component: <Login1 /> },
  //{ path: "/pages-login-2", component: <Login2 /> },
  { path: "/pages-register", component: <Register1 /> },
  { path: "/pages-register-2", component: <Register2 /> },
  { path: "/page-recoverpw", component: <Recoverpw /> },
  { path: "/page-recoverpw-2", component: <Recoverpw2 /> },
  { path: "/pages-forgot-pwd", component: <ForgetPwd1 /> },
  { path: "/auth-recoverpw-2", component: <ForgetPwd2 /> },
  { path: "/auth-lock-screen", component: <LockScreen /> },
  { path: "/auth-lock-screen-2", component: <LockScreen2 /> },
  { path: "/page-confirm-mail", component: <ConfirmMail /> },
  { path: "/page-confirm-mail-2", component: <ConfirmMail2 /> },
  { path: "/auth-email-verification", component: <EmailVerification /> },
  { path: "/auth-email-verification-2", component: <EmailVerification2 /> },
  { path: "/auth-two-step-verification", component: <TwostepVerification /> },
  {
    path: "/auth-two-step-verification-2",
    component: <TwostepVerification2 />,
  },

  { path: "/*", component: <Pages404 /> },
]

export { authProtectedRoutes, publicRoutes }
