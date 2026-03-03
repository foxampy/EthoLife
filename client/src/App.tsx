import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingScreen from "./components/LoadingScreen";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { BottomNavigation } from "./components/BottomNavigation";
import { Header } from "./components/Header";
import { TelegramAuth } from "./components/TelegramAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Presentation from "./pages/Presentation";
import Dashboard from "./pages/Dashboard";
import DashboardV2 from "./pages/DashboardV2";
import HealthCenter from "./pages/HealthCenter";
import MariaDashboard from "./pages/MariaDashboard";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import Habits from "./pages/Habits";
import Journal from "./pages/Journal";
import AIChat from "./pages/AIChat";
import InteractiveDemo from "./pages/InteractiveDemo";
import Medicine from "./pages/Medicine";
import Nutrition from "./pages/Nutrition";
import Movement from "./pages/Movement";
import Psychology from "./pages/Psychology";
import Sleep from "./pages/Sleep";
import MovementHealth from "./pages/health/MovementHealth";
import NutritionHealth from "./pages/health/NutritionHealth";
import SleepHealth from "./pages/health/SleepHealth";
import PsychologyHealth from "./pages/health/PsychologyHealth";
import MedicineHealth from "./pages/health/MedicineHealth";
import RelationshipsHealth from "./pages/health/RelationshipsHealth";
import HabitsHealth from "./pages/health/HabitsHealth";
import HealthModules from "./pages/HealthModules";

// New Health Hub Modules
import HealthDashboard from "./pages/health/HealthDashboard";
import NutritionModule from "./pages/health/NutritionModule";
import MovementModule from "./pages/health/MovementModule";
import SleepModule from "./pages/health/SleepModule";
import PsychologyModule from "./pages/health/PsychologyModule";
import MedicineModule from "./pages/health/MedicineModule";
import RelationshipsModule from "./pages/health/RelationshipsModule";
import HabitsModule from "./pages/health/HabitsModule";
import Relationships from "./pages/Relationships";
import Spirituality from "./pages/Spirituality";
import Systematization from "./pages/Systematization";
import EconomicModel from "./pages/EconomicModel";
import Roadmap from "./pages/Roadmap";
import InvestmentProposal from "./pages/InvestmentProposal";
import AiPlanner from "./pages/AiPlanner";
import Tokenomics from "./pages/Tokenomics";
import Whitepaper from "./pages/Whitepaper";
import Landing from "./pages/Landing";
import Shop from "./pages/Shop";
import Documents from "./pages/Documents";
import Centers from "./pages/Centers";
import Map from "./pages/Map";
import Friends from "./pages/social/Friends";
import Messages from "./pages/social/Messages";
import Specialists from "./pages/social/Specialists";
import SpecialistsCatalog from "./pages/SpecialistsCatalog";
import SpecialistProfile from "./pages/SpecialistProfile";
import Booking from "./pages/Booking";
import Onboarding from "./pages/Onboarding";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GoogleCallback from "./pages/GoogleCallback";
import News from "./pages/News";
import NewStyleLanding from "./pages/newstyle";
import LandingV2 from "./pages/LandingV2";
import LandingPage from "./pages/LandingPage";
import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import SpecialistOffer from "./pages/SpecialistOffer";
import CenterOffer from "./pages/CenterOffer";
import CenterCRM from "./pages/CenterCRM";
import UserProfile from "./pages/UserProfile";
import Wallet from "./pages/Wallet";
import CryptoPayment from "./pages/CryptoPayment";
import CreatePost from "./pages/CreatePost";
import CreateStory from "./pages/CreateStory";
import FullPageList from "./pages/FullPageList";
import Library from "./pages/Library";
import Posture from "./pages/Posture";
import Integrations from "./pages/Integrations";
import Researchers from "./pages/Researchers";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import LandingsPage from "./pages/LandingsPage";
import DeepOnboarding from "./pages/DeepOnboarding";
import AdminDashboard from "./pages/admin/Dashboard";
import Features from "./pages/Features";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import FAQ from "./pages/FAQ";
import Support from "./pages/Support";
import Privacy from "./pages/Privacy";
import ProjectsProducts from "./pages/ProjectsProducts";
import DailyAssistant from "./pages/DailyAssistant";
import CertificationVerification from "./pages/CertificationVerification";
import SubscriptionsCertificates from "./pages/SubscriptionsCertificates";
import ProjectStatus from "./pages/ProjectStatus";

