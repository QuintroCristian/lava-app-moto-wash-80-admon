import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Toaster } from "../ui"
import { useAppStore, useAuthStore } from "@/contexts"
import { Home } from "lucide-react"
import { privateRoutes } from "@/routers/routes"
import { useDocumentMeta } from "@/hooks/useDocumentMeta"

export const MainLayout = () => {
  useDocumentMeta();
  const navigate = useNavigate()
  const { empresa: company } = useAppStore()

  const { user, logout } = useAuthStore()
  const location = useLocation()

  const getRouteTitle = () => {
    const path = location.pathname.slice(1)
    if (path === 'dashboard') {
      return `Dashboard ${user?.rol ? `- ${user.rol.charAt(0).toUpperCase() + user.rol.slice(1).toLowerCase()}` : ''}`
    }

    const currentRoute = privateRoutes.find(route => route.path === path)
    return currentRoute?.title ?? path
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="grid grid-cols-4 items-center h-[10vh] bg-primary text-primary-foreground px-4 select-none">
        <div className="flex col-span-1 items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
          {
            company?.logo ?
              <img src={company?.logo} alt={company?.nombre} className="h-24 max-h-[7vh] w-auto" />
              :
              <h1 className="text-2xl font-black">{company?.nombre}</h1>
          }
        </div>
        <div className="flex col-span-2 items-center justify-center text-xl font-semibold">
          {getRouteTitle()}
        </div>
        <div className="flex items-center justify-end col-span-1">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="bg-black">{(user?.nombre?.charAt(0) ?? '') + (user?.apellido?.charAt(0) ?? '')}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className={`flex flex-col h-[90vh] p-4 ${location.pathname !== 'dashboard' ? 'justify-center' : 'justify-start'}`}>
        {location.pathname !== '/dashboard' && (
          <div className="h-[9vh]">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <Home size={16} />
              Volver al Dashboard
            </Button>
          </div>
        )}
        <div className={`flex justify-center overflow-y-auto items-center ${location.pathname !== 'dashboard' ? 'h-[80vh]' : 'h-[89vh]'}`}>
          <Outlet />
        </div>
      </main>
      <Toaster richColors theme="light" />
    </div>
  )
}