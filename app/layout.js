import { Lato } from 'next/font/google';
import './globals.css';

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'Savviour Builderrs – Best Builder in Delhi-NCR',
    template: '%s – Savviour Builderrs',
  },
  description:
    'M/s Saviour Builders Pvt. Ltd. is one of the leading real estate developers in Delhi-NCR.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={lato.variable}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
