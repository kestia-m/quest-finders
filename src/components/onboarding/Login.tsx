import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Lock } from "lucide-react";
import userData from '../../data/user.json';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock auth - in real app, use API
    // Assuming you want to check against the first user in the users array
    const user = userData.users[0];
    // For demonstration, accept any password if email matches
    if (user && email === user.email) {
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/preferences');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" 
                    style={{ color: colors.persianPink }} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{ 
                  borderColor: colors.thistle,
                  backgroundColor: `${colors.timberwolf}20`,
                }}
                required
              />
            </div>
            
            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" 
                    style={{ color: colors.persianPink }} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{ 
                  borderColor: colors.thistle,
                  backgroundColor: `${colors.timberwolf}20`,
                }}
                required
              />
            </div>
            
            {/* Login Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 text-sm rounded-xl font-semibold text-white transition-all"
              style={{ backgroundColor: colors.persianPink }}
            >
              Login
            </motion.button>
          </form>
          
          {/* Create Profile Link */}
          <div className="text-center mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/preferences')}
              className="text-xs font-medium"
              style={{ color: colors.persianPink }}
            >
              New User? Create Profile
            </motion.button>
          </div>
        </div>
        
        {/* Tagline */}
        <motion.p 
          className="text-center mt-4 text-xs text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Discover South Africa's hidden gems through gamified adventures
        </motion.p>
      </motion.div>
    </div>
  );
}
