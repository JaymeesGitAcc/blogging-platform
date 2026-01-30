import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type React from "react"
import { useNavigate } from "react-router-dom"

interface BackButtonProps {
  size?:
    | "default"
    | "xs"
    | "sm"
    | "lg"
    | "icon"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg"
  className?: string
  children?: React.ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost"
}

const BackButton = ({
  size="default",
  className="",
  children,
  variant="default",
}: BackButtonProps) => {
  const navigate = useNavigate()
  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => navigate(-1)}
      className={className}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {children || "Back"}
    </Button>
  )
}

export default BackButton
