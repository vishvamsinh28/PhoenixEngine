import './globals.css';
import 'katex/dist/katex.min.css';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
    title: 'Phoenix Engine | Physics Intelligence',
    description: 'Physics-informed engineering analysis for rapid R&D iteration.',
    icons: {
        icon: '/icon.svg',
    },
};
export default function RootLayout({ children, }) {
    return (<html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>);
}
