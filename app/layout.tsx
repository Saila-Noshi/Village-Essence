// app/layout.tsx 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import './globals.css'; // Your existing globals.css 
import '/public/css/custom.css'; // Your new custom CSS 
import Script from 'next/script'; 
import { CartProvider } from '@/context/CartContext'; 
import ConditionalLayout from '@/components/ConditionalLayout';

export const metadata = { 
  title: 'Village Essence', 
  description: 'Authentic Local Products', 
}; 

export default function RootLayout({ 
  children, 
}: { 
  children: React.ReactNode; 
}) { 
  return ( 
    <html lang="en"> 
      <body> 
        <CartProvider>  
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </CartProvider> 
        <Script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" 
          integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" 
          crossOrigin="anonymous" 
        /> 
      </body> 
    </html> 
  ); 
}