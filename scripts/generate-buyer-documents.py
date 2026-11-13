"""
Prototype only. Generates sample PDFs for the buyer portal (/buyer/v1-iteration2):
one file per buyer document id (src/buyer-portal/buyerDocuments.ts) and one per buyer guide
(src/buyer-portal/buyerResources.ts, read through Node), into public/documents/<id>.pdf.
Reuses the styles and helpers from generate-sample-documents.py.
Run: python3 scripts/generate-buyer-documents.py
"""
import json, os, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
_src = open(os.path.join(HERE, 'generate-sample-documents.py')).read()
exec(_src[:_src.index('TERMS = [')])  # styles, facts(), ledger(), signatures(), sections(), build()

BUYERS = 'Linh Nguyen and David Nguyen'
TEAM = 'Ben Kinney Team'

build('bd-rep', 'MAR Buyer Broker Agreement', 'Exclusive Buyer Broker Agreement', 'Signed Jul 20, 2026', [
    facts([('Buyers', BUYERS), ('Agent', 'Avery Coleman, Ben Kinney Team'), ('Term', 'Jul 20, 2026 to Jan 20, 2027'), ('Area', 'Flathead County, Montana')]),
    *sections([('Services', 'The brokerage will help the buyers find, evaluate, and negotiate the purchase of a home, and coordinate the transaction through closing.'),
               ('Compensation', 'Compensation terms are set out in the attached schedule and disclosed before any offer is written.')]),
    signatures([('Linh Nguyen', 'Buyer'), ('David Nguyen', 'Buyer'), ('Avery Coleman', 'Buyer’s agent')]),
])
build('bd-preapproval', 'Glacier Home Loans · Preapproval', 'Mortgage Preapproval Letter', 'Issued Jul 22, 2026 · Valid 90 days', [
    facts([('Borrowers', BUYERS), ('Loan type', '30-year fixed, conventional'), ('Approved up to', '$700,000'), ('Loan officer', 'Cameron Tate, NMLS 448812')]),
    Spacer(1, 10), Paragraph('This preapproval is based on a review of credit, income, and assets, and is subject to an acceptable appraisal, title, and no material change in the borrowers’ finances before closing.', body),
])
build('bd-contract', 'MAR Buy-Sell Agreement · Executed', 'Residential Buy-Sell Agreement', '128 Meadowbrook Lane · Executed Oct 2, 2026', [
    facts([('Property', PROPERTY), ('Buyers', BUYERS), ('Sellers', SELLERS), ('Purchase price', '$832,500'), ('Earnest money', '$20,000, due Oct 5, 2026'), ('Closing', 'Nov 6, 2026 at Flathead Title')]),
    *sections([('Inspection contingency', 'Buyers have 10 days from execution, through Oct 12, 2026 at 5:00 PM, to inspect the property and deliver any repair request or notice of termination.'),
               ('Financing contingency', 'This agreement is contingent on the buyers obtaining a written loan commitment by Oct 28, 2026.'),
               ('Possession', 'Possession transfers to the buyers at recording on the closing date.')]),
    signatures([('Linh Nguyen', 'Buyer'), ('David Nguyen', 'Buyer'), ('Tim Bennett', 'Seller'), ('Alex Bennett', 'Seller')]),
])
build('bd-disclosure', 'MAR Form 17 · Seller Property Disclosure', 'Seller Property Disclosure Statement', 'Completed by the sellers · Shared Oct 3, 2026', [
    facts([('Property', PROPERTY), ('Sellers', SELLERS)]),
    *sections([('Roof', 'Replaced 2017. No known leaks.'), ('Water', 'Private well; pump replaced 2021. No known flooding.'), ('Heating', 'Forced air furnace, 2009. Last serviced 2024.'), ('HOA', 'Foys Lake Estates. Dues $480 per year.')]),
])
build('bd-hoa', 'Foys Lake Estates HOA', 'Covenants, Bylaws, and Dues', '2026 edition', [
    *sections([('Dues', 'Annual dues are $480, billed each January.'), ('Use', 'Single-family residential use only. Exterior changes need committee approval.')]),
])
build('bd-earnest', 'Flathead Title & Escrow · Receipt #EM-30172', 'Earnest Money Receipt', 'Received Oct 5, 2026', [
    facts([('Property', PROPERTY), ('Buyers', BUYERS), ('Escrow number', 'FTE-26-30172'), ('Escrow officer', 'Priya Nair')]),
    Spacer(1, 12), ledger([('Amount received', '$20,000.00', True), ('Method', 'Wire transfer', False)]),
    Spacer(1, 10), Paragraph('These funds are held in trust and applied toward the buyers’ purchase at closing.', body),
])
build('bd-inspection', 'Big Sky Inspections · Report 26-1007', 'Home Inspection Report', 'Inspected Oct 7, 2026 by Chris Dahl', [
    facts([('Property', PROPERTY), ('Clients', BUYERS), ('Weather', 'Clear, 54°F'), ('Duration', '3 hours')]),
    *sections([('Summary', 'The home is in good overall condition for its age. Two items need attention.'),
               ('Heating', 'The furnace is 17 years old and overdue for service. Recommend a licensed HVAC service before closing.'),
               ('Deck', 'The railing on the east stairs is loose and below current height guidance. Recommend repair.'),
               ('Maintenance', ['Clean the gutters.', 'Seal the driveway cracks.', 'Replace two smoke detector batteries.'])]),
])
build('bd-repairs', 'MAR Amendment No. 1', 'Amendment: Inspection Repairs', 'Signed Oct 9, 2026', [
    facts([('Property', PROPERTY), ('Buyers', BUYERS)]),
    *sections([('Repairs', ['Sellers will have the furnace serviced by a licensed HVAC contractor before closing.', 'Sellers will replace the east deck stair railing.']),
               ('Credit', 'Sellers will credit buyers $2,500 toward closing costs.'),
               ('Inspection contingency', 'With this amendment, buyers accept the property’s condition and the inspection contingency is satisfied.')]),
    signatures([('Linh Nguyen', 'Buyer'), ('David Nguyen', 'Buyer'), ('Tim Bennett', 'Seller'), ('Alex Bennett', 'Seller')]),
])
build('bd-loan-estimate', 'Glacier Home Loans · Loan Estimate', 'Loan Estimate', 'Issued Oct 5, 2026', [
    facts([('Loan amount', '$666,000'), ('Rate', '6.125% fixed'), ('Monthly principal and interest', '$4,047'), ('Estimated cash to close', '$188,400')]),
])
build('bd-appraisal', 'Summit Appraisal Group · Form 1004', 'Uniform Residential Appraisal Report', 'Effective Oct 14, 2026', [
    facts([('Property', PROPERTY), ('Lender', 'Glacier Home Loans'), ('Opinion of value', '$835,000'), ('Contract price', '$832,500')]),
])
build('bd-insurance', 'Glacier Mutual Insurance', 'Homeowners Policy Declarations', 'Effective Nov 6, 2026', [
    facts([('Insured', BUYERS), ('Property', PROPERTY), ('Dwelling coverage', '$720,000'), ('Annual premium', '$2,140, paid from escrow')]),
])
build('bd-title', 'Flathead Title & Escrow · FT26-4471', 'Commitment for Title Insurance', 'Issued Oct 14, 2026', [
    facts([('Property', PROPERTY), ('Proposed insured', BUYERS), ('Amount', '$832,500'), ('Vested owner', SELLERS)]),
    *sections([('Requirements', ['Payoff and release of the existing deed of trust.', 'Recording of a warranty deed to the buyers.']),
               ('Exceptions', ['Foys Lake Estates covenants.', 'Utility easement along the north boundary.'])]),
])
build('bd-commitment', 'Glacier Home Loans · Commitment', 'Loan Commitment Letter', 'Issued Oct 28, 2026', [
    facts([('Borrowers', BUYERS), ('Loan amount', '$666,000'), ('Rate', '6.125% fixed, locked'), ('Expires', 'Nov 20, 2026')]),
    Spacer(1, 10), Paragraph('This commitment is final, subject only to no material change in the borrowers’ credit, income, or assets before closing.', body),
])
build('bd-cd', 'Closing Disclosure', 'Closing Disclosure', 'Issued Nov 2, 2026 · Closing Nov 6, 2026', [
    facts([('Borrowers', BUYERS), ('Property', PROPERTY), ('Loan amount', '$666,000'), ('Rate', '6.125%')]),
    Spacer(1, 12),
    ledger([('Purchase price', '$832,500.00', False), ('Loan amount', '–$666,000.00', False), ('Closing costs', '$14,120.00', False), ('Seller credit', '–$2,500.00', False), ('Earnest money deposit', '–$20,000.00', False), ('Cash to close', '$158,120.00', True)]),
])
build('bd-settlement', 'Flathead Title & Escrow · Final', 'Buyer Settlement Statement', 'Closed Nov 6, 2026', [
    facts([('Buyers', BUYERS), ('Property', PROPERTY), ('Escrow number', 'FTE-26-30172'), ('Recorded', 'Nov 6, 2026, 2:41 PM')]),
    Spacer(1, 12), ledger([('Cash to close received', '$158,120.00', True)]),
])
build('bd-deed', 'Warranty Deed · Copy', 'Warranty Deed', 'Signed Nov 6, 2026 · Recorded original to follow by mail', [
    facts([('Grantors', SELLERS), ('Grantees', BUYERS), ('Property', PROPERTY), ('County', 'Flathead')]),
])
build('bd-warranty', 'Home Warranty', 'Home Warranty Plan', 'Coverage Nov 6, 2026 to Nov 6, 2027', [
    facts([('Plan holder', BUYERS), ('Property', PROPERTY), ('Service fee', '$100 per claim'), ('Paid by', 'Sellers, at closing')]),
    *sections([('Covered', ['Heating and cooling.', 'Water heater.', 'Plumbing and electrical.', 'Kitchen appliances.'])]),
])

# ---------- Guides: the same words as the portal, read from buyerResources.ts ----------
guides = json.loads(subprocess.check_output(
    ['node', '--experimental-strip-types', '--no-warnings', '--input-type=module', '-e',
     "const m = await import('./src/buyer-portal/buyerResources.ts'); console.log(JSON.stringify(m.buyerResources))"],
    cwd=os.path.join(HERE, '..')))
for guide in guides:
    items = [(s['title'], s.get('points') or s.get('body') or '') for s in guide['sections']]
    items.append(('Questions?', 'Call or text Avery Coleman at (406) 555-0101, or message your team from the portal.'))
    build(f"res-{guide['id']}", f'A guide from the {TEAM}', guide['title'], f"For buyers at 128 Meadowbrook Lane · {guide['readingTime']}", [
        Paragraph(guide['summary'], body), *sections(items),
    ])
