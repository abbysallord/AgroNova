"use client";
import React, { useState } from "react";
import { IconExternalLink, IconBuildingBank, IconCheck, IconFileDescription, IconListCheck, IconSearch } from "@tabler/icons-react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalTrigger } from "@/components/ui/animated-modal";
import { cn } from "@/lib/utils";

interface Scheme {
    title: string;
    description: string;
    benefits: string[];
    eligibility: string[];
    documents: string[];
    process: string[];
    link: string;
    type: string;
    deadline: string;
}

export default function SchemesPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const schemes: Scheme[] = [
        {
            title: "PM-KISAN Samman Nidhi",
            description: "A Central Sector scheme with 100% funding from Government of India. Under the scheme an income support of ₹6,000/- per year in three equal installments will be provided to all land holding farmer families.",
            benefits: ["₹6,000 per year directly into bank account", "Paid in 3 equal installments of ₹2,000", "No intermediaries involved"],
            eligibility: ["All landholding farmer families", "Husband, Wife and Minor Children"],
            documents: ["Aadhaar Card", "Landholding Papers (Khata/Khasra)", "Bank Account Details", "Mobile Number linked to Aadhaar"],
            process: [
                "Visit the official PM-KISAN website.",
                "Go to 'Farmer Corner' -> 'New Farmer Registration'.",
                "Enter Aadhaar Number and State.",
                "Fill in the application form with land details.",
                "Submit and take a printout."
            ],
            link: "https://pmkisan.gov.in/",
            type: "Central Govt",
            deadline: "Always Open"
        },
        {
            title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
            description: "A crop insurance scheme that integrates multiple stakeholders on a single platform. It offers insurance cover against failure of the crop due to non-preventable natural risks.",
            benefits: ["Lowest premium rates for farmers (2% Kharif, 1.5% Rabi)", "Full sum insured offered for manufacturing", "Use of technology for faster claims settlement"],
            eligibility: ["All farmers growing notified crops in notified areas", "Sharecroppers and tenant farmers are also eligible"],
            documents: ["Land Possession Certificate (LPC)", "Aadhaar Card", "Bank Passbook", "Sowing Certificate"],
            process: [
                "Register on PMFBY Portal.",
                "Fill in insurance proposal form.",
                "Upload land and crop details.",
                "Pay the premium amount online or at CSC.",
                "Download the insurance policy."
            ],
            link: "https://pmfby.gov.in/",
            type: "Central Govt",
            deadline: "Seasonal (July/Dec)"
        },
        {
            title: "Kisan Credit Card (KCC)",
            description: "Provides adequate and timely credit support from the banking system under a single window with flexible and simplified procedure to the farmers for their cultivation and other needs.",
            benefits: ["Credit at subsidized interest rate of 4% (on timely repayment)", "Collateral-free loan up to ₹1.60 Lakh", "ATM enabled RuPay Debit Card"],
            eligibility: ["Farmers - individual/joint", "Tenant Farmers, Oral Lessees & Share Croppers", "SHGs or Joint Liability Groups of farmers"],
            documents: ["Application Form", "Two Passport Size Photos", "ID Proof (Aadhaar/Voter ID)", "Address Proof", "Land Records"],
            process: [
                "Visit your nearest bank branch.",
                "Ask for KCC Application Form.",
                "Submit filled form with land documents.",
                "Bank verifies details and sanctions limit.",
                "Receive KCC Card."
            ],
            link: "https://www.myscheme.gov.in/schemes/kcc",
            type: "Central Govt",
            deadline: "Always Open"
        },
        {
            title: "Soil Health Card Scheme",
            description: "Government issues soil health cards to farmers which will carry crop-wise recommendations of nutrients and fertilizers required for the individual farms.",
            benefits: ["Report card on nutrient status of soil", "Recommendations on dosage of fertilizers", "Improves soil health and crop productivity"],
            eligibility: ["All farmers in India"],
            documents: ["Aadhaar Card", "Land Records", "Mobile Number"],
            process: [
                "Soil samples collected by State Govt officials.",
                "Samples tested in Soil Testing Labs.",
                "Soil Health Card generated.",
                "Distributed to farmers via Agriculture Departments."
            ],
            link: "https://soilhealth.dac.gov.in/",
            type: "Central Govt",
            deadline: "Cycle of 2 Years"
        },
        {
            title: "Pradhan Mantri Krishi Sinchai Yojana (PMKSY)",
            description: "Focused on extending the coverage of irrigation 'Har Khet ko Pani' and improving water use efficiency 'More crop per drop'.",
            benefits: ["Subsidies for Drip/Sprinkler irrigation systems", "Assured irrigation source", "Water conservation training"],
            eligibility: ["Farmers with cultivable land", "Valid land holding"],
            documents: ["Aadhaar Card", "Land Ownership Proof", "Bank Details", "Caste Certificate (if applicable)"],
            process: [
                "Apply via State Agriculture/Horticulture Dept portal.",
                "Submit application with land documents.",
                "Inspection of site by officials.",
                "Installation of system by registered vendors.",
                "Subsidy released to bank account."
            ],
            link: "https://pmksy.gov.in/",
            type: "Central Govt",
            deadline: "State-wise"
        },
        {
            title: "Paramparagat Krishi Vikas Yojana (PKVY)",
            description: "Aiming to promote organic farming. Farmers are encouraged to form groups or clusters and take to organic farming methods.",
            benefits: ["₹50,000 per hectare for 3 years", "Financial assistance for organic inputs", "Support for marketing and branding"],
            eligibility: ["Farmers willing to practice organic farming", "Cluster of 50 acres (approx 20-50 farmers)"],
            documents: ["Aadhaar Card", "Land Documents", "Bank Account"],
            process: [
                "Form a cluster of farmers.",
                "Register on the Jaivik Kheti portal.",
                "Submit action plan through Regional Council.",
                "Receive funds in installments."
            ],
            link: "https://pgsindia-ncof.gov.in/pkvy/index.aspx",
            type: "Central Govt",
            deadline: "Project Based"
        },
        {
            title: "Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan (PM-KUSUM)",
            description: "Ensuring energy security for farmers in India, along with honoring India’s commitment to increase the share of installed capacity of electric power from non-fossil-fuel sources.",
            benefits: ["Subsidy up to 60% for solar pumps", "Income generation by selling surplus power", "Day-time reliable power for irrigation"],
            eligibility: ["Individual Farmers", "Group of Farmers", "Cooperatives", "Panchayats"],
            documents: ["Aadhaar Card", "Land Documents", "Bank Account Details"],
            process: [
                "Apply on official PM-KUSUM state portal.",
                "Submit required documents.",
                "Pay beneficiary share.",
                "Installation by impaneled vendor."
            ],
            link: "https://pmkusum.mnre.gov.in/",
            type: "Central Govt",
            deadline: "State-wise"
        },
        {
            title: "National Agriculture Market (e-NAM)",
            description: "A pan-India electronic trading portal which networks the existing APMC mandis to create a unified national market for agricultural commodities.",
            benefits: ["Better price discovery", "Transparent auction process", "Real-time payment to bank account", "Access to more buyers"],
            eligibility: ["Farmers willing to sell at APMC mandis", "FPOs"],
            documents: ["Aadhaar Card", "Bank Passbook", "Mobile Number"],
            process: [
                "Register on e-NAM portal or mobile app.",
                "Generated Gate Pass at Mandi.",
                "Quality assaying of lot.",
                "Online bidding & e-Payment."
            ],
            link: "https://enam.gov.in/",
            type: "Central Govt",
            deadline: "Always Open"
        },
        {
            title: "National Livestock Mission (NLM)",
            description: "Designed to cover all the activities required to ensure quantitative and qualitative improvement in livestock production systems and capacity building of all stakeholders.",
            benefits: ["50% capital subsidy (up to ₹50 Lakhs)", "Support for breed improvement", "Insurance for livestock", "Feed and fodder development"],
            eligibility: ["Individuals", "FPOs", "SHGs", "JLGs", "Section 8 Companies"],
            documents: ["Project Report", "Land Documents", "Bank Details", "KYC Documents", "Experience Certificate"],
            process: [
                "Apply online via NLM portal.",
                "Submit Detailed Project Report (DPR).",
                "Screening by State Level Committee.",
                "Loan sanction & Subsidy release."
            ],
            link: "https://nlm.udyamimitra.in/",
            type: "Central Govt",
            deadline: "Project Based"
        },
        {
            title: "Pradhan Mantri Matsya Sampada Yojana (PMMSY)",
            description: "A scheme to bring about Blue Revolution through sustainable and responsible development of fisheries sector in India.",
            benefits: ["Financial assistance for new ponds/tanks", "Support for biofloc/RAS units", "Insurance for fishers", "Boats and nets subsidy"],
            eligibility: ["Fishers", "Fish Farmers", "Fish Workers", "SHGs/JLGs", "Fisheries Cooperatives"],
            documents: ["Aadhaar Card", "Land/Pond Details", "Project Report", "Bank Passbook"],
            process: [
                "Submit District Fisheries Development Plan.",
                "Approval by State Level Committee.",
                "Implementation of project.",
                "Release of subsidy."
            ],
            link: "https://pmmsy.dof.gov.in/",
            type: "Central Govt",
            deadline: "Financial Year Basis"
        }
    ];

    const filteredSchemes = schemes.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto min-h-screen">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-neutral-800 dark:text-white mb-2">Government Schemes for Farmers</h2>
                <p className="text-neutral-500 dark:text-neutral-400 mb-6 max-w-2xl">
                    Access a curated list of government initiatives designed to support your farming journey.
                    Get details on eligibility, documents, and application processes instantly.
                </p>

                {/* Search Bar */}
                <div className="relative max-w-md w-full">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search schemes (e.g. Kisan Credit Card)..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                {filteredSchemes.map((scheme, idx) => (
                    <Modal key={idx}>
                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 flex flex-col h-full group hover:border-green-500/50">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-700 dark:text-green-300 group-hover:scale-110 transition-transform">
                                    <IconBuildingBank size={28} />
                                </div>
                                <span className="text-xs font-bold px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                                    {scheme.type}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-2 leading-tight">{scheme.title}</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 mb-6 flex-1">
                                {scheme.description}
                            </p>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-start gap-2 text-sm bg-neutral-50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                    <span className="font-semibold text-neutral-700 dark:text-neutral-300 shrink-0">Benefit:</span>
                                    <span className="text-neutral-600 dark:text-neutral-400 line-clamp-1">{scheme.benefits[0]}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm px-2">
                                    <span className="font-semibold text-neutral-700 dark:text-neutral-300 shrink-0">Deadline:</span>
                                    <span className={cn("font-medium", scheme.deadline.includes("Always") ? "text-green-600" : "text-amber-600")}>
                                        {scheme.deadline}
                                    </span>
                                </div>
                            </div>

                            <ModalTrigger className="w-full py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg">
                                View Full Details <IconExternalLink size={18} />
                            </ModalTrigger>
                        </div>

                        {/* Modal Content */}
                        <ModalBody>
                            <ModalContent className="overflow-y-auto max-h-[80vh]">
                                <div className="flex flex-col gap-6">
                                    {/* Header */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700 border border-green-200">
                                                Active Scheme
                                            </span>
                                            <span className="text-sm text-neutral-500">{scheme.type}</span>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                                            {scheme.title}
                                        </h2>
                                        <p className="text-neutral-600 dark:text-neutral-300">
                                            {scheme.description}
                                        </p>
                                    </div>

                                    <hr className="border-neutral-200 dark:border-neutral-800" />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Left Column: Benefits & Eligibility */}
                                        <div className="space-y-6">
                                            <section>
                                                <h4 className="text-lg font-bold text-green-700 dark:text-green-400 flex items-center gap-2 mb-3">
                                                    <IconCheck className="h-5 w-5" /> Key Benefits
                                                </h4>
                                                <ul className="space-y-2">
                                                    {scheme.benefits.map((b, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                                                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-neutral-400 shrink-0" />
                                                            {b}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </section>
                                            <section>
                                                <h4 className="text-lg font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2 mb-3">
                                                    <IconListCheck className="h-5 w-5" /> Eligibility
                                                </h4>
                                                <ul className="space-y-2">
                                                    {scheme.eligibility.map((e, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                                                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-neutral-400 shrink-0" />
                                                            {e}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </section>
                                        </div>

                                        {/* Right Column: Documents & Process */}
                                        <div className="space-y-6">
                                            <section className="bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800">
                                                <h4 className="text-lg font-bold text-amber-700 dark:text-amber-500 flex items-center gap-2 mb-3">
                                                    <IconFileDescription className="h-5 w-5" /> Documents Required
                                                </h4>
                                                <ul className="grid grid-cols-1 gap-2">
                                                    {scheme.documents.map((d, i) => (
                                                        <li key={i} className="flex items-center gap-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                                            <IconCheck className="h-4 w-4 text-green-500" /> {d}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">
                                                    How to Apply
                                                </h4>
                                                <ol className="space-y-3 relative border-l-2 border-neutral-200 dark:border-neutral-800 ml-2">
                                                    {scheme.process.map((step, i) => (
                                                        <li key={i} className="ml-6 relative">
                                                            <span className="absolute -left-[31px] top-0 h-6 w-6 rounded-full bg-neutral-100 dark:bg-neutral-800 border-2 border-white dark:border-neutral-900 flex items-center justify-center text-xs font-bold text-neutral-500">
                                                                {i + 1}
                                                            </span>
                                                            <p className="text-sm text-neutral-700 dark:text-neutral-300">{step}</p>
                                                        </li>
                                                    ))}
                                                </ol>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            </ModalContent>
                            <ModalFooter className="gap-4">
                                <p className="text-xs text-neutral-500 italic mr-auto mt-2">
                                    *Always verify details on the official portal.
                                </p>
                                <a
                                    href={scheme.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                                >
                                    Apply on Official Portal <IconExternalLink size={16} />
                                </a>
                            </ModalFooter>
                        </ModalBody>
                    </Modal>
                ))}
            </div>
        </div>
    );
}
