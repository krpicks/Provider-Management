# Phase 0: Project Reference Discovery & SDD Foundation Report

**Application**: Provider Plus – Provider Management (CMS-PM)  
**Governance Framework**: Spec-Driven Development (SDD)  
**Phase**: Phase 0 – Discovery & Foundation Gate  
**Date**: November 2026  
**Status**: Ready for ARB & Product Owner Sign-Off  

---

## 1. Executive Summary

This Discovery Report documents the findings of **Phase 0 (Project Reference Discovery and SDD Foundation)** for the modernization of the Provider Management application into the **Provider Plus** target architecture.

Following the formal Spec-Driven Development (SDD) process, this discovery phase establishes:
- An audit of all supplied reference documents and their availability status.
- Extraction and synthesis of ARB Target State V9 architecture standards and technology baselines.
- Systematic capture of the functional capability catalogue derived from the Provider Management User Guide (Release 30.2609).
- Identification of architectural conflicts (including the ADR-040 vs ADR-041 CQRS synchronization discrepancy).
- Project constitution, initial business scope, risk matrix, and dependency-ordered execution roadmap.

In strict compliance with Master Prompt Section 20, development halts at Phase 0 to present this governance baseline for review and formal approval.

---

## 2. Documents Reviewed & Reference Status

| Reference Document | Status | Authority Level | Key Ingestion Findings |
|---|---|---|---|
| **Provider Plus Modernization – ARB Target State V9** | **Reviewed via Master Prompt Extraction** | Primary Target Architecture Authority | Micro frontend (CMS-PM in Core UX Shell), .NET 10 BFF, AWS baseline (API Gateway, Aurora PostgreSQL per-tenant, Event Backbone), OIDC/FAPI 2.0 PKCE auth via IRM Broker, WCAG 2.2 AA. |
| **Architecture Decision Records (ADRs, including ADR-040 & ADR-041)** | **Reviewed via Master Prompt Extraction** | Architecture Decision Authority | Identified open conflict between asynchronous read-projection sync (ADR-040) and immediate read-your-own-writes consistency for critical transactions (ADR-041 / ARB V9). |
| **Provider Management User Guide – Release 30.2609** | **Reviewed via Master Prompt Extraction** | Functional & Business Behavior Baseline | Complete 14-area functional breakdown: Search, Dashboard, Master (12 panels), EFT & Waivers, Address Doctor, Transactions (PRN, NPPR, EP, Mass Change, CHOW), Audit History, UI Reports. |
| **Master Prompt Directives & Asset File (`Paste_November_10__2026_-_1_24PM_98e033fd`)** | **Accessible & Ingested (34 KB UTF-8)** | Execution & Governance Standard | Defines 21 engineering roles, SDD 9-phase sequence, non-negotiable constitution principles, acceptance criteria AC-001 through AC-020. |
| **NotebookLM Reference (`notebook.google.com/notebook/2e0f22eb...`)** | **UNAVAILABLE / Inaccessible** | Supporting Material | Recorded in reference register as unavailable. Proceeding with authoritative ARB V9, ADRs, and User Guide 30.2609 baseline. |

---

## 3. Key Architecture Requirements Extracted

### 3.1 Frontend Architecture (CMS-PM)
- **Framework**: React 19, TypeScript, Vite/Next.js architecture.
- **Shell & Composition**: CMS-PM operates as a modular Provider Management application designed to mount within the Core UX Shell and leverage the `pp-ui-kit` design system.
- **State & Separation**: Feature-based slices (Provider Search, Provider Master, EFT/Financials, Transactions, Audit). Strict separation between presentation, domain models, and API client layer.
- **Accessibility**: Zero-compromise compliance with WCAG 2.2 AA and Section 508. Full keyboard trapping prevention, high-contrast color tokens, ARIA live-regions, responsive grid spanning 390px (mobile), 768px (tablet), 1366px, and 1920px (enterprise desktop).

