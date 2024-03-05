import type { Metadata } from "next";
import {Inter} from 'next/font/google';
import "./globals.css";
import React from 'react';

const inter = Inter({subsets: ['cyrillic']});

export const metadata: Metadata = {
  title: "Y360 API Test app",
  description: "Based on Y360 API test apps",
};

const RootLayout = ({children}: { children: React.ReactNode }) => {
  return (
    <html lang="ru">
      <body className={ `${inter.className} bg-gray-100`}>
        <div id="page-content">
          {children}
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
