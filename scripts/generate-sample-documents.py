"""
Prototype only. Generates realistic sample PDFs for the seller documents in
src/seller-portal/timeline-first/documentLibrary.ts, one file per document id,
into public/documents/<id>.pdf. Run: python3 scripts/generate-sample-documents.py
"""
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'documents')
os.makedirs(OUT, exist_ok=True)

INK = colors.HexColor('#1d2330')
MUTED = colors.HexColor('#5c6370')
RULE = colors.HexColor('#c9ccd2')

h_form = ParagraphStyle('form', fontName='Helvetica', fontSize=8, textColor=MUTED, leading=10)
h1 = ParagraphStyle('h1', fontName='Helvetica-Bold', fontSize=17, textColor=INK, leading=21, spaceAfter=4)
h2 = ParagraphStyle('h2', fontName='Helvetica-Bold', fontSize=10.5, textColor=INK, leading=14, spaceBefore=12, spaceAfter=4)
body = ParagraphStyle('body', fontName='Times-Roman', fontSize=10.5, textColor=INK, leading=14.5, spaceAfter=6)
small = ParagraphStyle('small', fontName='Helvetica', fontSize=8.5, textColor=MUTED, leading=11)
cell = ParagraphStyle('cell', fontName='Helvetica', fontSize=9, textColor=INK, leading=12)
cell_label = ParagraphStyle('cellLabel', fontName='Helvetica', fontSize=7.5, textColor=MUTED, leading=10)

PROPERTY = '128 Meadowbrook Lane, Kalispell, MT 59901'
SELLERS = 'Tim Bennett and Alex Bennett'
BUYERS = 'Linh Nguyen and David Nguyen'
BROKERAGE = 'Keller Williams Western Realty'


def footer(form_code):
    def draw(canvas, doc):
        canvas.saveState()
        canvas.setFont('Helvetica', 7.5)
        canvas.setFillColor(MUTED)
        canvas.drawString(0.85 * inch, 0.55 * inch, f'{form_code}  ·  {PROPERTY}')
        canvas.drawRightString(letter[0] - 0.85 * inch, 0.55 * inch, f'Page {doc.page}')
        canvas.setStrokeColor(RULE)
        canvas.line(0.85 * inch, 0.72 * inch, letter[0] - 0.85 * inch, 0.72 * inch)
        canvas.restoreState()
    return draw


def facts(rows):
    data = []
    for i in range(0, len(rows), 2):
        line = [[Paragraph(label.upper(), cell_label), Paragraph(value, cell)] for label, value in rows[i:i + 2]]
        while len(line) < 2:
            line.append('')
        data.append(line)
    table = Table(data, colWidths=[3.4 * inch, 3.4 * inch])
    table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.6, RULE), ('INNERGRID', (0, 0), (-1, -1), 0.6, RULE),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7), ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ]))
    return table


def ledger(rows):
    right = ParagraphStyle('r', parent=cell, alignment=2)
    data = [[Paragraph(f'<b>{a}</b>' if bold else a, cell), Paragraph(f'<b>{b}</b>' if bold else b, right)] for a, b, bold in rows]
    table = Table(data, colWidths=[4.6 * inch, 2.2 * inch])
    table.setStyle(TableStyle([('LINEBELOW', (0, 0), (-1, -1), 0.5, RULE), ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5)]))
    return table


def signatures(parties):
    rows = []
    for name, role in parties:
        rows.append([Paragraph('<br/><br/>______________________________________', cell), Paragraph('<br/><br/>________________', cell)])
        rows.append([Paragraph(f'{name}, {role}', small), Paragraph('Date', small)])
    table = Table(rows, colWidths=[4.6 * inch, 2.2 * inch])
    table.setStyle(TableStyle([('LEFTPADDING', (0, 0), (-1, -1), 0), ('TOPPADDING', (0, 0), (-1, -1), 0)]))
    return KeepTogether([Paragraph('Signatures', h2), table])


def sections(items):
    out = []
    for n, (title, text) in enumerate(items, 1):
        out.append(Paragraph(f'{n}. {title}', h2))
        for para in text if isinstance(text, list) else [text]:
            out.append(Paragraph(para, body))
    return out