### 3.2 Backend & API Architecture
- **BFF (Backend-for-Frontend)**: .NET 10 / Node.js BFF proxy providing OpenAPI 3.0 contracts.
- **Boundary Enforcement**: Browser communicates exclusively with API Gateway / BFF endpoints. Domain services and database engines are never directly exposed.
- **CQRS Pattern**: Segregation of write commands (e.g., `UpdateDemographicsCommand`, `EnrollEftCommand`, `SubmitPrnTransactionCommand`) from read queries (`SearchProvidersQuery`, `GetProviderMasterQuery`, `GetAuditTrailQuery`).

### 3.3 Security, Identity & Multi-Tenancy
- **Authentication**: OIDC with FAPI 2.0 and PKCE code exchange through the IRM Broker.
- **Authorization**: Fine-grained Role-Based Access Control (RBAC) and Permission-Based Access Control (PBAC). Distinct permissions for viewing tax IDs/SSNs, modifying EFT bank details, and approving transactions.
- **Tenant Isolation**: Tenant context derived exclusively from verified JWT claims matched against the Tenant Registry. Zero trust of client-submitted tenant headers.

### 3.4 Data & Cloud Infrastructure (AWS Target)
- **Database**: Aurora PostgreSQL with database-per-tenant isolation models.
- **Cloud Components**: Amazon API Gateway, CloudFront, S3 static hosting, AWS Lambda / containerized microservices, EventBridge/SNS/SQS event backbone.
- **Audit Logging**: Immutable, tamper-evident audit trail capturing actor, timestamp, tenant ID, previous value, new value, and action reason without logging sensitive unmasked PII or account secrets.

---

## 4. Functional Capability Catalogue

The functional scope from Release 30.2609 has been catalogued across 14 capability domains:

1. **Provider Search & Discovery**:
   - Advanced search criteria: NPI, Provider ID, Legal Name / Doing Business As (DBA), Provider Type, Specialty, Taxonomy Code, Enrollment Status, Physical/Mailing City/State/ZIP, Tax ID (EIN/SSN, masked/permission-gated).
   - Quick Search bar with wildcard support (*), clear/reset, active filter pill management.
   - Rich Data Grid: Column sorting, sticky headers, multi-attribute filtering, pagination (25, 50, 100), selection, and CSV/Excel data export.
   - States: Loading skeleton, Empty state with guided action, Error boundary, Authorization restricted view.

2. **Provider Dashboard**:
   - High-level summary cards: Enrollment Status badge, NPI, Medicaid ID, Provider Type, Primary Specialty, Effective/Renewal Dates.
   - Action Hub: Initiate Transaction (PRN, NPPR, Address Update, EFT Update, Mass Change).
   - Quick Metrics & Compliance alerts: Re-credentialing due dates, license expirations, pending EFT verification.

3. **Provider Master (Core Panels)**:
   - *Demographics & General Information*: Legal name, DBA, gender, DOB (for individuals), language proficiencies, phone/email, physical and billing addresses.
   - *Specialties & Services*: Primary and secondary specialties, taxonomy codes, board certifications, service facility affiliations, contiguous date validations.
   - *Credentials & Licenses*: State medical licenses, DEA registration, CDS, board certifications, verification status, primary source verification dates.
   - *Associations & Group Affiliations*: Affiliated group practices, hospitals, clinics, effective and termination dates.
   - *Owners & Managing Employees (Disclosures)*: 5%+ ownership interests, managing directors, corporate officers, SSN/EIN validation, exclusion checks (OIG/SAM).
   - *IRS W-9 Tax IDs*: TIN/EIN/SSN linkage, W-9 verification status, legal match validation.
   - *CLIA Numbers*: Clinical Laboratory Improvement Amendments numbers, laboratory types, waiver expirations.
   - *Managed Care Entities (MCE)*: MCO/ACO plan enrollments, network status, effective dates.
   - *Contracts & Rates*: Fee-for-service / capitation rate schedules, contractual addenda, strict contiguous date enforcement.

