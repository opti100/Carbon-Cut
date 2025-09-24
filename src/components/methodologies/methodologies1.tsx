import React from 'react';

const AppleTermsOfUse = () => {
  const html =`
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CarbonCut Methodologies - Technical Framework</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #fff;
            max-width: 1100px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 10px;
            text-align: center;
        }
        
        .subtitle {
            text-align: center;
            margin-bottom: 60px;
            color: #666;
            font-size: 1.1rem;
        }
        
        h2 {
            font-size: 1.8rem;
            font-weight: 400;
            margin: 60px 0 20px 0;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        
        h3 {
            font-size: 1.4rem;
            font-weight: 400;
            margin: 40px 0 15px 0;
        }
        
        h4 {
            font-size: 1.2rem;
            font-weight: 500;
            margin: 30px 0 10px 0;
        }
        
        p {
            margin-bottom: 15px;
        }
        
        ul, ol {
            margin: 15px 0 20px 20px;
        }
        
        li {
            margin-bottom: 8px;
        }
        
        .section {
            margin-bottom: 50px;
        }
        
        .highlight {
            font-weight: 600;
            background-color: #f8f8f8;
            padding: 2px 4px;
        }
        
        .metric {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            border: 1px solid #ddd;
        }
        
        .metric h4 {
            font-size: 1.8rem;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <h1>CarbonCut Methodologies</h1>
    <p class="subtitle">Technical Framework for Marketing Emissions Measurement, Offsetting, and Tokenisation</p>

    <div class="section">
        <h2>Carbon Measurement Methodology</h2>
        
        <h3>CarbonCalculator Framework</h3>
        <p>CarbonCut quantifies CO₂e emissions across all marketing channels using a comprehensive, standards-based approach that covers the full spectrum of advertising activities.</p>
        
        <h4>Coverage Scope</h4>
        <ul>
            <li><strong>Digital Advertising:</strong> Programmatic, display, video, social media campaigns</li>
            <li><strong>Print Media:</strong> Newspapers, magazines, direct mail, brochures</li>
            <li><strong>Out-of-Home:</strong> Billboards, transit ads, digital signage</li>
            <li><strong>Events & Activations:</strong> Trade shows, conferences, experiential marketing</li>
        </ul>

        <h4>Standards Compliance</h4>
        <ul>
            <li><strong>GHG Protocol:</strong> Greenhouse Gas Protocol standards for corporate accounting and reporting of Scope 3 emissions</li>
            <li><strong>ISO 14064:</strong> International standard for greenhouse gas accounting and verification at organization level</li>
        </ul>

        <h4>Measurement Process</h4>
        <ol>
            <li><strong>Data Collection:</strong> Campaign spend, impressions, reach, duration, and media specifications</li>
            <li><strong>Emission Factors:</strong> Apply industry-specific CO₂e conversion factors per channel</li>
            <li><strong>Lifecycle Assessment:</strong> Account for production, distribution, consumption, and disposal phases</li>
            <li><strong>Third-Party Validation:</strong> Regular audits and verification by certified consultants</li>
        </ol>
    </div>

    <div class="section">
        <h2>Carbon Offsetting Methodology</h2>

        <h3>CarbonOffset Marketplace Framework</h3>
        <p>CarbonCut operates a dual-market approach, providing access to both compliance and voluntary carbon markets with full transparency and traceability.</p>

        <h4>Registry Partnerships</h4>
        <ul>
            <li><strong>Verra (VCS):</strong> Verified Carbon Standard - World's most used voluntary GHG program</li>
            <li><strong>Gold Standard:</strong> Premium carbon credits with sustainable development co-benefits</li>
            <li><strong>American Carbon Registry (ACR):</strong> First private voluntary GHG registry in the United States</li>
            <li><strong>Climate Action Reserve (CAR):</strong> Leading carbon offset registry for the North American carbon market</li>
        </ul>

        <h4>Smart Contract Integration</h4>
        <p><span class="highlight">Blockchain Architecture:</span> Every offset transaction is recorded via smart contracts, ensuring 100% transparency, traceability, and immutability of all credit retirements.</p>

        <h3>Transaction Recording Process</h3>
        <ol>
            <li><strong>Credit Selection:</strong> Curated portfolio of verified credits from global projects</li>
            <li><strong>Purchase Execution:</strong> Transaction completed through CarbonCut wallet only</li>
            <li><strong>Smart Contract Logging:</strong> Transaction completion and volume of credits retired recorded on-chain</li>
            <li><strong>Registry Retirement:</strong> Credits permanently retired in respective registry systems</li>
            <li><strong>Verification:</strong> Immutable proof of retirement available for audit</li>
        </ol>
    </div>

    <div class="section">
        <h2>Carbon Tokenisation Methodology</h2>

        <h3>CarbonCut Tokens (CCT) Framework</h3>
        <p>A percentage of all credits retired via CarbonOffset are tokenised into CarbonCut Tokens (CCTs), creating a secondary liquidity layer for carbon assets.</p>

        <h4>Tokenisation Process</h4>
        <ol>
            <li><strong>Credit Retirement:</strong> Credits officially retired in registry systems</li>
            <li><strong>Smart Contract Recording:</strong> Retirement volume logged on blockchain</li>
            <li><strong>Token Minting:</strong> CCTs minted representing portion of retired credits</li>
            <li><strong>Market Listing:</strong> Tokens available for trading on platform</li>
        </ol>

        <h4>Tokenomics Design</h4>
        <ul>
            <li><strong>Backing:</strong> Each CCT is backed by real, permanently retired carbon credits</li>
            <li><strong>Fractionalisation:</strong> Enables smaller investors to access carbon markets</li>
            <li><strong>Liquidity:</strong> Secondary market trading independent of original purchaser</li>
            <li><strong>Transparency:</strong> Full traceability to underlying offset projects</li>
        </ul>

        <div class="metric">
            <h4>100% Backed</h4>
            <p>Every CCT token represents real, retired carbon credits</p>
        </div>
    </div>

    <div class="section">
        <h2>Compliance & Reporting Methodology</h2>

        <h3>CarbonESG Dashboard Framework</h3>
        <p>Converts raw campaign data into auditable, compliance-ready ESG reports aligned with global disclosure standards.</p>

        <h4>Regulatory Alignment</h4>
        <ul>
            <li><strong>SECR (UK):</strong> Streamlined Energy and Carbon Reporting requirements for UK companies</li>
            <li><strong>CSRD (EU):</strong> Corporate Sustainability Reporting Directive for European Union entities</li>
            <li><strong>SEC Climate Rule (US):</strong> Securities and Exchange Commission climate disclosure requirements</li>
        </ul>

        <h4>Reporting Features</h4>
        <ul>
            <li><strong>Real-time Tracking:</strong> Campaign-level emission monitoring and benchmarking</li>
            <li><strong>Multi-format Export:</strong> SECR, CSRD, and SEC disclosure format compatibility</li>
            <li><strong>Multi-user Access:</strong> Team collaboration with role-based permissions</li>
            <li><strong>Automated Summaries:</strong> Client-ready reports with executive summaries</li>
            <li><strong>Audit Trail:</strong> Complete documentation for external verification</li>
        </ul>
    </div>

    <div class="section">
        <h2>Certification Methodology</h2>

        <h3>C3 Seal (CarbonCut Certified) Framework</h3>
        <p>Independent verification system that provides proof of carbon measurement and offsetting actions, reducing greenwashing risk.</p>

        <h4>Certification Criteria</h4>
        <ol>
            <li><strong>Complete Measurement:</strong> Campaign emissions quantified using CarbonCalculator</li>
            <li><strong>Verified Offsetting:</strong> Equivalent CO₂e retired through CarbonOffset marketplace</li>
            <li><strong>Transparency Standards:</strong> Full disclosure of methodology and offset sources</li>
            <li><strong>Third-party Audit:</strong> Independent verification of claims and calculations</li>
        </ol>

        <h4>Certification Outputs</h4>
        <ul>
            <li><strong>Digital Badge:</strong> Blockchain-verified seal for use in ad creatives and digital properties</li>
            <li><strong>Certificate Documents:</strong> Formal certification documents for brand reports and investor communications</li>
            <li><strong>ESG Filing Support:</strong> Compliance-ready documentation for regulatory submissions</li>
        </ul>

        <div class="metric">
            <h4>Target: 100+ Certified Campaigns</h4>
            <p>By 2027, creating industry sustainability benchmark</p>
        </div>
    </div>

    <div class="section">
        <h2>Platform Integration Methodology</h2>

        <h3>API Integration Framework</h3>
        <p>Seamless integration with DSPs, SSPs, ad exchanges, and enterprise systems through standardised APIs.</p>

        <h4>Integration Approach</h4>
        <ul>
            <li><strong>Real-time Dashboards:</strong> Live campaign carbon tracking within existing ad platforms</li>
            <li><strong>Standardised APIs:</strong> Consistent integration methodology across all platforms</li>
            <li><strong>Data Minimisation:</strong> Only essential metrics stored, ensuring privacy compliance</li>
            <li><strong>GDPR & ISO 27001 Compliance:</strong> Full data security and privacy protection</li>
        </ul>

        <h4>Target Integrations</h4>
        <ul>
            <li><strong>DSPs:</strong> Google DV360, The Trade Desk, Amazon DSP</li>
            <li><strong>SSPs:</strong> Google Ad Manager, Xandr, Magnite</li>
            <li><strong>Agencies:</strong> GroupM, Publicis, Dentsu, Omnicom</li>
            <li><strong>Enterprises:</strong> Fortune 500 & FTSE 250 advertisers</li>
        </ul>
    </div>

    <div class="section">
        <h2>Impact Measurement Methodology</h2>

        <h3>Environmental Impact Quantification</h3>
        
        <div class="metric">
            <h4>2028 Target: 8-10 MtCO₂e Offset</h4>
            <p>Equivalent to removing 1.8 million cars from roads annually</p>
        </div>

        <h4>SDG Alignment</h4>
        <ul>
            <li><strong>SDG 7:</strong> Affordable & Clean Energy through renewable offset projects</li>
            <li><strong>SDG 12:</strong> Responsible Consumption & Production in advertising practices</li>
            <li><strong>SDG 13:</strong> Climate Action through direct emission offsetting</li>
            <li><strong>SDG 15:</strong> Life on Land through forestry and conservation projects</li>
        </ul>

        <h4>Progress Tracking</h4>
        <ul>
            <li><strong>Real-time Metrics:</strong> Continuous monitoring of offset volumes and impact</li>
            <li><strong>Geographic Distribution:</strong> Global project portfolio across multiple regions</li>
            <li><strong>Project Verification:</strong> Regular monitoring of offset project performance</li>
            <li><strong>Impact Reporting:</strong> Comprehensive environmental impact assessments</li>
        </ul>
    </div>
</body>
</html>
  `


  return <div dangerouslySetInnerHTML={{ __html: html }} style={{ width: '100%', height: '100vh' }} >

  </div>
};

export default AppleTermsOfUse;