def build(doc_id, form_code, title, subtitle, story):
    path = os.path.join(OUT, f'{doc_id}.pdf')
    doc = SimpleDocTemplate(path, pagesize=letter, leftMargin=0.85 * inch, rightMargin=0.85 * inch, topMargin=0.8 * inch, bottomMargin=1 * inch, title=title, author=BROKERAGE)
    head = [Paragraph(form_code, h_form), Spacer(1, 4), Paragraph(title, h1), Paragraph(subtitle, small), Spacer(1, 14)]
    doc.build(head + story, onFirstPage=footer(form_code), onLaterPages=footer(form_code))
    print('wrote', doc_id)


TERMS = [
    'The parties agree that time is of the essence for every deadline in this agreement. Deadlines falling on a weekend or legal holiday extend to the next business day unless the parties agree otherwise in writing.',
    'Notices under this agreement are effective when delivered in writing to the party or their licensee, including by email to the addresses on file with the brokerage.',
    'This agreement, including all addenda, is the entire agreement between the parties. Any change must be in writing and signed by all parties to be effective.',
]
common_facts = [('Property', PROPERTY), ('Legal description', 'Lot 14, Foys Lake Estates, Flathead County'), ('Seller', SELLERS), ('Listing brokerage', BROKERAGE)]

# ---------- Pre-listing ----------
build('doc-1', 'MAR Form 101 · Rev. 2026', 'Exclusive Right to Sell Listing Agreement', f'Between {SELLERS} and {BROKERAGE}', [
    facts(common_facts + [('Listing price', '$845,000'), ('Listing period', 'Aug 20, 2026 to Feb 20, 2027')]),
    *sections([
        ('Grant of exclusive right', 'Seller grants Broker the exclusive and irrevocable right to market and sell the Property for the listing period stated above, on the terms in this agreement or other terms Seller accepts.'),
        ('Broker’s obligations', ['Broker will list the Property on the Montana Regional MLS within two business days of the start date, and will market the Property using the plan reviewed with Seller during the listing consultation.', 'Broker will present all offers to Seller promptly and will keep Seller informed of showing activity and buyer feedback.']),
        ('Compensation', 'Seller agrees to pay Broker the compensation shown in the attached schedule if, during the listing period, a buyer is procured who is ready, willing, and able to purchase on these terms or terms Seller accepts.'),
        ('Seller’s representations', 'Seller represents that Seller holds title to the Property, has the authority to sign this agreement, and knows of no material defects other than those disclosed in writing.'),
        ('Marketing and access', ['Seller authorizes Broker to place a sign on the Property, install a lockbox, take photographs and video, and publish the listing to MLS and syndicated home search websites.', 'Seller will keep the Property in showing condition and will make it available for showings with reasonable notice.']),
        ('General terms', TERMS),
    ]),
    signatures([('Tim Bennett', 'Seller'), ('Alex Bennett', 'Seller'), ('Avery Coleman', 'Listing agent')]),
])

build('sd-inspection', 'Big Sky Home Inspections · Report #4471', 'Pre-Listing Home Inspection Report', 'Inspected Aug 21, 2026 · Prepared for Tim Bennett', [
    facts([('Property', PROPERTY), ('Year built', '1998'), ('Inspector', 'Dana Whitfield, MT Lic. #HI-2231'), ('Weather', 'Clear, 72°F')]),
    *sections([
        ('Summary', 'Overall, the home is in good condition for its age. No major structural concerns were observed. Items below are listed by system, with a priority for each: Safety, Repair, or Maintain.'),
        ('Roof', ['Architectural asphalt shingles, approximately 9 years old. Shingles lie flat with no missing tabs.', '<b>Maintain:</b> Clear debris from the north valley and the gutters along the rear deck.']),
        ('Exterior and grading', ['Cedar siding is in serviceable condition. Grading slopes away from the foundation on all sides.', '<b>Repair:</b> Re-caulk two window trims on the west elevation where caulk has separated.']),
        ('Structure and foundation', 'Poured concrete foundation. Minor shrinkage cracks observed in the garage slab are typical and do not indicate movement.'),
        ('Plumbing', ['PEX supply lines throughout. Water heater is a 50 gallon gas unit installed in 2019.', '<b>Safety:</b> Install a seismic strap on the water heater.']),
        ('Electrical', ['200 amp service panel. Breakers are labeled. GFCI protection present in kitchen and bathrooms.', '<b>Repair:</b> One exterior outlet on the deck lacks a weatherproof cover.']),
        ('Heating and cooling', 'Forced-air gas furnace, serviced Oct 2025. Central air conditioning cooled within the normal range during testing.'),
        ('Interior', 'Doors, windows, and floors are in serviceable condition. Kitchen appliances operated normally when tested.'),
    ]),
    Paragraph('This report reflects visible conditions on the inspection date and is not a warranty.', small),
])

