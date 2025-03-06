
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AnalysisPanel from '@/components/AnalysisPanel';

const Analysis = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold mb-8">Recycling Impact Analysis</h1>
        <AnalysisPanel />
      </main>
      <Footer />
    </div>
  );
};

export default Analysis;
