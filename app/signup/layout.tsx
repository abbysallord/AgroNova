import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Join AgroNova | Sign Up for Smart Farming Future',
    description: 'Create your free AgroNova account today. precise weather forecasts, pest detection, and community support for Indian farmers.',
};

export default function SignupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
