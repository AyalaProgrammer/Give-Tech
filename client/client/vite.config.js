import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})



// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     // הגדרת Headers כדי לאפשר לחלון ההתחברות של גוגל לתקשר עם האפליקציה
//     headers: {
//       "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
//     },
//     // ודואים שהשרת רץ על הפורט המקובל (אופציונלי)
//     port: 5173,
//   },
// })