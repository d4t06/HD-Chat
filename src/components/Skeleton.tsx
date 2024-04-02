

type Props = {
   className?: string
}
export default function Skeleton ({className} : Props) {
   return <div className={`animate-pulse bg-[#e8e8e8] ${className}`}></div>
}