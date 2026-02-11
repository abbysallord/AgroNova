import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login to AgroNova | Access Your Smart Farming Dashboard',
    description: 'Securely log in to AgroNova to access AI-driven farming insights, market trends, and personalized crop advice.',
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
