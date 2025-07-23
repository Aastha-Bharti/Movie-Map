// components/SkeletonCard.jsx
const SkeletonCard = () => {
  return (
    <div className="animate-pulse bg-dark-200 rounded-2xl overflow-hidden shadow-md">
      <div className="h-72 bg-dark-300 w-full" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-dark-300 rounded w-3/4" />
        <div className="h-3 bg-dark-300 rounded w-1/3" />
      </div>
    </div>
  )
}

export default SkeletonCard
