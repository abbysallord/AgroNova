# AgroNova - The Future of Smart Farming 🌱

AgroNova is a comprehensive digital ecosystem designed to empower farmers with AI-driven insights, direct market access, and a thriving community. It bridges the gap between technology and agriculture, ensuring farmers get the best value for their produce and labor.

![AgroNova Dashboard](public/images/dashboard/pest-mockup.png)

## 🚀 Key Features

### **Farm Intelligence Dashboard**
- **Hyper-Local Weather**: Real-time accurate weather forecasts with crop-specific advisories.
- **Soil Health Analysis**: Upload soil reports to get detailed NPK and pH breakdown with remediation tips.
- **Pest Detection AI**: Instant disease identification by uploading crop photos, powered by advanced computer vision.

### **Agri Store Pro**
- **Direct-to-Consumer Marketplace**: Farmers can list produce directly, setting their own prices.
- **Secure Checkout**: Integrated checkout flow with Location GPS and UPI payment verification.
- **Zero Middlemen**: 100% of the profit goes to the farmer.

### **Farmer's Community**
- **Social Feed**: Share updates, photos, and success stories with fellow farmers.
- **Network & Connect**: Follow experts, message peers, and build your agricultural network.
- **Discussion Forums**: Ask questions and get advice from the community.

### **Reports & Analytics**
- **Yield Forecasting**: AI-predicted yield estimates based on farm size and crop data.
- **Financial Projections**: Revenue and profit estimation to help plan the season.
- **Smart Recommendations**: Tailored tips to improve productivity.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Mobile app**: [Capacitor 8](https://capacitorjs.com/) (Generate Android/iOS apps)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Managed by NeonDB) + [Prisma ORM](https://www.prisma.io/)
- **AI Integration**: OpenAI, Mistral AI, Google Generative AI
- **Animations**: Framer Motion, GSAP
- **State Management**: React Context (Auth)

## 🏁 Getting Started

### Prerequisites

- **Node.js**: v18 or higher (Recommended: v20 LTS)
- **Package Manager**: npm or bun
- **PostgreSQL**: Local instance or cloud database (e.g., Neon, Supabase)
- **Android Studio**: Specifically for building the Android app (Optional for web dev)

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/your-username/agronova.git
    cd agronova
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    # or
    bun install
    ```

3.  **Environment Setup**

    Create a `.env` file in the root directory and populate it with your keys. You can use `.env.example` as a template:

    ```bash
    cp .env.example .env
    ```

    Required variables:
    *   `DATABASE_URL`: Your PostgreSQL connection string.
    *   `OPENAI_API_KEY`: API key from OpenAI.
    *   `MISTRAL_API_KEY`: API key from Mistral AI.
    *   `EMAIL_USER` & `EMAIL_PASS`: For sending emails (e.g., Gmail App Password).

4.  **Database Setup**

    Initialize the database schema with Prisma:

    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run Development Server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📱 Mobile Development (Android)

AgroNova uses **Capacitor** to wrap the web app into a native Android application.

### Setup
Ensure you have **Android Studio** installed and the `android` platform added (it should be pre-configured in this repo).

### Running on Device/Emulator

1.  Sync the web build to the native project:
    ```bash
    npx cap sync
    ```

2.  Open the project in Android Studio:
    ```bash
    npx cap open android
    ```

3.  Click the **Run** button (green play icon) in Android Studio to launch on a connected device or emulator.

### Building for Release
For detailed instructions on generating a signed APK or AAB for the Play Store, see [MOBILE_DEPLOYMENT.md](./MOBILE_DEPLOYMENT.md).

## 🤝 Contributing

We welcome contributions to help Indian farmers! Please follow these steps:
1.  Fork the repository.
2.  Create a new branch: `git checkout -b feature/your-feature-name`.
3.  Commit your changes: `git commit -m 'Add some feature'`.
4.  Push to the branch: `git push origin feature/your-feature-name`.
5.  Submit a pull request.

## 📄 License

MIT License © 2024 AgroNova