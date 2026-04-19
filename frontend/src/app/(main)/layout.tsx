import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <div className="no-print">
        <Navbar />
      </div>
      <div className="flex-grow pt-24 pb-12 w-full">
        {children}
      </div>
      <div className="no-print">
        <Footer />
      </div>
    </AuthGuard>
  );
}
