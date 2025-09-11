// 'use client';
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { useSession } from './auth';

// const AuthContext = createContext({});

// export function AuthProvider({ children }:{children:React.ReactNode}) {
//   const { data: session, error, isPending } = useSession();
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     if (!isPending) {
//       setIsLoading(false);
//     }
//   }, [isPending]);

//   const value = {
//     user: session?.user || null,
//     session: session?.session || null,
//     isLoading: isLoading || isPending,
//     isAuthenticated: !!session?.user,
//     error
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };