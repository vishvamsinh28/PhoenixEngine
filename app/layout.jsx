import './globals.css';
export const metadata = {
    title: 'Synthiolabs',
    description: 'Chat Streaming',
    icons: {
        icon: '/icon.jpeg',
    },
};
export default function RootLayout({ children, }) {
    return (<html lang="en">
      <body>{children}</body>
    </html>);
}
