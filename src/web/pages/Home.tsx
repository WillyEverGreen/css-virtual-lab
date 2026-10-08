import CheckerMarqueeTop from '../../components/CheckerMarqueeTop.jsx';
import Hero from '../../components/Hero.jsx';
import Section03 from '../../components/Section03.jsx';
import Section04 from '../../components/Section04.jsx';
import Services from '../../components/Services.jsx';

// Elements kept for later reuse per request:
// import Section06 from '../../components/Section06.jsx';
// import Work from '../../components/Work.jsx';
// import Section08 from '../../components/Section08.jsx';
// import FinalCta from '../../components/FinalCta.jsx';
// import Process from '../../components/Process.jsx';
// import Pricing from '../../components/Pricing.jsx';
// import ContactFooter from '../../components/ContactFooter.jsx';

export default function Home() {
  return (
    <>
      <CheckerMarqueeTop />
      <Hero />
      <Section03 />
      <Section04 />
      <Services />
    </>
  );
}
