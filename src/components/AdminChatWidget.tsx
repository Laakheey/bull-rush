// import { useUser, useAuth } from "@clerk/clerk-react";
// import { useEffect } from "react";

// declare global {
//   interface Window {
//     Tawk_API?: any;
//     Tawk_LoadStart?: Date;
//   }
// }

// const TAWKTO_PROPERTY_ID = import.meta.env.VITE_TAWKTO_PROPERTY_ID;
// const TAWKTO_WIDGET_ID = import.meta.env.VITE_TAWKTO_WIDGET_ID;

// const ADMIN_USER_IDS = [`${import.meta.env.VITE_ADMIN_ID}`];

// const AdminChatWidget: React.FC = () => {
//   const { user } = useUser();
//   const { userId } = useAuth();

//   const isAdmin = userId && ADMIN_USER_IDS.includes(userId);

//   useEffect(() => {
//     if (!isAdmin) return;

//     if (window.Tawk_API || document.getElementById("tawk-script")) return;

//     window.Tawk_API = window.Tawk_API || {};
//     window.Tawk_LoadStart = new Date();

//     const script = document.createElement("script");
//     script.id = "tawk-script";
//     script.async = true;
//     script.src = `https://embed.tawk.to/${TAWKTO_PROPERTY_ID}/${TAWKTO_WIDGET_ID}`;
//     script.charset = "UTF-8";
//     script.setAttribute("crossorigin", "*");

//     const firstScript = document.getElementsByTagName("script")[0];
//     if (firstScript?.parentNode) {
//       firstScript.parentNode.insertBefore(script, firstScript);
//     }

//     window.Tawk_API.onLoad = () => {
//       if (window.Tawk_API && user) {
//         window.Tawk_API.setAttributes({
//           name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Admin",
//           email: user.primaryEmailAddress?.emailAddress || "",
//         });
//       }
//     };
//   }, [isAdmin, user]);

//   if (!isAdmin) return null;

//   return (
//     <div className="fixed bottom-4 right-4 z-50">
//       <div className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
//         Admin Chat Active
//       </div>
//     </div>
//   );
// };

// export default AdminChatWidget;

// src/components/chat/AdminChat.tsx
import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

const AdminChatWidget: React.FC = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    const TAWK_PROPERTY_ID = import.meta.env.VITE_TAWKTO_PROPERTY_ID;
    const TAWK_WIDGET_ID = import.meta.env.VITE_TAWKTO_WIDGET_ID;
    if (window.Tawk_API) {
      if (user) {
        window.Tawk_API.setAttributes({
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.primaryEmailAddress?.emailAddress || '',
          userId: user.id,
        });
      }
      return;
    }

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    script.onload = () => {
      if (user && window.Tawk_API) {
        window.Tawk_API.onLoad = function() {
          window.Tawk_API.setAttributes({
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            email: user.primaryEmailAddress?.emailAddress || '',
            userId: user.id,
          });
        };
      }
    };

    document.body.appendChild(script);

    return () => {
      const tawkScript = document.querySelector(`script[src*="embed.tawk.to"]`);
      if (tawkScript) {
        tawkScript.remove();
      }
      
      const tawkWidget = document.getElementById('tawk-bubble-container');
      if (tawkWidget) {
        tawkWidget.remove();
      }

      delete window.Tawk_API;
      delete window.Tawk_LoadStart;
    };
  }, [user, isLoaded]);

  return null;
};

export default AdminChatWidget;