function Router() {
  return (
    <Switch>
      {/* Публичные страницы */}
      <Route path={"/"} component={LandingPage} />
      <Route path={"/landings"} component={LandingsPage} />
      <Route path={"/landing"} component={Landing} />
      <Route path={"/v2"} component={LandingV2} />
      <Route path={"/landing-new"} component={LandingPage} />
      <Route path={"/newstyle"} component={NewStyleLanding} />
      <Route path={"/presentation"} component={Presentation} />
      <Route path={"/whitepaper"} component={Whitepaper} />
      <Route path={"/roadmap"} component={Roadmap} />
      <Route path={"/tokenomics"} component={Tokenomics} />
      <Route path={"/economic-model"} component={EconomicModel} />
      <Route path={"/investment"} component={InvestmentProposal} />
      <Route path={"/pricing"} component={Pricing} />
      
      {/* Info Pages */}
      <Route path={"/features"} component={Features} />
      <Route path={"/about"} component={About} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/help"} component={Help} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/support"} component={Support} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/projects"} component={ProjectsProducts} />
      <Route path={"/daily-assistant"} component={DailyAssistant} />
      <Route path={"/certification"} component={CertificationVerification} />
      <Route path={"/subscriptions"} component={SubscriptionsCertificates} />
      <Route path={"/project-status"} component={ProjectStatus} />
      
      <Route path={"/login"} component={Login} />
      <Route path={"/register"} component={Register} />
      <Route path={"/auth/callback"} component={GoogleCallback} />
      <Route path={"/telegram-auth"} component={TelegramAuth} />
      
      {/* Onboarding */}
      <Route path={"/onboarding"} component={DeepOnboarding} />
      
      {/* Защищённые маршруты - Пользователь */}
      <Route path={"/dashboard"}>
        <ProtectedRoute><DashboardV2 /></ProtectedRoute>
      </Route>
      <Route path={"/dashboard-v1"}>
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      </Route>
      <Route path={"/health-center"}>
        <ProtectedRoute><HealthCenter /></ProtectedRoute>
      </Route>
      <Route path={"/dashboard/maria"}>
        <ProtectedRoute><MariaDashboard /></ProtectedRoute>
      </Route>
      <Route path={"/profile"}>
        <ProtectedRoute><Profile /></ProtectedRoute>
      </Route>
      <Route path={"/account"}>
        <ProtectedRoute><Account /></ProtectedRoute>
      </Route>
      <Route path={"/settings"}>
        <ProtectedRoute><Account /></ProtectedRoute>
      </Route>
      <Route path={"/calendar"}>
        <ProtectedRoute><Calendar /></ProtectedRoute>
      </Route>
      <Route path={"/habits"}>
        <ProtectedRoute><Habits /></ProtectedRoute>
      </Route>
      <Route path={"/journal"}>
        <ProtectedRoute><Journal /></ProtectedRoute>
      </Route>
      <Route path={"/ai-chat"}>
        <ProtectedRoute><AIChat /></ProtectedRoute>
      </Route>
      <Route path={"/wallet"}>
        <ProtectedRoute><Wallet /></ProtectedRoute>
      </Route>
      <Route path={"/documents"}>
        <ProtectedRoute><Documents /></ProtectedRoute>
      </Route>
      <Route path={"/shop"}>
        <ProtectedRoute><Shop /></ProtectedRoute>
      </Route>
      <Route path={"/map"}>
        <ProtectedRoute><Map /></ProtectedRoute>
      </Route>
      <Route path={"/news"}>
        <ProtectedRoute><News /></ProtectedRoute>
      </Route>
      <Route path={"/create-post"}>
        <ProtectedRoute><CreatePost /></ProtectedRoute>
      </Route>
      <Route path={"/create-story"}>
        <ProtectedRoute><CreateStory /></ProtectedRoute>
      </Route>
      <Route path={"/library"}>
        <ProtectedRoute><Library /></ProtectedRoute>
      </Route>
      <Route path={"/posture"}>
        <ProtectedRoute><Posture /></ProtectedRoute>
      </Route>
      <Route path={"/integrations"}>
        <ProtectedRoute><Integrations /></ProtectedRoute>
      </Route>
      <Route path={"/researchers"}>
        <ProtectedRoute><Researchers /></ProtectedRoute>
      </Route>
      
      {/* Модули здоровья */}
      <Route path={"/health"}>
        <ProtectedRoute><HealthDashboard /></ProtectedRoute>
      </Route>
      <Route path={"/health/movement"}>
        <ProtectedRoute><MovementHealth /></ProtectedRoute>
      </Route>
      <Route path={"/health/nutrition"}>
        <ProtectedRoute><NutritionHealth /></ProtectedRoute>
      </Route>
      <Route path={"/health/sleep"}>
        <ProtectedRoute><SleepHealth /></ProtectedRoute>
      </Route>
      <Route path={"/health/psychology"}>
        <ProtectedRoute><PsychologyHealth /></ProtectedRoute>
      </Route>
      <Route path={"/health/medicine"}>
        <ProtectedRoute><MedicineHealth /></ProtectedRoute>
      </Route>
      <Route path={"/health/relationships"}>
        <ProtectedRoute><RelationshipsHealth /></ProtectedRoute>
      </Route>
      <Route path={"/health/habits"}>
        <ProtectedRoute><HabitsHealth /></ProtectedRoute>
      </Route>
      <Route path={"/health/nutrition/v2"}>
        <ProtectedRoute><NutritionModule /></ProtectedRoute>
      </Route>
      <Route path={"/health/movement/v2"}>
        <ProtectedRoute><MovementModule /></ProtectedRoute>
      </Route>
      <Route path={"/health/sleep/v2"}>
        <ProtectedRoute><SleepModule /></ProtectedRoute>
      </Route>
      <Route path={"/health/psychology/v2"}>
        <ProtectedRoute><PsychologyModule /></ProtectedRoute>
      </Route>
      <Route path={"/health/medicine/v2"}>
        <ProtectedRoute><MedicineModule /></ProtectedRoute>
      </Route>
      <Route path={"/health/relationships/v2"}>
        <ProtectedRoute><RelationshipsModule /></ProtectedRoute>
      </Route>
      <Route path={"/health/habits/v2"}>
        <ProtectedRoute><HabitsModule /></ProtectedRoute>
      </Route>
      <Route path={"/health/:moduleId"}>
        <ProtectedRoute><HealthModules /></ProtectedRoute>
      </Route>
      
      {/* Социальные функции */}
      <Route path={"/social/friends"}>
        <ProtectedRoute><Friends /></ProtectedRoute>
      </Route>
      <Route path={"/social/messages"}>
        <ProtectedRoute><Messages /></ProtectedRoute>
      </Route>
      <Route path={"/u/:username"}>
        <ProtectedRoute><UserProfile /></ProtectedRoute>
      </Route>
      
      {/* Специалисты - публичные */}
      <Route path={"/specialists"} component={SpecialistsCatalog} />
      <Route path={"/specialist/:username"} component={SpecialistProfile} />
      <Route path={"/specialist/:username/book"}>
        <ProtectedRoute><Booking /></ProtectedRoute>
      </Route>
      <Route path={"/specialists-old"} component={Specialists} />
      
      {/* Стать специалистом/партнером - защищено */}
      <Route path={"/specialist-offer"}>
        <ProtectedRoute><SpecialistOffer /></ProtectedRoute>
      </Route>
      <Route path={"/center-offer"}>
        <ProtectedRoute><CenterOffer /></ProtectedRoute>
      </Route>
      <Route path={"/center/crm"}>
        <ProtectedRoute allowedRoles={['center_admin', 'admin']}><CenterCRM /></ProtectedRoute>
      </Route>
      
      {/* Старые модули (для совместимости) */}
      <Route path={"/medicine"}>
        <ProtectedRoute><Medicine /></ProtectedRoute>
      </Route>
      <Route path={"/nutrition"}>
        <ProtectedRoute><Nutrition /></ProtectedRoute>
      </Route>
      <Route path={"/movement"}>
        <ProtectedRoute><Movement /></ProtectedRoute>
      </Route>
      <Route path={"/psychology"}>
        <ProtectedRoute><Psychology /></ProtectedRoute>
      </Route>
      <Route path={"/sleep"}>
        <ProtectedRoute><Sleep /></ProtectedRoute>
      </Route>
      <Route path={"/relationships"}>
        <ProtectedRoute><Relationships /></ProtectedRoute>
      </Route>
      <Route path={"/spirituality"}>
        <ProtectedRoute><Spirituality /></ProtectedRoute>
      </Route>
      <Route path={"/systematization"}>
        <ProtectedRoute><Systematization /></ProtectedRoute>
      </Route>
      <Route path={"/ai-planner"}>
        <ProtectedRoute><AiPlanner /></ProtectedRoute>
      </Route>
      
      {/* Платежи */}
      <Route path={"/checkout"}>
        <ProtectedRoute><Checkout /></ProtectedRoute>
      </Route>
      <Route path={"/payment/crypto/:planId"}>
        <ProtectedRoute><CryptoPayment /></ProtectedRoute>
      </Route>
      
      {/* Centers */}
      <Route path={"/centers"}>
        <ProtectedRoute><Centers /></ProtectedRoute>
      </Route>
      
      {/* Разное */}
      <Route path={"/home"}>
        <ProtectedRoute><Home /></ProtectedRoute>
      </Route>
      <Route path={"/environment"} component={() => <div className="p-8">Environment (coming soon)</div>} />
      <Route path={"/full"} component={FullPageList} />
      
      {/* Админ панель */}
      <Route path={"/admin/dashboard"}>
        <ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminDashboard /></ProtectedRoute>
      </Route>
      
      {/* 404 */}
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Header только для не-лендинг страниц
function ConditionalHeader() {
  const [location] = useLocation();
  // Не показываем общий Header на лендингах (у них свой хедер)
  const isLandingPage = ['/', '/landing', '/v2', '/newstyle', '/presentation'].includes(location);
  return isLandingPage ? null : <Header />;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <UserProvider>
            <TooltipProvider>
              <Toaster />
              <AnimatePresence>
                {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
              </AnimatePresence>
              <ConditionalHeader />
              <Router />
              <BottomNavigation />
              <PWAInstallPrompt />
            </TooltipProvider>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