build('sd-survey', 'Flathead Land Surveying · Job 26-0814', 'Boundary Survey', 'Certificate of Survey for Lot 14, Foys Lake Estates', [
    facts([('Property', PROPERTY), ('Lot area', '1.14 acres (49,658 sq ft)'), ('Surveyed', 'Aug 14, 2026'), ('Surveyor', 'R. Lindqvist, PLS #18843')]),
    *sections([
        ('Purpose', 'This survey establishes the boundary lines of the subject lot and locates existing improvements relative to those lines.'),
        ('Monuments', 'Five-eighths inch rebar with yellow plastic caps found at all four corners. No monuments were disturbed.'),
        ('Improvements', 'The house, attached garage, and rear deck lie entirely within the lot. The detached shed sits 14.2 feet from the east line, within the required setback.'),
        ('Easements', 'A 10 foot utility easement runs along the south line as shown on the recorded plat. No encroachments were observed.'),
        ('Certification', 'I certify that this survey was made under my supervision and is correct to the best of my knowledge.'),
    ]),
])

build('sd-tax', 'Flathead County Treasurer', '2025 Property Tax Statement', 'Tax year 2025 · Parcel 07-3963-14-2-08-01', [
    facts([('Owner', SELLERS), ('Property', PROPERTY), ('Assessed value', '$612,400'), ('Taxable value', '$8,573')]),
    Spacer(1, 12),
    ledger([('County general', '$1,148.20', False), ('School district 5', '$2,264.75', False), ('City of Kalispell', '$412.10', False), ('Special assessments', '$186.00', False), ('Total tax due', '$4,011.05', True)]),
    *sections([
        ('Payment schedule', 'First half due Nov 30, 2025. Second half due May 31, 2026. Both halves are marked paid.'),
        ('Proration at closing', 'Taxes for 2026 will be prorated between seller and buyer on the settlement statement based on the closing date.'),
    ]),
])

build('doc-3', 'Ben Kinney Team · Listing presentation', 'Listing Presentation', '128 Meadowbrook Lane · Prepared Aug 18, 2026', [
    *sections([
        ('Your goals', 'Sell by early November and keep showings to weekday afternoons and weekends.'),
        ('Market snapshot', ['Median sale price for comparable homes within two miles: $829,000.', 'Median days on market: 31.', 'Active competing listings in your price band: 6.']),
        ('Marketing plan', ['Professional photography, drone video, and a floor plan.', 'MLS and syndication to major home search sites.', 'Targeted social ads and a mailer to 1,200 nearby households.', 'Weekend open house during launch week.']),
        ('Recommended price', 'List at $845,000 based on recent comparable sales, condition, and the lot size.'),
    ]),
])

