import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

const BackButton = () => {
  const navigate = useNavigate()
  return (
    <Button variant="outline" onClick={() => navigate(-1)}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back
    </Button>
  )
}

export default BackButton
