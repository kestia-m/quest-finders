import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles } from "lucide-react";

// Brand color palette
const colors = {
  persianPink: '#f991cc',
  pinkLavender: '#e2afde',
  thistle: '#d3c2ce',
  timberwolf: '#d3d2c7',
  lemonChiffon: '#e2e1b9',
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = { email, name: 'Demo User' };
    localStorage.setItem('user', JSON.stringify(user));
    navigate('/dashboard-k');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div 
          className="flex justify-center mb-5"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
        >
          <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center border"
               style={{ borderColor: colors.thistle, backgroundColor: colors.timberwolf }}>
            <img src="./assets/eco-car.png" alt="SafariQuest Logo" className="w-full h-full object-cover rounded-2xl" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles size={16} fill={colors.persianPink} color={colors.persianPink} />
            </motion.div>
          </div>
        </motion.div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border" style={{ borderColor: colors.thistle }}>
          <h2 className="text-xl font-semibold text-center mb-4" style={{ color: colors.persianPink }}>
            Welcome to SafariQuest
          </h2>
          
          <form onSubmit={handleLogin} className="space-y-3">
            {/* Email */}
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
