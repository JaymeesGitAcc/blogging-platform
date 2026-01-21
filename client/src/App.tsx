import { Toaster } from "sonner"
import AppRoutes from "./routes/AppRoutes"

const App = () => {
	return (
		<div>
			<AppRoutes />
			<Toaster />
		</div>
	)
}

export default App
