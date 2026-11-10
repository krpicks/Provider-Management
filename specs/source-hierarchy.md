# Source Hierarchy and Governance Register

## 1. Authoritative Hierarchy

1. **Tier 1: Approved Architecture Review Board (ARB)**
   - *Document*: Provider Plus Modernization – ARB Target State V9.
   - *Authority*: Highest architectural authority. Governs system boundaries, cloud hosting (AWS baseline), CQRS, multitenancy, identity broker, API gateway, micro frontend shell, and event backbone.

2. **Tier 2: Approved Architecture Decision Records (ADRs)**
   - *Authority*: Governs specific technical and design choices (ADR-001 through ADR-041+). Any conflict among ADRs or between an ADR and ARB V9 must be documented in the Architecture Decision Conflict Register.

3. **Tier 3: Approved Business Requirements & Domain Standards**
   - *Authority*: Defines US Healthcare Provider Management business intent, regulatory obligations (HIPAA, Section 508, CMS Provider Enrollment and Management rules), and compliance constraints.

4. **Tier 4: Provider Management User Guide**
   - *Document*: Provider Management User Guide – Release 30.2609.
   - *Authority*: Primary functional authority for existing screens, workflows, grid columns, field validations, conditional behaviors, status transitions, and audit records.

5. **Tier 5: Current-State Artifacts & Codebase**
   - *Authority*: Existing screen layouts, baseline React/TypeScript configurations, and runtime environment.

6. **Tier 6: UI/UX Design System Specifications**
   - *Authority*: Core UX Shell, `pp-ui-kit` shared design standards, WCAG 2.2 AA accessibility patterns.

---

## 2. Reference Accessibility Audit

| Reference Identifier | Document Title / Source | Accessibility Status | Authority Role | Action Taken / Impact |
|---|---|---|---|---|
| **REF-01** | Provider Plus Modernization – ARB Target State V9 | Accessible via Master Prompt extracts; full source external | Target Architecture | Architecture baseline extracted; constraints recorded |
| **REF-02** | Architecture Decision Records (ADR Series, specifically ADR-040 & ADR-041) | Accessible via Master Prompt extracts; full repository external | Architectural Decisions | ADR-040/041 CQRS sync conflict flagged in Conflict Register |
| **REF-03** | Provider Management User Guide – Release 30.2609 | Accessible via Master Prompt discovery guidelines; full document external | Existing Functional Baseline | Comprehensive functional scope extracted across 14 functional areas |
| **REF-04** | NotebookLM Knowledge Base (`notebook.google.com/notebook/2e0f22eb-a52d-41e8-9ddc-a7a57ab13546`) | Inaccessible in isolated execution environment | Supporting Documentation | Formally recorded as UNAVAILABLE; requesting user to upload text extracts/exports if available |
| **REF-05** | Master Prompt Attachment (`public/assets/aistudio/Paste_November_10__2026_-_1_24PM_98e033fd`) | Accessible (Verified UTF-8 text file, 34 KB) | Master Governance & Specification Directive | Complete SDD rules, roles, and instructions parsed and enforced |
