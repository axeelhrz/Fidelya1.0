import Image from "next/image";
export default function AdminDashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold mb-4 text-green-800">Dashboard de Administración</h1>
      <p className="mb-6 text-gray-600">Aquí verás los principales indicadores y resúmenes del casino.</p>
      <Image src="/en-construccion.svg" alt="En construcción" width={320} height={240} />
    </div>
  );
}
