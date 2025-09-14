# Setup Instructions

Follow the steps below to set up and run the project.

---

## 📦 Requirements

- **Node.js v18+**: Install from [nodejs.org](https://nodejs.org/) or use a version manager like `nvm` (`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash` followed by `nvm install 18`).
- **npm v9+**: Comes with Node.js; verify with `npm -v` after installation.
- **Git**: Install from [git-scm.com](https://git-scm.com/) or via your package manager (e.g., `sudo apt install git` on Ubuntu).
- **Tailwind CSS**: Installed via npm as part of shadcn/ui setup (see Installation).
- **shadcn/ui**: Requires manual setup after project creation (see Installation).

---

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/your-username/quest-finders.git
cd quest-finders

# Install dependencies
npm install

# Initialize shadcn/ui (includes Tailwind CSS setup)
npx shadcn-ui@latest init

# (Optional) Run the setup script to automate steps
./scripts/setup.sh
```

**Notes**:

- Replace `https://github.com/kestia-m/quest-finders.git` with your actual repository URL.
- The `npx shadcn-ui@latest init` command sets up shadcn/ui and Tailwind CSS. Follow the interactive prompts to configure Tailwind (e.g., select a Tailwind config file or create one).
- Ensure the `scripts/` directory contains `setup.sh` (see below for script content).

---

## ▶️ Running the Project

```bash
# Start the development server
npm run dev
```

**Notes**:

- Open [http://localhost:5173](http://localhost:5173/) in your browser to view the app.
- The server will auto-reload on code changes.

---

## 📜 Setup Script (Optional)

A Bash script is provided in the `scripts/` directory to automate the setup process. Create a file named `setup.sh` with the following content:

```bash
#!/bin/bash

# Navigate to project directory (adjust if cloned elsewhere)
cd "$(dirname "$0")/.."

# Install dependencies
npm install

# Initialize shadcn/ui (includes Tailwind CSS setup)
npx shadcn-ui@latest init

echo "Setup complete! Run 'npm run dev' to start the project."
```

**Instructions**:

- Save the script in `scripts/setup.sh`.
- Make it executable with `chmod +x scripts/setup.sh`.
- Run it with `./scripts/setup.sh` from the project root.

**Notes**:

- Ensure you have execute permissions and are in the project directory.
- The script assumes a standard Vite configuration with Tailwind CSS; adjust paths or commands if customized.
