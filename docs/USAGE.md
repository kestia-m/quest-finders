````markdown
# Usage Guide

## ▶️ Running the Application

To launch the **Quest Finders** application, follow these steps to set up and run the project locally. The application is built with Next.js, TypeScript, and Tailwind CSS, and it requires Node.js to be installed.

```bash
# Clone the repository (replace with your repository URL if applicable)
git clone https://github.com/your-username/quest-finders.git
cd quest-finders

# Install dependencies
npm install

# Start the development server
npm run dev
````

- **Prerequisites**:
    
    - **Node.js**: Version 18 or higher (check with node -v).
        
    - **npm**: Version 8 or higher (check with npm -v) or use yarn if preferred.
        
- **Steps**:
    
    1. Clone the repository to your local machine.
        
    2. Navigate to the project directory (quest-finders).
        
    3. Run npm install to install all dependencies (e.g., react, next, recharts, lucide-react, tailwindcss).
        
    4. Run npm run dev to start the development server.
        
    5. Open your browser and navigate to http://localhost:5173 to view the application.
        
- **Build for Production** (optional):
    
    ```bash
    npm run build
    npm start
    ```
    
    This builds the optimized production version and starts the server.
    

## 🖥️ How to Use

The **Quest Finders** application is a gamified platform for managing budgets, tracking quests, and earning rewards. Below are step-by-step instructions for using the key features:

1. **Access the Dashboard**:
    
    - Open http://localhost:3000 in your browser after starting the server.
        
    - The **Dashboard** is the main landing page, displaying an overview of your budget, XP, rewards, and active quests.
        
    - Use the sidebar (visible on desktop) or mobile sidebar (hamburger menu on smaller screens) to navigate to other sections: **Budget**, **Quests**, and **Rewards**.
        
2. **Manage Your Budget**:
    
    - Navigate to the **Budget** section via the sidebar.
        
    - View your **Budget Overview** (total budget, amount spent, remaining, and progress).
        
    - Click **Set/Edit Budget** to open a side panel (SetBudgetFlow) where you can:
        
        - Enter a new total budget and allocate funds across categories (food, transport, accommodation, activities).
            
        - Save the budget to update the overview and spending charts.
            
    - Check **Spending by Category** to see how much you've spent in each category.
        
    - Review **Recent Activities** to see quests and their associated costs.
        
3. **Create and Track Quests**:
    
    - From the **Dashboard** or **Quests** section, click **New Quest** to open the quest creation flow.
        
    - Follow the four-step process:
        
        - **Step 1: Quest Category** - Select a category (Wildlife, Adventure, Landmark, Events).
            
        - **Step 2: Quest Details** - Enter the quest name, description, and cost (in ZAR).
            
        - **Step 3: Rewards** - Set the XP reward and badge name.
            
        - **Step 4: Confirmation** - Review and create the quest.
            
    - In the **Quests** section, view active quests, their progress (via a progress bar), and mark progress or join multiplayer quests.
        
    - Completed quests are marked with a green "Completed" badge.
        
4. **Track Rewards**:
    
    - Navigate to the **Rewards** section to view your total ZAR earned, XP, and sponsor contributions.
        
    - Click **Earn 50 XP & Check Sponsors** to simulate earning XP and adding a sponsor contribution.
        
    - Review the **Rewards History** chart to see your XP and ZAR over time.
        
    - Check the **Sponsor Contributions** table for details on sponsor amounts and dates.
        
5. **View Leaderboard and Groups**:
    
    - On the **Dashboard**, see your current rank, badges earned, and groups joined in the right-hand card.
        
    - Switch the time range (Last 30 Days, 60 Days, 90 Days, or Last Year) using the dropdown in the header to update budget and chart data.
        
6. **Interact with Charts and Tables**:
    
    - The **Budget Allocation** chart on the **Dashboard** shows spending trends across categories (food, transport, accommodation, activities) based on the selected time range.
        
    - The **Active Quests** table allows you to download or delete quests using the action buttons (download and trash icons).
        
    - Pagination buttons at the bottom of the quests table let you navigate through multiple pages of quests (currently static).
        

## 🎥 Demo

Check out the demos to see **Quest Finders** in action:

- Demo Video
    
- Demo Presentation
    

_Note_: Ensure the demo folder is in the project root (quest-finders/demo/) and contains demo.mp4 and demo.pptx. If the files are hosted elsewhere, update the paths to absolute URLs (e.g., https://your-site.com/demo/demo.mp4).

## 📌 Notes

- **Dependencies**: Ensure all dependencies are installed correctly (npm install). Key dependencies include next, react, recharts, lucide-react, and tailwindcss. Check package.json for the full list.
    
- **Data Service**: The application uses a dataService (from src/services/dataService) for fetching and updating budgets, quests, leaderboards, and multiplayer groups. Ensure this service is implemented or mocked for testing (e.g., using local storage or a mock API).
    
- **TypeScript**: The project uses TypeScript for type safety. Verify that types (User, Budget, Quest, LeaderboardEntry, MultiplayerGroup) are defined in src/types.ts or equivalent.
    
- **Tailwind CSS**: The UI relies on Tailwind CSS classes and custom CSS variables (e.g., --breakpoint-lg, --card, --card-foreground). Ensure Tailwind is configured in tailwind.config.js.
    
- **Responsive Design**: The application is responsive, with a mobile sidebar for smaller screens and a full sidebar for desktop. Test on various screen sizes to ensure usability.
    
- **Error Handling**: The code includes null checks (e.g., budgets[0]?.totalBudget || 0) to prevent runtime errors. If dataService returns unexpected data, add additional validation.
    
- **Pagination**: The quests table pagination is static. For a production environment, implement dynamic pagination by adding state and logic to handle page changes based on the number of quests.
    
- **Demo Files**: If the demo video or presentation files are missing, replace the paths with links to hosted versions or placeholders. For judges, provide a live demo URL if available (e.g., deployed on Vercel or Netlify).
    
- **Accessibility**: Ensure buttons and interactive elements have proper ARIA labels for accessibility. For example, add aria-label to the Download and Trash2 buttons in the quests table.
    
- **Testing**: Run npm run lint to check for ESLint/TypeScript errors and npm test if tests are set up. Fix any issues before demoing to judges.