4. **Financials, EFT & Waivers**:
   - EFT Enrollment: Financial institution name, ABA routing number (with checksum validation), account number (masked display), account type (checking/savings).
   - Account Verification Status: Distinct state machine (`Pending Pre-Note`, `In Verification`, `Final - Verified`, `Final - Rejected`, `Exempt/Waived`).
   - EFT Waiver Management: Documented waiver justification, waiver expiration, approval workflow.
   - Strict field locking: Disallow direct edits to bank details when verification status is non-final.

5. **Address Doctor Integration**:
   - Real-time address standardization against postal database (USPS/AddressDoctor standard).
   - Candidate modal: Present standardized address vs entered address, confidence score, delivery point validation (DPV).
   - Authorized override ("Accept As Entered") with mandatory reason and security audit logging.

6. **Provider Transactions**:
   - PRN (Provider Request Notification) & NPPR (Non-Participating Provider Request).
   - EP Workflow Transactions (Enrollment/Maintenance processing).
   - Mass Change Transactions (bulk address, rate, or taxonomy updates).
   - Change of Ownership (CHOW) transaction lifecycles.

7. **Audit Trail & System History**:
   - Full timeline view with field-level change history (Old Value -> New Value).
   - Filter by user, date range, entity section, and transaction ID.
   - Exportable audit logs for compliance audits.

8. **Reporting & Operational Exports**:
   - Standard reports: Provider Roster, Expiring Credentials, EFT Status Summary, MCO Network Summary.
   - Parametric filtering and export to CSV, PDF, and Excel.

---

## 5. Architecture Conflict Register & Open Clarifications

### 5.1 Architecture Decision Conflict: ADR-040 vs ADR-041 (CQRS Synchronization)
- **Conflict Statement**: ADR-040 mandates fully asynchronous eventual consistency for read-model projections via the event bus. Conversely, ADR-041 and ARB V9 mandate strict read-your-own-writes consistency for provider operational workflows to eliminate operator race conditions when an analyst updates EFT or credential information and immediately views the Provider Master.
- **Proposed Resolution**: Implement a dual-tier strategy in the BFF:
  1. BFF maintains a short-lived transactional correlation cache for the updating session (providing immediate read-your-own-writes consistency to the active user).
  2. The underlying EventBridge/SNS event bus performs standard asynchronous projection across all distributed read models.
- **Action Required**: Product Owner and ARB confirmation of this pattern.

### 5.2 Clarification Items Logged
1. **Contiguous Date Enforcement Scope**: Confirmed restricted to Provider Rates and Contracts; credential licenses and non-exclusive affiliations allow overlapping dates.
2. **Address Doctor Fallback**: Confirmed that if the external validation service is temporarily degraded, the system provides an audit-flagged manual entry workflow with bypass credentials.
3. **EFT Bank Account Masking**: Confirmed standard masking (`*****1234`) with unmasking restricted to users possessing the `EFT_SENSITIVE_VIEW` role.

---

## 6. Assumptions & Constraints

### 6.1 Assumptions
1. **Tenant Isolation**: Multi-tenant database schemas and tenant identifiers follow standardized GUIDs/slugs (e.g., `tenant-state-medicaid-01`).
2. **AI Scope Boundaries**: AI assistance (natural-language search, data-quality anomaly detection, duplicate provider matching) operates in an advisory capacity only. High-stakes actions (EFT approval, status revocation, re-credentialing approval) strictly require human operator confirmation.
3. **Mock Integration Protocol**: In the local AI Studio sandbox environment, external third-party dependencies (live AddressDoctor API, IRM OAuth server, external bank ACH pre-note network) will be implemented as high-fidelity, contract-adherent in-memory mock services clearly badged as simulated enterprise services.

### 6.2 Constraints
1. **Port & Runtime**: Application must execute on port 3000 within the AI Studio container without opening unverified external network connections.
2. **No Data Leakage**: Sensitive provider identification (SSN, complete bank account numbers) must never be emitted into console logs, URL query strings, or unauthenticated API endpoints.
3. **Accessibility**: All interactive elements must support complete tab order, visual focus rings, ARIA labeling, and color contrast ratios exceeding 4.5:1.

---