# ---------- Active ----------
build('sd-hoa', 'Foys Lake Estates HOA', 'Declaration of Covenants, Conditions and Restrictions', 'Amended and restated, effective Jan 1, 2026', [
    *sections([
        ('Purpose', 'These covenants protect the character and value of Foys Lake Estates and set out the rights and duties of each lot owner.'),
        ('Dues and assessments', ['Annual dues are $640 per lot, billed each January. Dues cover road maintenance, snow removal, and the shared lake access.', 'A transfer fee of $250 is due at the sale of any lot.']),
        ('Architectural review', 'Exterior changes, including fences, sheds, and paint colors, need written approval from the review committee before work begins.'),
        ('Use restrictions', ['Lots are for single family residential use. Short-term rentals under 30 days are not permitted.', 'Trailers and boats may be stored only in a garage or behind the front line of the home.']),
        ('Enforcement', 'The board may levy fines after written notice and a chance to be heard. Unpaid assessments may become a lien on the lot.'),
        ('General terms', TERMS[:2]),
    ]),
    PageBreak(),
    Paragraph('Bylaws', h1),
    *sections([
        ('Board of directors', 'The association is governed by a board of five directors elected by owners to staggered two-year terms.'),
        ('Meetings', 'An annual meeting is held each spring. Special meetings may be called by the board or by owners holding 20 percent of the votes.'),
        ('Voting', 'Each lot carries one vote. Owners may vote in person, by proxy, or by written ballot.'),
    ]),
])

def offer(price, earnest, when):
    return [
        facts([('Property', PROPERTY), ('Buyer', BUYERS), ('Seller', SELLERS), ('Offer date', when)]),
        Spacer(1, 10),
        ledger([('Purchase price', price, True), ('Earnest money', earnest, False), ('Loan type', 'Conventional, 80% of price', False), ('Closing date', 'Nov 6, 2026', False)]),
        *sections([
            ('Financing contingency', 'This offer depends on Buyer obtaining a conventional loan on the terms above. Buyer will apply within three days of acceptance.'),
            ('Inspection contingency', 'Buyer may have the property inspected within ten days of acceptance and may request repairs or terminate in writing within that period.'),
            ('Appraisal contingency', 'If the property appraises below the purchase price, Buyer may renegotiate or terminate within three days of receiving the appraisal.'),
            ('Included items', 'Refrigerator, range, dishwasher, window coverings, and the garage door openers are included in the sale.'),
            ('Expiration', 'This offer expires at 5:00 PM Mountain time two days after the offer date unless accepted in writing.'),
        ]),
        signatures([('Linh Nguyen', 'Buyer'), ('David Nguyen', 'Buyer')]),
    ]
build('sd-offer-1', 'MAR Form 201 · Buy-Sell Agreement', 'Offer to Purchase', 'First offer from Linh and David Nguyen', offer('$815,000', '$15,000', 'Sep 27, 2026'))
build('sd-offer-2', 'MAR Form 201 · Buy-Sell Agreement', 'Offer to Purchase (Revised)', 'Revised offer from Linh and David Nguyen · Accepted', offer('$832,500', '$20,000', 'Sep 30, 2026'))

build('sd-financing', 'Glacier Bank Home Lending', 'Mortgage Preapproval Letter', 'Issued Sep 26, 2026 · Valid 90 days', [
    Paragraph('To whom it may concern,', body),
    Paragraph('Linh Nguyen and David Nguyen have been preapproved for a conventional mortgage loan of up to <b>$680,000</b> toward the purchase of a primary residence, based on a review of their credit, income, and assets.', body),
    Paragraph('This preapproval is subject to a satisfactory appraisal, clear title, and no material change in the borrowers’ financial condition before closing.', body),
    Spacer(1, 18),
    Paragraph('Sincerely,<br/><br/>Rachel Moreau<br/>Senior Loan Officer, NMLS #771204<br/>Glacier Bank Home Lending', body),
])

build('doc-4', 'Ben Kinney Team · Showing feedback', 'Showing Feedback Summary', 'September 2026 · 14 showings', [
    *sections([
        ('Highlights', ['Buyers consistently praised the lot, the mountain views, and the updated kitchen.', 'Several mentioned the deck as a standout feature.']),
        ('Common concerns', ['Two buyer agents noted the primary bathroom feels dated.', 'One buyer was concerned about the gravel driveway in winter.']),
        ('Price perception', 'Most feedback described the price as fair. Two buyers felt it was slightly high relative to the bathroom condition.'),
        ('Recommendation', 'Hold price through the end of September. Revisit if showing activity drops below three per week.'),
    ]),
])

