import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";

import HomePage from "../pages/renderer/LandingPage.jsx";
import InboxPage from "../pages/user/InboxPage.jsx";
import RequireRole from "../components/auth/RequireRole.jsx";
import DashboardLayout from "../layout/DashboardLayout.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import Login from "../pages/Login.jsx";
import DomainsPage from "../pages/admin/DomainsPage.jsx";
import MailboxesPage from "../pages/admin/MailboxesPage.jsx";
import SettingsPage from "../pages/admin/SettingsPage.jsx";
import BillingPage from "../pages/admin/BillingPage.jsx";
import RendererPageLayout from "../layout/RendererPageLayout.jsx";
import Register from "../pages/Register.jsx";
import AllMailsPage from "../pages/user/AllMailsPage.jsx";
import SentPage from "../pages/user/SentPage.jsx";
import StarredPage from "../pages/user/StarredPage.jsx";
import ArchivePage from "../pages/user/ArchivePage.jsx";
import TrashPage from "../pages/user/TrashPage.jsx";
import EmailDetailsPage from "../pages/user/EmailDetailsPage.jsx";
import ToolsPage from "../pages/superadmin/ToolsPage.jsx";
import SystemLogsPage from "../pages/superadmin/SystemLogsPage.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import ContactPage from "../pages/ContactPage.jsx";
import VerifySignup from "../pages/VerifySignup.jsx";
import TestimonialsPage from "../pages/superadmin/TestimonialsPage.jsx";
import Contact from "../pages/superadmin/Contact.jsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* public routes */}
      <Route path="/" element={<RendererPageLayout />}>
        <Route index={true} element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>
      <Route path="/signup-verify" element={<VerifySignup />} />

      {/* protected routes */}
      <Route element={<RequireRole allowedRoles={["USER"]} />}>
        <Route path="/u" element={<DashboardLayout />}>
          <Route index element={<Navigate to="inbox" replace />} />
          <Route path="inbox" element={<InboxPage />} />
          <Route path="all-mails" element={<AllMailsPage />} />
          <Route path="sent" element={<SentPage />} />
          <Route path="starred" element={<StarredPage />} />
          <Route path="trash" element={<TrashPage />} />
          <Route path="archive" element={<ArchivePage />} />
          <Route path="profile" element={<SettingsPage />} />

          {/* detail pages  */}
          <Route path="inbox/detail/:id" element={<EmailDetailsPage />} />
        </Route>
      </Route>

      <Route element={<RequireRole allowedRoles={["ADMIN"]} />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="domains" element={<DomainsPage />} />
          <Route path="mailboxes" element={<MailboxesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="billing" element={<BillingPage />} />
        </Route>
      </Route>

      <Route element={<RequireRole allowedRoles={["SUPER_ADMIN"]} />}>
        <Route path="/superadmin" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="domains" element={<DomainsPage />} />
          <Route path="mailboxes" element={<MailboxesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="logs" element={<SystemLogsPage />} />
          <Route path="tools" element={<ToolsPage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </>
  )
);
