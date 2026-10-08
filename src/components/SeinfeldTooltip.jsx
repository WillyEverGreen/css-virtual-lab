export default function SeinfeldTooltip() {
  return (
    <>
<div className="seinfeld-tooltip-container"><div className="seinfeld-tooltip-interior"><div className="seinfeld-tooltip-top"><div className="heading-12">Pssst...do you like Seinfeld?</div><img src="images/62ef3987ca7d115422622062_x.svg" loading="lazy" data-w-id="091830ae-d547-ef60-cc67-e4476f72142e" alt="Close the tooltip" className="seinfeld-tooltip-close" /></div><div className="seinfeld-tooltip">We sure do. Click the toggle to make the content of our site <em>Seinfeld-ized</em>.</div><div className="w-embed"><style>{`
.seinfeld-tooltip-container:before {
  bottom: -42px;
  content: " ";
  display: block;
  height: 22px;
  right: 10%;
  position: absolute;
  border-color: #000 transparent transparent transparent;
  border-style: solid;
  border-width: 10px;
}


/* Yellow triangle */
.seinfeld-tooltip-container:after {
  border-left: solid transparent 10px;
  border-right: solid transparent 10px;
  border-top: solid #fffcf5 10px;
  bottom: -9px;
  content: " ";
  height: 0;
  right: 10%;
  margin-left: -13px;
  position: absolute;
  width: 0;
}

.seinfeld-tooltip-close {
	cursor: pointer;
}
`}</style></div></div></div>
    </>
  );
}
