"""
Seed Configuration Data for the 6 Flagship MoTA Schemes.
Notice: This is demo/configuration data based on MoTA guidelines.
Not to be claimed as live official Gazette records.
"""

INITIAL_SCHEMES_SEED = [
    {
        "id": "pre-matric-st",
        "code": "MOTA-PMS-01",
        "name": "Pre-Matric Scholarship for Scheduled Tribe Students (Class IX & X)",
        "short_name": "Pre-Matric ST",
        "category": "PRE_MATRIC",
        "tagline": "Supporting foundational secondary education and minimizing drop-out rates for ST students",
        "description": "A Centrally Sponsored Scheme implemented through State Governments/UT Administrations to assist ST students studying in Classes IX and X to reduce dropouts at the transitional secondary stage.",
        "portal_category": "School Education",
        "is_open": True,
        "academic_year": "2025-2026",
        "application_deadline": "2025-11-30",
        "target_community": "Scheduled Tribes (ST)",
        "annual_income_cap": 250000,
        "min_academic_percentage": 40.0,
        "eligibility_summary": [
            "Applicant must belong to a notified Scheduled Tribe (ST) community.",
            "Must be studying as a regular full-time student in Class IX or X in a recognized government or aided school.",
            "Annual family income from all sources must not exceed Rs. 2,50,000/- per annum.",
            "Should not be receiving any other centrally sponsored scholarship for the same period."
        ],
        "eligibility_rules": [
            {"id": "R1", "field": "category", "label": "Community Category", "operator": "EQUALS", "value": "ST", "explanation": "Applicant community must be certified as Scheduled Tribe."},
            {"id": "R2", "field": "annualFamilyIncome", "label": "Family Income Ceiling", "operator": "LESS_THAN_OR_EQUAL", "value": 250000, "explanation": "Total combined parental income ceiling is Rs. 2,50,000/- p.a."}
        ],
        "required_documents": [
            {"id": "D1", "code": "ST_CERTIFICATE", "name": "ST Caste Certificate", "description": "Issued by Tehsildar/SDM", "required": True},
            {"id": "D2", "code": "INCOME_CERTIFICATE", "name": "Income Certificate", "description": "Current FY Income proof", "required": True},
            {"id": "D3", "code": "MARKSHEET", "name": "Previous Class Marksheet", "description": "Class 8 passing marksheet", "required": True}
        ],
        "benefits": [
            {"item": "Day Scholar Maintenance Allowance", "amount": "Rs. 3,500 per annum", "frequency": "Annual", "notes": "Credited via DBT onto Aadhaar-seeded bank account"},
            {"item": "Hosteller Maintenance Allowance", "amount": "Rs. 7,000 per annum", "frequency": "Annual", "notes": "For students residing in government tribal hostels"}
        ],
        "is_demo_data": True
    },
    {
        "id": "post-matric-st",
        "code": "MOTA-POST-02",
        "name": "Post-Matric Scholarship for Scheduled Tribe Students (Classes XI to PG)",
        "short_name": "Post-Matric ST",
        "category": "POST_MATRIC",
        "tagline": "Supporting higher and professional education across colleges and universities nationwide",
        "description": "Centrally Sponsored Scheme to provide financial assistance to ST students studying at post-matriculation or post-secondary stage to enable them to complete their education.",
        "portal_category": "College & Higher Secondary",
        "is_open": True,
        "academic_year": "2025-2026",
        "application_deadline": "2025-12-15",
        "target_community": "Scheduled Tribes (ST)",
        "annual_income_cap": 250000,
        "min_academic_percentage": 45.0,
        "eligibility_summary": [
            "Applicant must belong to a recognized Scheduled Tribe.",
            "Must have passed Matriculation/Secondary Examination from a recognized Board.",
            "Enrolled in Class XI/XII, Diploma, ITI, Degree, or PG programs.",
            "Parental annual income must not exceed Rs. 2.50 Lakh from all sources."
        ],
        "eligibility_rules": [
            {"id": "R1", "field": "category", "label": "Community Category", "operator": "EQUALS", "value": "ST", "explanation": "Must possess a genuine ST Certificate certified by designated Revenue Department."},
            {"id": "R2", "field": "annualFamilyIncome", "label": "Annual Family Income", "operator": "LESS_THAN_OR_EQUAL", "value": 250000, "explanation": "Total family income ceiling is Rs. 2,50,000/- per year."}
        ],
        "required_documents": [
            {"id": "D1", "code": "ST_CERTIFICATE", "name": "ST Certificate", "description": "Original Caste Certificate", "required": True},
            {"id": "D2", "code": "INCOME_CERTIFICATE", "name": "Income Certificate", "description": "Tehsildar issued income proof", "required": True},
            {"id": "D3", "code": "MARKSHEET", "name": "10th Marksheet", "description": "Proof of secondary education", "required": True}
        ],
        "benefits": [
            {"item": "Course Tuition Fee Reimbursement", "amount": "Full non-refundable fee", "frequency": "Annual", "notes": "As approved by State Fee Regulatory Committee"},
            {"item": "Maintenance Allowance", "amount": "Up to Rs. 13,500/year", "frequency": "Annual", "notes": "Hosteller allowance"}
        ],
        "is_demo_data": True
    },
    {
        "id": "national-scholarship-top-class",
        "code": "MOTA-NSTE-03",
        "name": "National Scholarship for Higher Education of ST Students (Top Class Education)",
        "short_name": "National Scholarship",
        "category": "NATIONAL_SCHOLARSHIP",
        "tagline": "Empowering tribal talent to study in Premier Institutes (IITs, IIMs, NITs, AIIMS, NLUs)",
        "description": "Central Sector Scheme to encourage meritorious ST students to pursue quality higher education in 262 identified premier institutes of excellence across India with full financial support.",
        "portal_category": "Premier Institutes",
        "is_open": True,
        "academic_year": "2025-2026",
        "application_deadline": "2025-10-31",
        "target_community": "Scheduled Tribes (ST)",
        "annual_income_cap": 600000,
        "min_academic_percentage": 60.0,
        "eligibility_summary": [
            "ST students who have secured admission in designated Top Class Institutes (IIT, IIM, AIIMS, NIT, NLU).",
            "Total family income from all sources should not exceed Rs. 6.00 Lakh per annum.",
            "Covers full tuition fees, living expenses, book allowances, and computer grants."
        ],
        "eligibility_rules": [
            {"id": "R1", "field": "category", "label": "Caste Category", "operator": "EQUALS", "value": "ST", "explanation": "Valid ST Certificate from competent revenue officer."},
            {"id": "R2", "field": "annualFamilyIncome", "label": "Income Ceiling", "operator": "LESS_THAN_OR_EQUAL", "value": 600000, "explanation": "Income must not exceed Rs. 6,00,000/- p.a."}
        ],
        "required_documents": [
            {"id": "D1", "code": "ST_CERTIFICATE", "name": "ST Certificate", "description": "Certified tribal certificate", "required": True},
            {"id": "D2", "code": "INCOME_CERTIFICATE", "name": "Family Income Certificate", "description": "Income statement within Rs. 6.00L", "required": True},
            {"id": "D3", "code": "ADMISSION_PROOF", "name": "Institute Admission Offer", "description": "Showing rank and premier allotment", "required": True}
        ],
        "benefits": [
            {"item": "Full Tuition Fee Reimbursement", "amount": "Actual fees charged by institute", "frequency": "Annual", "notes": "Direct to institute"},
            {"item": "Living Expenses Allowance", "amount": "Rs. 3,000 per month (Rs. 36,000/yr)", "frequency": "Monthly", "notes": "Credited directly to student bank"},
            {"item": "Computer Grant", "amount": "Rs. 45,000 one-time", "frequency": "One-Time", "notes": "For laptop purchase"}
        ],
        "is_demo_data": True
    },
    {
        "id": "national-fellowship-st",
        "code": "MOTA-NF-04",
        "name": "National Fellowship for Higher Education of ST Students (M.Phil / Ph.D.)",
        "short_name": "National Fellowship",
        "category": "NATIONAL_FELLOWSHIP",
        "tagline": "Enabling research scholars to pursue Doctoral and Post-Doctoral studies in Indian Universities",
        "description": "Central Sector Scheme dedicated to provide fellowship assistance to Scheduled Tribe students who are enrolled in regular and full-time M.Phil and Ph.D. courses in recognized Universities.",
        "portal_category": "Research & Doctorate",
        "is_open": True,
        "academic_year": "2025-2026",
        "application_deadline": "2025-11-15",
        "target_community": "Scheduled Tribes (ST)",
        "annual_income_cap": 0,
        "min_academic_percentage": 55.0,
        "eligibility_summary": [
            "ST scholars enrolled in regular full-time Ph.D. or M.Phil in UGC recognized Indian universities.",
            "Must have qualified UGC-NET / CSIR-NET or University Entrance.",
            "Universal Scheme: NO parental annual income ceiling applies.",
            "Maximum tenure: 5 years for Ph.D. (2 years JRF + 3 years SRF)."
        ],
        "eligibility_rules": [
            {"id": "R1", "field": "category", "label": "Caste Category", "operator": "EQUALS", "value": "ST", "explanation": "Valid ST certificate verified against official database."},
            {"id": "R2", "field": "previousExamPercentage", "label": "PG Qualifying Marks", "operator": "GREATER_THAN_OR_EQUAL", "value": 55, "explanation": "At least 55% marks in Master degree."}
        ],
        "required_documents": [
            {"id": "D1", "code": "ST_CERTIFICATE", "name": "ST Certificate", "description": "Original Community Certificate", "required": True},
            {"id": "D2", "code": "MARKSHEET", "name": "PG Marksheet", "description": "Proof of 55%+ marks in Master's", "required": True},
            {"id": "D3", "code": "ADMISSION_PROOF", "name": "Ph.D. Joining Report", "description": "Signed by Guide and HOD", "required": True}
        ],
        "benefits": [
            {"item": "Junior Research Fellowship (JRF)", "amount": "Rs. 37,000 per month", "frequency": "Monthly", "notes": "First 2 years"},
            {"item": "Senior Research Fellowship (SRF)", "amount": "Rs. 42,000 per month", "frequency": "Monthly", "notes": "Subsequent 3 years"},
            {"item": "Contingency Grant", "amount": "Rs. 12,000 to Rs. 28,000 per annum", "frequency": "Annual", "notes": "For books, field work and consumables"}
        ],
        "is_demo_data": True
    },
    {
        "id": "national-overseas-scholarship-st",
        "code": "MOTA-NOS-05",
        "name": "National Overseas Scholarship for ST Students (Masters, Ph.D. Abroad)",
        "short_name": "National Overseas",
        "category": "NATIONAL_OVERSEAS",
        "tagline": "Supporting tribal scholars to pursue Post-Graduation and Doctorate in Top 500 Global Universities",
        "description": "Prestigious Central Sector Scheme providing full financial assistance to selected Scheduled Tribe students to pursue Master's and Ph.D. in recognized foreign universities across USA, UK, Europe, Australia, and worldwide.",
        "portal_category": "International Studies",
        "is_open": True,
        "academic_year": "2025-2026",
        "application_deadline": "2025-10-15",
        "target_community": "Scheduled Tribes (ST)",
        "annual_income_cap": 600000,
        "min_academic_percentage": 60.0,
        "eligibility_summary": [
            "ST candidates having unconditional admission offer from Top 500 QS/THE World Ranked foreign universities.",
            "Age should be below 35 years as on 1st April of selection year.",
            "Total family income must not exceed Rs. 6.00 Lakh per annum.",
            "Minimum 60% marks in qualifying Bachelor's or Master's degree."
        ],
        "eligibility_rules": [
            {"id": "R1", "field": "category", "label": "Caste Category", "operator": "EQUALS", "value": "ST", "explanation": "Strictly reserved for notified Scheduled Tribe candidates."},
            {"id": "R2", "field": "annualFamilyIncome", "label": "Income Limit", "operator": "LESS_THAN_OR_EQUAL", "value": 600000, "explanation": "Family income must not exceed Rs. 6,00,000/- p.a."}
        ],
        "required_documents": [
            {"id": "D1", "code": "ST_CERTIFICATE", "name": "ST Certificate", "description": "Certified Caste Certificate", "required": True},
            {"id": "D2", "code": "INCOME_CERTIFICATE", "name": "Income Certificate", "description": "Within Rs. 6.00L ceiling", "required": True},
            {"id": "D3", "code": "ADMISSION_PROOF", "name": "Unconditional Foreign Offer", "description": "From QS Top 500 Foreign University", "required": True}
        ],
        "benefits": [
            {"item": "Foreign Tuition Fees", "amount": "Actual tuition paid directly to foreign university", "frequency": "Annual", "notes": "Disbursed via Indian Mission"},
            {"item": "Annual Maintenance Allowance", "amount": "USD $15,400 / GBP 9,900 per annum", "frequency": "Annual", "notes": "Paid quarterly into scholar bank"}
        ],
        "is_demo_data": True
    },
    {
        "id": "dbt-fellowship-st",
        "code": "MOTA-DBT-06",
        "name": "Direct Benefit Transfer (DBT) Scheme for ST Students & Research Scholars",
        "short_name": "DBT Fellowship",
        "category": "DBT",
        "tagline": "End-to-end transparent, direct bank transfer without intermediaries",
        "description": "Centralized Direct Benefit Transfer integration channel ensuring rapid, Aadhaar-enabled automated sanctioning and disbursement of book grants and stipend top-ups directly to ST beneficiaries.",
        "portal_category": "Direct Benefits",
        "is_open": True,
        "academic_year": "2025-2026",
        "application_deadline": "2025-12-31",
        "target_community": "Scheduled Tribes (ST)",
        "annual_income_cap": 300000,
        "min_academic_percentage": 50.0,
        "eligibility_summary": [
            "ST students holding active Aadhaar-seeded bank account in any scheduled bank.",
            "Enrolled in recognized skill development or coaching programs.",
            "Annual family income not exceeding Rs. 3.00 Lakh per annum."
        ],
        "eligibility_rules": [
            {"id": "R1", "field": "category", "label": "Category", "operator": "EQUALS", "value": "ST", "explanation": "Verified ST community identity."},
            {"id": "R2", "field": "annualFamilyIncome", "label": "Income Limit", "operator": "LESS_THAN_OR_EQUAL", "value": 300000, "explanation": "Annual parental income under Rs. 3,00,000/-."}
        ],
        "required_documents": [
            {"id": "D1", "code": "ST_CERTIFICATE", "name": "ST Caste Certificate", "description": "Revenue authority certified", "required": True},
            {"id": "D2", "code": "BANK_DOCUMENT", "name": "Aadhaar-Seeded Bank Passbook", "description": "Showing NPCI mapping", "required": True}
        ],
        "benefits": [
            {"item": "Monthly Coaching Stipend", "amount": "Rs. 2,500 per month", "frequency": "Monthly", "notes": "Direct bank credit"},
            {"item": "Digital Device Grant", "amount": "Rs. 15,000 one-time", "frequency": "One-Time", "notes": "For study tablet/laptop"}
        ],
        "is_demo_data": True
    }
]
