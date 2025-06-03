import Image from "next/image";
export default function EstadisticasPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-4 text-green-800">Estadísticas y Resúmenes</h1>
      <p className="mb-6 text-gray-600">Visualiza gráficos y reportes de los pedidos y ventas.</p>
      <Image src="/en-construccion.svg" alt="En construcción" width={320} height={240} />
    </div>
  );
}
