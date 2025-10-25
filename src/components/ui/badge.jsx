import * as React from "react"
import { cva } from "class-variance-authority";

// ✅ 경로 확인: cn 유틸리티의 경로가 맞는지 확인하세요!
// (src/components/ui에서 src/lib/utils까지는 보통 "../../lib/utils"입니다.)
import { cn } from "../../lib/utils" 

// 1. CVA를 사용한 뱃지 스타일 정의
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// 2. Badge 컴포넌트 정의
const Badge = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      ref={ref}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

// 3. 내보내기 (export)
// Dashboard.js에서 import 'Badge'를 찾을 수 있도록 이 이름으로 내보냅니다.
export { Badge, badgeVariants }