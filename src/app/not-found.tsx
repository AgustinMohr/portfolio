import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        aria-hidden="true"
        className="grid-lines grid-mask absolute inset-0 opacity-40"
      />
      <div className="relative">
        <p className="label text-acid">Error / 404</p>
        <h1 className="mt-6 text-6xl tracking-[-0.05em] text-bone md:text-8xl">
          Fuera de <span className="serif-accent text-acid">sistema.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-ash">
          La página que buscás no existe o cambió de lugar. Volvamos a un lugar
          conocido.
        </p>
        <Link href="/" className="btn btn-primary mt-8">
          Volver al inicio
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
