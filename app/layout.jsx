import './globals.css';
export const metadata = {
    title: 'Phoenix Engine | Physics Intelligence',
    description: 'Physics-informed engineering analysis for rapid R&D iteration.',
    icons: {
        icon: '/icon.svg',
    },
};
export default function RootLayout({ children, }) {
    return (<html lang="en">
      <body>{children}</body>
    </html>);
}
