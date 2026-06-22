import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FormProvider } from "@/context/FormContext";

export default function FormLayout({ children }: { children: React.ReactNode }) {
  return (
    <FormProvider>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
      />
      <div className="relative flex min-h-screen flex-1 flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50">
        <div
          className="pointer-events-none absolute -left-32 top-40 h-96 w-96 rounded-full bg-brand-red/15 blur-[130px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-brand-cyan/20 blur-[120px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-orange-300/20 blur-[120px]"
          aria-hidden="true"
        />

        <div className="relative z-10 flex min-h-screen flex-1 flex-col">
          <Header />
          <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
          <Footer />
        </div>
      </div>
    </FormProvider>
  );
}
