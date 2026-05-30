import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Join from "./pages/Join";
import Checkout from "./pages/Checkout";
import DemoPayment from "./pages/DemoPayment";
import AuthSetup from "./pages/AuthSetup";
import Onboarding from "./pages/Onboarding";
import DashboardHome from "./pages/DashboardHome";
import DashboardWallet from "./pages/DashboardWallet";
import DashboardReferrals from "./pages/DashboardReferrals";
import DashboardTicket from "./pages/DashboardTicket";
import DashboardCommunity from "./pages/DashboardCommunity";
import DashboardSettings from "./pages/DashboardSettings";
import AdminOverview from "./pages/AdminOverview";
import AdminUsers from "./pages/AdminUsers";
import AdminPayments from "./pages/AdminPayments";
import AdminAffiliates from "./pages/AdminAffiliates";
import AdminEvents from "./pages/AdminEvents";
import AdminContent from "./pages/AdminContent";
import BecomePartner from "./pages/BecomePartner";
import BecomeAffiliate from "./pages/BecomeAffiliate";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/join" element={<Join />} />
      <Route path="/checkout/:tier" element={<Checkout />} />
      <Route path="/demo-payment" element={<DemoPayment />} />
      <Route path="/auth/setup" element={<AuthSetup />} />
      <Route path="/become-partner" element={<BecomePartner />} />
      <Route path="/become-affiliate" element={<BecomeAffiliate />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Onboarding */}
      <Route path="/onboarding" element={<Onboarding />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<DashboardHome />} />
      <Route path="/dashboard/wallet" element={<DashboardWallet />} />
      <Route path="/dashboard/referrals" element={<DashboardReferrals />} />
      <Route path="/dashboard/ticket" element={<DashboardTicket />} />
      <Route path="/dashboard/community" element={<DashboardCommunity />} />
      <Route path="/dashboard/settings" element={<DashboardSettings />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminOverview />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/payments" element={<AdminPayments />} />
      <Route path="/admin/affiliates" element={<AdminAffiliates />} />
      <Route path="/admin/events" element={<AdminEvents />} />
      <Route path="/admin/content" element={<AdminContent />} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
