import pg from 'pg';

const { Client } = pg;
const client = new Client({ connectionString: process.env.DATABASE_URL });

await client.connect();

// Clear existing data
await client.query('DELETE FROM blog_posts');
await client.query('DELETE FROM practice_areas');

// Insert practice areas
const practiceAreas = [
  { title: "Commercial Litigation", slug: "commercial-litigation", description: "Resolution of complex commercial disputes including breach of contract, shareholder conflicts, and debt recovery across UAE and Egyptian courts.", icon: "Scale", details: "Our litigation team handles high-stakes commercial disputes from initial filing through enforcement. We have secured favorable judgments in over 340 commercial cases across Dubai, Abu Dhabi, Ajman, and Cairo courts.", order: 1 },
  { title: "Corporate Tax Advisory", slug: "corporate-tax-advisory", description: "Strategic tax planning, VAT compliance, transfer pricing, and FTA representation for businesses operating in the UAE and MENA region.", icon: "Calculator", details: "We advise multinational corporations on corporate tax restructuring, VAT compliance frameworks, and dispute resolution with the Federal Tax Authority. Our tax team has saved clients over AED 45M in optimized tax positions.", order: 2 },
  { title: "Business Setup & Licensing", slug: "business-setup-licensing", description: "Full-service company formation in mainland UAE, free zones, and Egypt. Trade licensing, visa processing, and regulatory compliance.", icon: "Building2", details: "From trade license applications to corporate structuring, we handle the full lifecycle of business establishment in the UAE and Egypt. We have assisted in the formation of over 200 companies across various sectors.", order: 3 },
  { title: "HR & Labour Compliance", slug: "hr-labour-compliance", description: "Employment contracts, workplace disputes, MOHRE compliance, and strategic workforce advisory for growing organizations.", icon: "Users", details: "We draft enforceable employment contracts, handle termination disputes, and ensure full compliance with UAE Labour Law and Egyptian labour regulations. Our HR advisory has protected over 80 companies from wrongful termination claims.", order: 4 },
  { title: "International Arbitration", slug: "international-arbitration", description: "ICC, DIFC-LCIA, and ad-hoc arbitration across the MENA region. Cross-border dispute resolution and enforcement of arbitral awards.", icon: "Globe", details: "Our arbitration practice spans ICC, DIFC-LCIA, and ad-hoc proceedings. We have successfully represented clients in arbitrations seated in Dubai, London, and Cairo, with a particular focus on construction, energy, and M&A disputes.", order: 5 },
  { title: "Real Estate Law", slug: "real-estate-law", description: "Property transactions, lease disputes, RERA compliance, and development advisory for residential and commercial projects.", icon: "Home", details: "We handle property acquisitions, lease negotiations, RERA compliance, and development advisory. Our real estate team has facilitated transactions exceeding AED 2.8 billion across the UAE market.", order: 6 },
];

for (const area of practiceAreas) {
  await client.query(
    `INSERT INTO practice_areas (title, slug, description, icon, details, "order")
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (slug) DO UPDATE SET title=$1, description=$3, icon=$4, details=$5, "order"=$6`,
    [area.title, area.slug, area.description, area.icon, area.details, area.order]
  );
}

