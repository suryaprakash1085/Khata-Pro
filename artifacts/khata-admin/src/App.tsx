import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, Redirect } from 'wouter';
import { AuthRoute } from '@/components/auth-route';

// Pages
import Login from '@/pages/login';
import Dashboard from '@/pages/dashboard';
import Businesses from '@/pages/businesses';
import BusinessDetail from '@/pages/business-detail';
import UsersList from '@/pages/users';
import Subscriptions from '@/pages/subscriptions';
import Reports from '@/pages/reports';
import Reminders from '@/pages/reminders';
import AuditLogs from '@/pages/audit-logs';
import Broadcast from '@/pages/broadcast';
import Settings from '@/pages/settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* Public Route */}
      <Route path="/login" component={Login} />

      {/* Redirect Root to Dashboard */}
      <Route path="/">
        <Redirect to="/dashboard" />
      </Route>

      {/* Protected App Routes */}
      <Route path="/dashboard">
        <AuthRoute><Dashboard /></AuthRoute>
      </Route>
      
      <Route path="/businesses/:id">
        <AuthRoute><BusinessDetail /></AuthRoute>
      </Route>
      
      <Route path="/businesses">
        <AuthRoute><Businesses /></AuthRoute>
      </Route>

      <Route path="/users">
        <AuthRoute><UsersList /></AuthRoute>
      </Route>

      <Route path="/subscriptions">
        <AuthRoute><Subscriptions /></AuthRoute>
      </Route>

      <Route path="/reports">
        <AuthRoute><Reports /></AuthRoute>
      </Route>

      <Route path="/reminders">
        <AuthRoute><Reminders /></AuthRoute>
      </Route>

      <Route path="/audit-logs">
        <AuthRoute><AuditLogs /></AuthRoute>
      </Route>

      <Route path="/broadcast">
        <AuthRoute><Broadcast /></AuthRoute>
      </Route>

      <Route path="/settings">
        <AuthRoute><Settings /></AuthRoute>
      </Route>

      {/* 404 Route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
