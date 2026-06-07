export function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      <p className="text-zinc-500 text-sm">{message}</p>
    </div>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 text-xl">
        !
      </div>
      <p className="text-red-400 font-medium">Something went wrong</p>
      <p className="text-zinc-500 text-sm max-w-md text-center">{message}</p>
    </div>
  );
}