# ---------- Pending ----------
build('doc-5', 'MAR Form 201 · Buy-Sell Agreement', 'Residential Purchase Agreement', 'Fully executed Oct 2, 2026', [
    facts(common_facts + [('Buyer', BUYERS), ('Purchase price', '$832,500')]),
    *sections([
        ('Purchase price and earnest money', ['Buyer agrees to pay $832,500 for the Property. Buyer will deposit $20,000 in earnest money with Flathead Title within three business days of acceptance.', 'The balance of the purchase price will be paid at closing in good funds.']),
        ('Key dates', ['Inspection deadline: Oct 14, 2026', 'Appraisal deadline: Oct 20, 2026', 'Loan approval deadline: Oct 27, 2026', 'Closing date: Nov 6, 2026']),
        ('Title', 'Seller will furnish a standard owner’s policy of title insurance. Buyer may object to title matters within five days of receiving the title commitment.'),
        ('Condition of property', 'Seller will deliver the Property in its present condition, ordinary wear excepted, with all systems in working order on the closing date.'),
        ('Possession', 'Buyer takes possession at closing, at the time the deed is recorded, unless the parties agree otherwise in writing.'),
        ('Prorations', 'Property taxes, HOA dues, and utilities will be prorated as of the closing date.'),
        ('Default', 'If Buyer defaults, Seller may keep the earnest money as liquidated damages. If Seller defaults, Buyer may seek specific performance or a return of earnest money.'),
        ('General terms', TERMS),
    ]),
    signatures([('Linh Nguyen', 'Buyer'), ('David Nguyen', 'Buyer'), ('Tim Bennett', 'Seller'), ('Alex Bennett', 'Seller')]),
])

for doc_id, num, change in [
    ('sd-amend-1', 1, 'The inspection deadline in section 2 is extended from Oct 14, 2026 to Oct 16, 2026, so the buyer’s inspector can complete a sewer scope.'),
    ('sd-amend-2', 2, 'The washer and dryer in the laundry room are added to the items included in the sale, at no additional cost.'),
]:
    build(doc_id, 'MAR Form 210 · Addendum', f'Addendum No. {num}', 'To the Purchase Agreement dated Oct 2, 2026', [
        facts([('Property', PROPERTY), ('Buyer', BUYERS)]),
        *sections([('Change', change), ('All other terms', 'All other terms of the Purchase Agreement remain unchanged and in full effect.')]),
        signatures([('Linh Nguyen', 'Buyer'), ('Tim Bennett', 'Seller')]),
    ])

qs = [
    ('Roof', 'Are you aware of any past or present leaks or other defects in the roof?', 'No'),
    ('Water', 'Are you aware of any flooding, drainage, or standing water problems?', 'No'),
    ('Foundation', 'Are you aware of any cracks or settling in the foundation beyond normal shrinkage?', 'No'),
    ('Systems', 'Are you aware of any defects in plumbing, electrical, heating, or cooling systems?', 'No'),
    ('Permits', 'Were any additions or remodeling done without required permits?', 'No'),
    ('Environmental', 'Are you aware of radon testing, mold, or asbestos on the property?', 'Radon tested 2021, below action level'),
    ('HOA', 'Is the property subject to a homeowners association?', 'Yes, Foys Lake Estates'),
    ('Other', 'Is there anything else that may affect the value or desirability of the property?', '________________'),
]
qt = Table([[Paragraph('<b>Topic</b>', cell), Paragraph('<b>Question</b>', cell), Paragraph('<b>Answer</b>', cell)]] + [[Paragraph(a, cell), Paragraph(b, cell), Paragraph(c, cell)] for a, b, c in qs], colWidths=[1.1 * inch, 3.9 * inch, 1.8 * inch])
qt.setStyle(TableStyle([('LINEBELOW', (0, 0), (-1, -1), 0.5, RULE), ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('TOPPADDING', (0, 0), (-1, -1), 6), ('BOTTOMPADDING', (0, 0), (-1, -1), 6)]))
build('doc-2', 'MAR Form 17 · Seller Property Disclosure', 'Seller Property Disclosure Statement', 'To be completed by the seller. Please review every answer.', [
    facts([('Property', PROPERTY), ('Seller', SELLERS)]),
    Spacer(1, 8),
    Paragraph('Answer each question based on your actual knowledge. This statement is not a warranty and does not replace an inspection.', body),
    qt,
    *sections([('Seller’s acknowledgment', 'Seller confirms the information above is true and complete to the best of Seller’s knowledge as of the date signed.')]),
    signatures([('Tim Bennett', 'Seller'), ('Alex Bennett', 'Seller')]),
])