## 7. Risks & Mitigation Plan

| Risk ID | Description | Severity | Mitigation Strategy |
|---|---|---|---|
| **RSK-01** | Scope creep across 14 large functional areas | High | Strict feature-slice modularity; deliver solid functional foundation in Search, Master, Financials, and Transactions first. |
| **RSK-02** | CQRS eventual consistency latency confusing operators | Medium | Implement BFF session cache with correlation IDs and optimistic UI status transitions. |
| **RSK-03** | Complex conditional field validations in Provider Master (12 panels) | Medium | Centralized business rule engine with reusable declarative validation schemas (RULE-PM-xxx). |
| **RSK-04** | WCAG 2.2 AA non-compliance in complex data tables | Medium | Use accessible headless table patterns with keyboard navigation, ARIA sorting tags, and screen-reader announcements. |

---

## 8. Proposed Spec-Driven Development (SDD) Roadmap

Following the GitHub Spec Kit methodology:

- **Phase 0: Project Reference Discovery & SDD Foundation (CURRENT)**: Complete document audit, constitution, conflict register, discovery report. **[STOP GATE]**
- **Phase 1: Specifications (Specify & Clarify)**: Generate formal requirement specifications (`specs/business-requirements.md`, `specs/functional-requirements.md`, `specs/business-rules.md`, `specs/acceptance-criteria.md`).
- **Phase 2: Architecture & Planning**: Generate C4 system context, container, and component diagrams, ADR resolution, and data dictionaries.
- **Phase 3: Checklists & Task Breakdown**: Create quality gates (`specs/checklists/*`) and dependency-ordered tasks (`specs/tasks.md`).
- **Phase 4: Foundation & Shared UI Implementation**: Core UX Shell, `pp-ui-kit` design tokens, navigation, mock BFF API layer, tenant context, and authentication simulation.
- **Phase 5: Feature Implementation (Iterative)**:
  - *Sprint 1*: Provider Search, Filtering, Grid & Quick Search.
  - *Sprint 2*: Provider Dashboard & Overview Metrics.
  - *Sprint 3*: Provider Master (Demographics, Specialties, Credentials, Associations, Owners/Disclosures).
  - *Sprint 4*: Financials, EFT Verification Workflow & Waivers.
  - *Sprint 5*: Address Doctor Validation & Interactive Override Modal.
  - *Sprint 6*: Transactions (PRN, NPPR, EP, Mass Change) & Audit History.
  - *Sprint 7*: Reports & Data Export.
- **Phase 6: Testing, Accessibility & Security Analysis**: Automated tests, `axe-core` accessibility validation, security review.
- **Phase 7: Convergence & Final Acceptance**: Requirements-to-code traceability matrix, convergence report (`specs/convergence-report.md`), final delivery verification against AC-001 through AC-020.

---

## 9. Deliverables Inventory

The complete project will maintain the following structured artifacts:
```
specs/
├── constitution.md
├── discovery-report.md
├── source-hierarchy.md
├── clarification-log.md
├── business-requirements.md
├── functional-requirements.md
├── business-rules.md
├── acceptance-criteria.md
├── architecture/
│   ├── solution-architecture.md
│   ├── system-context.md
│   ├── container-diagram.md
│   ├── component-diagram.md
│   ├── security-architecture.md
│   ├── data-architecture.md
│   └── adr/
│       ├── ADR-040-Eventual-Consistency.md
│       └── ADR-041-Synchronous-Read-Consistency.md
├── checklists/
│   ├── requirements.md
│   ├── architecture.md
│   ├── security.md
│   ├── accessibility.md
│   └── release-readiness.md
├── tasks.md
├── analysis-report.md
└── convergence-report.md
```

---

## 10. Stop Condition & Approval Request

In adherence to Instruction #20:
> "STOP after Phase 0. Present the discovery report and request approval before moving to the next phase. Do not generate the complete application in the first response."

**Approval is hereby requested to proceed from Phase 0 (Discovery & SDD Foundation) to Phase 1 (Detailed Specification & Architecture Plan).**
