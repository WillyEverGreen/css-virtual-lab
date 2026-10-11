import { Link } from 'react-router';

export default function Pricing() {
  return (
    <>
      <div id="pricing" className="section padding-bottom-none pricing">
        <div className="container margin-bottom-64 w-container">
          <div className="max-1000">
            <h2 className="heading-2 text-center">Validation &amp; Lab Specifications</h2>
            <p className="paragraph text-center">
              Official technical criteria, security contracts, and repository rules required for TE Comp C virtual lab submission.
            </p>
          </div>
        </div>

        {/* Marquee shapes divider */}
        <div className="marquee-horizontal-reverse shapes border">
          <div className="marquee-horizontal-alt-css w-embed">
            <style>{`
              @keyframes marquee-horizontal-alt {
                from { transform: translateX(-46.75%); }
                to { transform: translateX(0%); }
              }
            `}</style>
          </div>
          <div className="track-horizontal-alt">
            <div className="marquee-text-alt">
              <img src="/images/650cf1e85741721e194e59d1_shapes-outline.svg" loading="eager" alt="" className="marquee-text-image-shapes" />
            </div>
            <div className="marquee-text-alt">
              <img src="/images/650cf1e85741721e194e59d1_shapes-outline.svg" loading="eager" alt="" className="marquee-text-image-shapes" />
            </div>
            <div className="marquee-text-alt">
              <img src="/images/650cf1e85741721e194e59d1_shapes-outline.svg" loading="eager" alt="" className="marquee-text-image-shapes" />
            </div>
          </div>
        </div>

        {/* 3-Column Specification Cards */}
        <div className="container fluid padding-none w-container">
          <div id="w-node-c4421941-9400-8f0b-37ad-2cecb964cdad-b964cd9c" className="w-layout-layout pricing-grid wf-layout-layout">
            
            {/* Column 1: Security Contract */}
            <div className="w-layout-cell pricing-cell">
              <div className="pricing-block left">
                <div className="pricing-block-interior">
                  <div className="w-layout-vflex pricing-block-top">
                    <div className="w-layout-vflex pricing-heading-container">
                      <h3 className="heading-2 pricing">Security</h3>
                      <p className="paragraph small margin-bottom-none">
                        Strict client-side isolation and cryptographic privacy.
                      </p>
                    </div>
                    <div className="w-layout-vflex">
                      <div className="w-layout-hflex pricing-price-container">
                        <h4 className="heading-4 pricing-price">Must Pass</h4>
                      </div>
                    </div>
                    <div className="w-layout-vflex pricing-list">
                      <div className="w-layout-hflex pricing-list-item">
                        <img src="/images/650b545485db65591903bffe_arrow-price.svg" loading="eager" alt="" className="pricing-list-icon" />
                        <div className="pricing-list-text">Strict Content Security Policy</div>
                      </div>
                      <div className="w-layout-hflex pricing-list-item">
                        <img src="/images/650b545485db65591903bffe_arrow-price.svg" loading="eager" alt="" className="pricing-list-icon" />
                        <div className="pricing-list-text">No eval() or Function()</div>
                      </div>
                      <div className="w-layout-hflex pricing-list-item">
                        <img src="/images/650b545485db65591903bffe_arrow-price.svg" loading="eager" alt="" className="pricing-list-icon" />
                        <div className="pricing-list-text">No LocalStorage/Cookies</div>
                      </div>
                      <div className="w-layout-hflex pricing-list-item">
                        <img src="/images/650b545485db65591903bffe_arrow-price.svg" loading="eager" alt="" className="pricing-list-icon" />
                        <div className="pricing-list-text">100% Client-Side Web Crypto</div>
                      </div>
                      <div className="w-layout-hflex pricing-list-item">
                        <img src="/images/650b545485db65591903bffe_arrow-price.svg" loading="eager" alt="" className="pricing-list-icon" />
                        <div className="pricing-list-text">No external tracking/telemetry</div>
                      </div>
                      <div className="w-layout-hflex pricing-list-item">
                        <img src="/images/650b545485db65591903bffe_arrow-price.svg" loading="eager" alt="" className="pricing-list-icon" />
                        <div className="pricing-list-text">Zero third-party CDNs</div>
                      </div>
                    </div>
                  </div>
                  <div className="button-wrapper vertical">
                    <Link to="/instructions" className="button-icon emoji wide black w-inline-block">
                      <div className="button-text white-text">Read Guidelines</div>
                    </Link>
                    <Link to="/dash" className="button-icon emoji wide w-inline-block">
                      <div className="button-text">Test in Sandbox</div>
                    </Link>
                  </div>
                </div>
                <img src="/images/650c6a0c237558a017f36a9f_blobs.svg" loading="eager" alt="" className="pricing-image basic" />
              </div>
            </div>

            {/* Column 2: Structure Contract */}
            <div className="w-layout-cell pricing-cell">
              <div className="pricing-block middle">
                <div className="pricing-block-interior">
                  <div className="w-layout-vflex pricing-block-top">
                    <div className="w-layout-vflex pricing-heading-container">
                      <h3 className="heading-2 pricing">Structure</h3>
                      <p className="paragraph small margin-bottom-none">
                        Self-contained module repository contract.
                      </p>
                    </div>
                    <div className="w-layout-vflex">
                      <div className="w-layout-hflex pricing-price-container">
                        <h4 className="heading-4 pricing-price">Mandatory</h4>
                      </div>
                    </div>
                    <div className="w-layout-vflex pricing-list">
                      <div className="w-layout-hflex pricing-list-item">
                        <img src="/images/650b545485db65591903bffe_arrow-price.svg" loading="eager" alt="" className="pricing-list-icon" />
                        <div className="pricing-list-text">index.html (semantic markup)</div>
                      </div>
                      <div className="w-layout-hflex pricing-list-item">
                        <img src="/images/650b545485db65591903bffe_arrow-price.svg" loading="eager" alt="" className="pricing-list-icon" />
                        <div className="pricing-list-text">script.js (algorithm engine)</div>
                      </div>
                      <div className="w-layout-hflex pricing-list-item">
                        <img src="/images/650b545485db65591903bffe_arrow-price.svg" loading="eager" alt="" className="pricing-list-icon" />
                        <div className="pricing-list-text">style.css (retro design tokens)</div>
                      </div>
                      <div className="w-layout-hflex pricing-list-item">
                        <img src="/images/650b545485db65591903bffe_arrow-price.svg" loading="eager" alt="" className="pricing-list-icon" />
                        <div className="pricing-list-text">README.md (RFC test vectors)</div>
                      </div>
                      <div className="w-layout-hflex pricing-list-item">
                        <img src="/images/650b545485db65591903bffe_arrow-price.svg" loading="eager" alt="" className="pricing-list-icon" />
                        <div className="pricing-list-text">quiz.json (self-assessment)</div>
                      </div>
                      <div className="w-layout-hflex pricing-list-item">
                        <img src="/images/650b545485db65591903bffe_arrow-price.svg" loading="eager" alt="" className="pricing-list-icon" />
                        <div className="pricing-list-text">Valid UTF-8, max 1MB per file</div>
                      </div>
                    </div>
                  </div>
                  <div className="button-wrapper vertical">
                    <Link to="/instructions" className="button-icon emoji wide black w-inline-block">
                      <div className="button-text white-text">View Template</div>
                    </Link>
                    <Link to="/dash" className="button-icon emoji wide w-inline-block">
                      <div className="button-text">Validate Module</div>
                    </Link>
                  </div>
                </div>
                <img src="/images/650db3e9a0b3428bdf14f1f7_round-star-pink-bottom.svg" loading="eager" alt="" className="pricing-image standard" />
              </div>
            </div>

            {/* Column 3: UI Contract */}
            <div className="w-layout-cell pricing-cell last">
              <div className="pricing-block right border-bottom-none">
                <div className="pricing-block-interior">
                  <div className="w-layout-vflex pricing-block-top">
                    <div className="w-layout-vflex pricing-heading-container">
                      <h3 className="heading-2 pricing">UI Contract</h3>
                      <p className="paragraph small margin-bottom-none">
                        Uniform retro-academic design tokens.
                      </p>
                    </div>
                    <div className="w-layout-vflex">
                      <div className="w-layout-hflex pricing-price-container">
                        <h4 className="heading-4 pricing-price">Uniformity</h4>
                      </div>
                    </div>
                    <div className="w-layout-vflex pricing-list">
                      <div className="w-layout-hflex pricing-list-item">
                        <img src="/images/650b545485db65591903bffe_arrow-price.svg" loading="eager" alt="" className="pricing-list-icon" />
                        <div className="pricing-list-text">Parchment background (#f7f1eb)</div>
                      </div>
                      <div className="w-layout-hflex pricing-list-item">
                        <img src="/images/650b545485db65591903bffe_arrow-price.svg" loading="eager" alt="" className="pricing-list-icon" />
                        <div className="pricing-list-text">2px solid ink black borders</div>
                      </div>
                      <div className="w-layout-hflex pricing-list-item">
                        <img src="/images/650b545485db65591903bffe_arrow-price.svg" loading="eager" alt="" className="pricing-list-icon" />
                        <div className="pricing-list-text">4px brutalist box shadows</div>
                      </div>
                      <div className="w-layout-hflex pricing-list-item">
                        <img src="/images/650b545485db65591903bffe_arrow-price.svg" loading="eager" alt="" className="pricing-list-icon" />
                        <div className="pricing-list-text">On-demand button computation</div>
                      </div>
                      <div className="w-layout-hflex pricing-list-item">
                        <img src="/images/650b545485db65591903bffe_arrow-price.svg" loading="eager" alt="" className="pricing-list-icon" />
                        <div className="pricing-list-text">Master Navbar message bridge</div>
                      </div>
                      <div className="w-layout-hflex pricing-list-item">
                        <img src="/images/650b545485db65591903bffe_arrow-price.svg" loading="eager" alt="" className="pricing-list-icon" />
                        <div className="pricing-list-text">Zero external style pollution</div>
                      </div>
                    </div>
                  </div>
                  <div className="button-wrapper vertical">
                    <Link to="/instructions" className="button-icon emoji wide black w-inline-block">
                      <div className="button-text white-text">Design System</div>
                    </Link>
                    <Link to="/#experiments" className="button-icon emoji wide w-inline-block">
                      <div className="button-text">Explore Experiments</div>
                    </Link>
                  </div>
                </div>
                <img src="/images/650c6e903befcf89afa335dc_red-rounded-star.svg" loading="eager" alt="" className="image-8" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