// Insert blog posts
const blogPosts = [
  {
    title: "UAE Corporate Tax: What Businesses Must Know in 2026",
    slug: "uae-corporate-tax-2026",
    excerpt: "The UAE's corporate tax regime has matured significantly since its introduction. This guide breaks down the latest compliance requirements, filing deadlines, and strategic considerations for businesses.",
    content: `<p>Since the introduction of corporate tax in the UAE, businesses have navigated a rapidly evolving regulatory landscape. As of 2026, the Federal Tax Authority has refined its guidance on transfer pricing, tax grouping, and free zone qualification criteria.</p>

<h3>Key Compliance Requirements</h3>
<p>All taxable persons must maintain proper accounting records for at least 7 years. The standard tax rate of 9% applies to profits exceeding AED 375,000, with a 0% rate for profits below this threshold. Free zone persons can still benefit from a 0% rate on qualifying income, provided they meet substance and activity requirements.</p>

<h3>Transfer Pricing Documentation</h3>
<p>Businesses with related-party transactions must now maintain both master files and local files. The FTA has increased its audit activity, particularly around intra-group financing and intellectual property arrangements. Our tax team has observed a 40% increase in FTA information requests over the past 18 months.</p>

<h3>Strategic Considerations</h3>
<p>Tax grouping remains a powerful tool for optimizing group positions. However, the qualifying group exemption has specific limitations that many businesses overlook. We recommend a comprehensive tax health check before the next filing cycle.</p>

<p><strong>Need tailored tax advice?</strong> <a href="/consultation">Book a consultation</a> with our corporate tax specialists.</p>`,
    category: "Corporate",
    author: "Marwan Negm",
    published_at: "2026-05-15",
    image_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&auto=format&fit=crop"
  },
  {
    title: "Navigating Real Estate Disputes in the UAE",
    slug: "real-estate-disputes-uae",
    excerpt: "Property disputes remain one of the most common legal challenges in the UAE. Whether it's a lease disagreement, off-plan delay, or boundary issue, understanding the right forum is half the battle.",
    content: `<p>Real estate disputes in the UAE can be complex, with jurisdiction split between the Rental Dispute Settlement Committees, the Dubai Land Department, and the civil courts. The choice of forum often determines the timeline and cost of resolution.</p>

<h3>Common Dispute Types</h3>
<p>Lease disputes are the most frequent, typically involving rent increases, eviction proceedings, or maintenance obligations. The RDC process in Dubai has improved significantly, with most cases now resolved within 4-6 months. Off-plan property disputes have declined as escrow regulations have tightened, but delays still occur in secondary market transactions.</p>

<h3>Prevention Strategies</h3>
<p>Properly drafted sale and purchase agreements, thorough due diligence, and clear escrow arrangements are the best prevention tools. We always advise clients to conduct a title search before any major property transaction, regardless of whether the seller is a developer or an individual.</p>

<h3>Enforcement Considerations</h3>
<p>Winning a judgment is only the first step. Enforcement mechanisms vary between emirates, and cross-emirate enforcement requires additional procedural steps. Our litigation team has developed streamlined enforcement protocols that reduce recovery timelines by an average of 3 months.</p>

<p><strong>Have a property issue?</strong> <a href="/consultation">Speak with our real estate team</a>.</p>`,
    category: "Real Estate",
    author: "Mohab Samy",
    published_at: "2026-04-22",
    image_url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&auto=format&fit=crop"
  },
  {
    title: "International Arbitration: Dubai as a Global Seat",
    slug: "international-arbitration-dubai",
    excerpt: "Dubai has solidified its position as a leading arbitration seat in the Middle East. The DIFC-LCIA and DIAC have seen record caseloads, with the UAE courts increasingly supportive of arbitration.",
    content: `<p>Dubai's arbitration ecosystem has matured rapidly. The 2023 merger of DIFC-LCIA and DIAC into a unified institution, combined with legislative reforms, has created a world-class arbitration framework that rivals London and Singapore.</p>

<h3>Why Dubai?</h3>
<p>The DIFC offers an English-language, common law-based arbitration environment within the UAE. The onshore courts, meanwhile, have significantly improved their approach to arbitration under the 2018 Federal Arbitration Law. Recent court decisions show strong support for the separability doctrine and limited grounds for setting aside awards.</p>

<h3>Enforcement Advantages</h3>
<p>The UAE is a signatory to the New York Convention, making arbitral awards enforceable in 172 countries. Within the UAE, the DIFC courts have developed robust mechanisms for converting DIFC-seated awards into enforceable judgments, both within and outside the DIFC.</p>

<h3>Practical Considerations</h3>
<p>Seat selection matters. DIFC-seated arbitrations offer confidentiality, common law procedural advantages, and access to the DIFC courts. Onshore-seated arbitrations may be more appropriate for disputes involving government entities or real property in the mainland.</p>

<p><strong>Considering arbitration?</strong> <a href="/consultation">Our arbitration team</a> can advise on seat selection and strategy.</p>`,
    category: "Dispute Resolution",
    author: "Marwan Negm",
    published_at: "2026-03-10",
    image_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop"
  },
  {
    title: "Labour Law Updates: What Employers Should Watch in 2026",
    slug: "labour-law-updates-2026",
    excerpt: "The UAE's ongoing labour law reforms continue to reshape employer obligations. From Nafis program requirements to new visa categories, staying compliant requires proactive attention.",
    content: `<p>The UAE's labour landscape has undergone significant transformation since the introduction of Federal Decree-Law No. 33 of 2021. As we move through 2026, several regulatory developments are reshaping employer obligations and employee rights.</p>

<h3>Key Regulatory Changes</h3>
<p>The Nafis program continues to evolve, with Emiratisation targets now applying to a broader range of private sector entities. The Ministry of Human Resources has increased its inspection activity, particularly around contract compliance and wage protection system compliance. New visa categories, including the Green Visa and Freelance Permit, have created new employment relationship structures that existing policies may not adequately address.</p>

<h3>Practical Compliance Steps</h3>
<p>Employers should review their employment contracts to ensure they reflect the current legal framework. Particular attention should be paid to end-of-service calculations, which have changed under the new savings scheme, and to probationary period provisions, which are now more strictly regulated.</p>

<h3>Dispute Trends</h3>
<p>We are seeing an increase in claims related to remote work arrangements, non-compete enforcement, and wrongful termination. The MOHRE's amicable settlement process remains effective for straightforward disputes, but complex cases increasingly require judicial intervention.</p>

<p><strong>Audit your HR compliance?</strong> <a href="/consultation">Book a review with our labour team</a>.</p>`,
    category: "Regulatory",
    author: "Mohab Samy",
    published_at: "2026-02-28",
    image_url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&auto=format&fit=crop"
  },
  {
    title: "Setting Up in the UAE: Free Zone vs. Mainland in 2026",
    slug: "free-zone-vs-mainland-2026",
    excerpt: "The choice between free zone and mainland company formation remains a critical decision for foreign investors. The landscape has shifted with new ownership rules and regulatory requirements.",
    content: `<p>The UAE's company formation landscape has evolved dramatically. With 100% foreign ownership now permitted in most mainland sectors, the traditional free zone advantage has narrowed. However, each structure still offers distinct benefits depending on the business model.</p>

<h3>Mainland Advantages</h3>
<p>Mainland companies can trade directly with the UAE market without the need for a local distributor or agent. They can operate anywhere in the UAE and are not restricted to a specific geographic zone. The recent removal of the UAE national agent requirement for most activities has made mainland incorporation significantly more attractive for foreign investors.</p>

<h3>Free Zone Benefits</h3>
<p>Free zones continue to offer 0% corporate tax on qualifying income, 100% profit repatriation, and streamlined visa processing. For businesses focused on regional trade, import/export, or service activities outside the UAE, free zones remain the optimal structure. The DMCC, JAFZA, and ADGM each offer sector-specific advantages.</p>

<h3>Hybrid Structures</h3>
<p>Many of our clients now operate hybrid structures: a mainland company for local market access and a free zone entity for regional operations. This approach requires careful structuring to avoid double licensing costs and tax inefficiencies.</p>

<p><strong>Not sure which structure fits your business?</strong> <a href="/consultation">Our setup team</a> can guide you through the options.</p>`,
    category: "Corporate",
    author: "Marwan Negm",
    published_at: "2026-01-15",
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop"
  },
  {
    title: "The Golden Visa: Legal Pathways to Long-Term UAE Residency",
    slug: "golden-visa-legal-pathways",
    excerpt: "The UAE Golden Visa program offers 10-year residency for investors, entrepreneurs, and specialized talents. Understanding the legal pathways and requirements is essential for applicants.",
    content: `<p>The UAE Golden Visa program has become one of the most attractive residency schemes globally. With 10-year renewable residency, no minimum stay requirements, and the ability to sponsor family members, it offers stability that traditional visas cannot match.</p>

<h3>Investment Pathway</h3>
<p>The real estate investment pathway requires a property investment of at least AED 2 million. The property can be mortgaged, but a minimum of AED 2 million equity must be demonstrated. Off-plan properties from approved developers are eligible, but the developer must meet specific criteria. Our real estate team has guided over 50 clients through the property selection and visa application process.</p>

<h3>Entrepreneur Pathway</h3>
<p>For entrepreneurs, the requirements include ownership of a registered company in the UAE with annual revenues of at least AED 1 million, or approval from a recognized business incubator. The business must be operational, and the applicant must demonstrate active involvement in management.</p>

<h3>Application Process</h3>
<p>The application involves a multi-step process: initial eligibility assessment, document preparation, submission through the ICP or GDRFA portal, medical testing, and Emirates ID issuance. The entire process typically takes 4-8 weeks, though we have seen expedited processing in certain cases.</p>

<p><strong>Considering the Golden Visa?</strong> <a href="/consultation">Our immigration team</a> can assess your eligibility and manage the application process.</p>`,
    category: "Immigration",
    author: "Mohab Samy",
    published_at: "2025-12-05",
    image_url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&auto=format&fit=crop"
  },
  {
    title: "Construction Disputes: FIDIC Contracts in the UAE Context",
    slug: "construction-disputes-fidic-uae",
    excerpt: "FIDIC contracts remain the industry standard for construction projects in the UAE. Understanding how FIDIC provisions interact with local law is critical for both contractors and employers.",
    content: `<p>FIDIC contracts are the backbone of most major construction projects in the UAE. The Red Book (1999 and 2017 editions) and the Yellow Book are the most commonly used forms. However, the interaction between FIDIC provisions and UAE law, particularly the Civil Transactions Code, creates unique challenges.</p>

<h3>Key Dispute Areas</h3>
<p>Extension of time claims remain the most frequent source of disputes. The FIDIC provisions require strict notice compliance, and failure to give timely notice can result in the loss of entitlement. Our construction team has observed that approximately 60% of EOT claims fail due to procedural defects rather than substantive issues.</p>

<h3>Dispute Resolution Clauses</h3>
<p>Most FIDIC contracts in the UAE provide for a dispute adjudication board (DAB) followed by arbitration. The DAB process is often underutilized, with parties rushing directly to arbitration. However, a well-conducted DAB process can resolve disputes at a fraction of the cost of arbitration.</p>

<h3>Local Law Considerations</h3>
<p>UAE courts have historically been reluctant to enforce DAB decisions as binding. The 2018 Arbitration Law has improved this position, but parties should still consider whether to opt for FIDIC's amicable settlement provisions before arbitration. The UAE's civil code also contains mandatory provisions on decennial liability and contractor warranties that may override certain FIDIC terms.</p>

<p><strong>Involved in a construction dispute?</strong> <a href="/consultation">Our construction team</a> has deep FIDIC expertise.</p>`,
    category: "Dispute Resolution",
    author: "Marwan Negm",
    published_at: "2025-11-18",
    image_url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&auto=format&fit=crop"
  },
  {
    title: "Egyptian Law: Foreign Investment in the New Investment Climate",
    slug: "egyptian-law-foreign-investment",
    excerpt: "Egypt's investment framework has been significantly modernized. The new Investment Law and regulatory reforms have created new opportunities, but also new compliance obligations.",
    content: `<p>Egypt's investment landscape has been transformed by the 2017 Investment Law and subsequent regulatory reforms. The General Authority for Investment and Free Zones (GAFI) has streamlined company registration, and the new companies law has introduced significant corporate governance improvements.</p>

<h3>Key Reforms</h3>
<p>The Investment Law provides guarantees against expropriation, nationalization, and seizure of investment projects. It also guarantees the right to repatriate profits and capital. The new companies law has introduced the single-shareholder company (Sole Proprietorship LLC) and the simplified joint stock company, reducing barriers to entry for small and medium investors.</p>

<h3>Tax Considerations</h3>
<p>Egypt offers tax incentives for strategic sectors, including technology, renewable energy, and manufacturing. The 5-year tax holiday for qualifying projects can significantly improve project returns. However, navigating the Egyptian Tax Authority's requirements requires careful documentation and local expertise.</p>

<h3>Dispute Resolution</h3>
<p>Egypt has strengthened its arbitration framework, with the Cairo Regional Centre for International Commercial Arbitration (CRCICA) handling a growing caseload. The Egyptian courts have generally been supportive of arbitration, though enforcement can still face delays. The GAFI offers mediation services for investment disputes, which can be faster than judicial or arbitration proceedings.</p>

<p><strong>Investing in Egypt?</strong> <a href="/consultation">Our Cairo office</a> can guide you through the regulatory framework.</p>`,
    category: "Corporate",
    author: "Mohab Samy",
    published_at: "2025-10-30",
    image_url: "https://images.unsplash.com/photo-1539768942893-daf53e448b5e?w=1200&auto=format&fit=crop"
  },
];

for (const post of blogPosts) {
  await client.query(
    `INSERT INTO blog_posts (title, slug, excerpt, content, category, author, published_at, image_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (slug) DO UPDATE SET
       title=$1, excerpt=$3, content=$4, category=$5, author=$6, published_at=$7, image_url=$8`,
    [post.title, post.slug, post.excerpt, post.content, post.category, post.author, post.published_at, post.image_url]
  );
}

await client.end();
console.log('Seeded successfully!');
console.log('Practice areas:', practiceAreas.length);
console.log('Blog posts:', blogPosts.length);
