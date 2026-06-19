import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FormProvider } from "@/context/FormContext";

export default function FormLayout({ children }: { children: React.ReactNode }) {
  return (
    <FormProvider>
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
      <Footer />
    </FormProvider>
  );
}
