export default function CheckerMarqueeTop() {
  return (
    <>
<div className="section padding-none"><div className="container fluid padding-none w-container"><div className="marquee-horizontal-reverse"><div className="marquee-horizontal-alt-css w-embed"><style>{`

.track-horizontal-alt {
  position: absolute;
  white-space: nowrap;
  will-change: transform;
  animation: marquee-horizontal-alt 40s linear infinite;
  /* manipulate the speed of the marquee by changing "40s" line above*/
}

@keyframes marquee-horizontal-alt {
  from { transform: translateX(-50%); }
  to { transform: translateX(0%); }
}

`}</style></div><div className="track-horizontal-alt"><div className="marquee-text-alt"><img src="/images/62aa117418169952c83c1dfc_checker-banner-updated.svg" loading="lazy" alt="" /></div><div className="marquee-text-alt"><img src="/images/62aa117418169952c83c1dfc_checker-banner-updated.svg" loading="lazy" alt="" /></div><div className="marquee-text-alt"><img src="/images/62aa117418169952c83c1dfc_checker-banner-updated.svg" loading="lazy" alt="" /></div></div></div></div></div>
    </>
  );
}
