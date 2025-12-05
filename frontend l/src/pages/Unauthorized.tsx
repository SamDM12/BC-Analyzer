export default function Unauthorized() {
  return (
    <div className="h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold text-red-600">
        No tienes permisos para acceder aquí.
      </h1>
    </div>
  );
}