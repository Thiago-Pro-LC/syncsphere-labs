import { Header } from "@/components/Header";
import { ViralityPredictor } from "@/components/virality/ViralityPredictor";

const Virality = () => {
  return (
    <div className="min-h-screen bg-gradient-primary">
      <Header />

      <main className="container mx-auto px-4 py-10">
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Virality Predictor <span className="text-viral-accent">⚡</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Simule a resposta neural do público e descubra a força de viralização
            de um vídeo — gancho, retenção e ativação por região do cérebro.
          </p>
        </div>

        <ViralityPredictor />
      </main>
    </div>
  );
};

export default Virality;
