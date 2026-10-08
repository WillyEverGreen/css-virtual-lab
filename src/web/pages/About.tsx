import Pricing from '../../components/Pricing.jsx';
import Process from '../../components/Process.jsx';
import FinalCta from '../../components/FinalCta.jsx';

export default function About() {
  return (
    <div style={{ paddingTop: '80px' }}>
      <div className="section">
        <div className="container">
          <h1 className="heading-2 text-center">About Fr. CRCE Crypto Lab</h1>
          <p className="paragraph text-center" style={{ maxWidth: '720px', margin: '16px auto' }}>
            Built by students of Fr. Conceicao Rodrigues College of Engineering as an interactive platform for learning modern cryptography concepts through real simulation, vulnerability testing, and code validation.
          </p>
        </div>
      </div>
      <Process />
      <Pricing />
      <FinalCta />
    </div>
  );
}
