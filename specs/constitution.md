# Project Constitution: Provider Plus – Provider Management (CMS-PM)

## 1. Fundamental Principles

The Provider Plus Provider Management application is an enterprise-tier healthcare operations system governed under Spec-Driven Development (SDD). All architectural, engineering, security, and quality choices are anchored to the following non-negotiable principles:

1. **Architecture-First**: Every module, interface, and boundary must conform to the approved ARB Target State V9 and approved Architecture Decision Records (ADRs). No ad-hoc, rogue architectural patterns or undocumented shortcuts are permitted.
2. **Security-First & Zero Trust**: Provider data constitutes sensitive professional and operational healthcare data. Enforce least privilege, strict token validation (OIDC/FAPI 2.0 PKCE JWT via IRM Broker), input sanitization, and output encoding across all layers. Secrets, credentials, and plaintext tax identifiers must never be logged or exposed to the client.
3. **Strict Tenant Isolation**: Multitenancy is non-negotiable. Tenant identity must be strictly derived from the validated security token via the Tenant Registry, never from arbitrary client request parameters. Cross-tenant leakage constitutes a critical severity defect.
4. **Accessibility-First**: Mandatory compliance with WCAG 2.2 Level AA and Section 508 standards across all viewports (desktop 1920×1080/1366×768, tablet 768×1024, mobile 390×844). Verified via automated `axe-core`, Lighthouse CI, and manual keyboard navigation matrices.
5. **Domain-Driven & Feature-Modular**: High cohesion and loose coupling. Frontend code follows feature-slice architecture (Search, Dashboard, Master, Demographics, Specialties, Credentials, Associations, Financials, EFT/Waivers, Transactions, Audit, Reports) mounted inside the Core UX Shell.
6. **API Contract-First**: All backend interactions must be defined via OpenAPI contracts through the Backend-for-Frontend (BFF) and API Gateway. Direct database connections or browser-to-domain bypasses are strictly prohibited.
7. **CQRS & Event Separation**: Strict command/query separation. Read-models and write-models adhere to approved consistency and event synchronization rules.
8. **No Undocumented Business Logic**: Business rules must trace back to the authoritative Provider Management User Guide (Release 30.2609) or documented ARB requirements. Undocumented rules must be explicitly classified as `NOT DOCUMENTED` and submitted to the clarification register.
9. **Traceability Guarantee**: Continuous bidirectional traceability from ARB/ADR -> Business Requirement (BR) -> Functional Requirement (FR) -> Business Rule (RULE) -> UI Component -> API Contract -> Automated Test (AC/TC).
10. **Evidence-Based Delivery**: No capability is marked "Complete" or "Accepted" without executed test validation, accessibility audits, and convergence reporting.

---

## 2. Governance Gates & Enforcement

- **Gate 0 (Discovery & Foundation)**: Source document verification, architecture conflict register, functional catalogue, and constitution sign-off.
- **Gate 1 (Specification & Clarification)**: Granular functional and non-functional requirements with assigned identifiers (FR-PM-xxx, BR-PM-xxx, RULE-PM-xxx).
- **Gate 2 (Architecture & Tasking)**: C4 container and component diagrams, ADR resolution, and dependency-ordered tasks breakdown.
- **Gate 3 (Implementation & Unit Test)**: Component development against approved UI-kit patterns and isolated domain logic.
- **Gate 4 (Integration & Convergence)**: End-to-end workflow verification, automated accessibility checks, security review, and delta analysis.