build('doc-6', 'Flathead Title & Escrow · Receipt #EM-30172', 'Earnest Money Receipt', 'Received Oct 5, 2026', [
    facts([('Property', PROPERTY), ('Buyer', BUYERS), ('Escrow number', 'FTE-26-30172'), ('Escrow officer', 'Marisol Grant')]),
    Spacer(1, 12),
    ledger([('Amount received', '$20,000.00', True), ('Method', 'Wire transfer', False), ('Held in', 'Trust account, Flathead Title & Escrow', False)]),
    Spacer(1, 10),
    Paragraph('These funds are held in trust and will be applied toward the buyer’s purchase at closing, or disbursed as the purchase agreement directs.', body),
])

# ---------- Closed ----------
build('sd-settlement', 'Flathead Title & Escrow · Estimate v1', 'Estimated Seller Settlement Statement', 'Estimate prepared Oct 6, 2026 · Final figures arrive before signing', [
    facts([('Property', PROPERTY), ('Seller', SELLERS), ('Est. closing', 'Nov 6, 2026'), ('Escrow number', 'FTE-26-30172')]),
    Spacer(1, 12),
    ledger([('Sale price', '$832,500.00', True), ('Payoff of first mortgage (est.)', '–$318,940.00', False), ('Brokerage compensation', '–$41,625.00', False), ('Owner’s title policy', '–$2,180.00', False), ('Escrow and recording fees', '–$865.00', False), ('2026 property tax proration', '–$3,520.40', False), ('HOA transfer fee', '–$250.00', False), ('Estimated proceeds to seller', '$465,119.60', True)]),
    Spacer(1, 10),
    Paragraph('This is an estimate. Payoff amounts, prorations, and fees may change. Never wire funds based on emailed instructions without calling your escrow officer at a known number.', small),
])

# ---------- Resources (team guides) ----------
guides = {
    'listing-preparation': 'Getting your home ready to list', 'pricing': 'How your listing price comes together',
    'showings': 'Living in your home while it’s for sale', 'reviewing-offers': 'Reviewing offers',
    'appraisal': 'What to expect from the appraisal', 'disclosures': 'Making sense of seller disclosures',
    'closing': 'Getting ready for closing day', 'earnest-money': 'Understanding earnest money',
    'inspection': 'After the buyer’s home inspection', 'contingencies': 'What “pending” means',
}
for gid, title in guides.items():
    build(f'res-{gid}', 'A guide from the Ben Kinney Team', title, 'For sellers at 128 Meadowbrook Lane', [
        *sections([
            ('The short version', 'This guide covers what to expect at this step and where your team can help.'),
            ('What happens', 'Your team handles the details and keeps you posted in your portal. Most of this step happens in the background, and you’ll see updates as they land.'),
            ('What you can do', ['Read through the details your agent shares.', 'Keep an eye on the dates in your timeline.', 'Reach out with questions any time.']),
            ('Questions?', 'Call or text Avery Coleman at (406) 555-0101, or message your team from the portal.'),
        ]),
    ])


# Before-listing scenario: the agreement and disclosures reuse doc-1 and doc-2.
build('prep-doc-plan', 'Ben Kinney Team · Launch planning', 'Listing Launch Plan', '128 Meadowbrook Lane · Prepared Aug 24, 2026', [
    facts([('Photography', 'Aug 26, 2026'), ('Listing review', 'Aug 28, 2026'), ('Target launch', 'Sep 1, 2026'), ('Status', 'Proposed; pending your final review')]),
    *sections([
        ('Before photography', 'Tidy the rooms, clear counters and personal items, and confirm access instructions with your team.'),
        ('Review the listing', 'Your agent will share the photos and draft description. Check the property facts and tell your team about any changes before publishing.'),
        ('Launch day', 'The team is aiming to launch on September 1, pending your final review. Your agent will confirm the final date and planned marketing activities.'),
    ]),
])
