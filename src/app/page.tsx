import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      <h1 className="text-3xl font-bold">Casino Escolar</h1>
      <Link className="text-blue-600 underline" href="/auth/register">
        Registrarse
      </Link>
    </main>
  );
}
