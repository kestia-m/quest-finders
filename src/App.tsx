import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ResourceMeter } from '@/components/budget/ResourceMeter';
import { ItineraryPlanner } from '@/components/itinerary/ItineraryPlanner';
import { Leaderboard } from '@/components/gamification/Leaderboard';
import { TravelTales } from '@/components/social/Traveltales';
import {TaskPage} from '@/components/tasks/tasklist';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';

function NavigationBar() {
  return (
    <nav className="fixed top-0 w-full bg-white shadow-md z-10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl font-serif text-black">Quest Finders</span>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/dashboard">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/budget">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Budget Tracker
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/itinerary">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Itinerary
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/tasks">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Tasks
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/leaderboard">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Leaderboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/tales">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Travel Tales
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center">
          <span className="mr-2 text-sm text-black">Welcome, ExplorerJane</span>
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </nav>
  );
}

// Error Boundary Component to catch rendering issues
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return <div className="pt-20 p-6 text-red-500">An error occurred. Please check the console and try again.</div>;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <>
                <NavigationBar />
                <div className="pt-20 p-6">Dashboard Content Here</div>
              </>
            }
          />
          <Route
            path="/budget"
            element={
              <>
                <NavigationBar />
                <div className="pt-20 p-6">
                  <ResourceMeter userId="user1" />
                </div>
              </>
            }
          />
          <Route
            path="/itinerary"
            element={
              <>
                <NavigationBar />
                <div className="pt-20 p-6">
                  <ItineraryPlanner />
                </div>
              </>
            }
          />
          <Route
            path="/tasks"
            element={
              <>
                <NavigationBar />
                <div className="pt-20 p-6">
                  <TaskPage />
                </div>
              </>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <>
                <NavigationBar />
                <div className="pt-20 p-6">
                  <Leaderboard type="global" />
                </div>
              </>
            }
          />
          <Route
            path="/tales"
            element={
              <>
                <NavigationBar />
                <div className="pt-20 p-6">
                  <TravelTales groupId={1} />
                </div>
              </>
            }
          />
          <Route
            path="/"
            element={
              <>
                <NavigationBar />
                <div className="pt-20 p-6">Welcome to Quest Finders</div>
              </>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} /> {/* Catch-all route */}
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
