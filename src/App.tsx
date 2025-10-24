import { Slide, ToastContainer } from "react-toastify"
import { ThemeProvider } from "./components/theme-provider"
import { RouterApp } from "./router/RouterApp"

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterApp />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
      />
    </ThemeProvider>      
  )
}

export default App
