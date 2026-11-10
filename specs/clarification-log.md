# Clarification and Architecture Conflict Register

## 1. Architecture Decision Conflict Register

### Item CR-001: CQRS Read-Model Synchronization Inconsistency (ADR-040 vs ADR-041 vs ARB Target State V9)
- **Status**: OPEN – REQUIRES ARCHITECTURE DECISION
- **Conflicting References**:
  - `ADR-040`: Proposes asynchronous event-driven read-model projection synchronization via Amazon EventBridge / SNS-SQS event backbone with eventual consistency guarantees.
  - `ADR-041`: Mandates immediate synchronous write-through/in-line read-model updating for critical financial and provider credential state transitions to prevent operator race conditions during back-to-back reviews.
  - `ARB Target State V9`: Designates CQRS separation with Kafka/Event Backbone as standard, but notes strict read-your-own-writes consistency requirements for transactional workflows (EFT, Status Change).
- **Impact**: Affects Provider Master status updates, EFT enrollment state changes, and PRN/NPPR workflow progression. If asynchronous, operator may see stale state immediately after submission without optimistic UI updates or synchronous cache invalidation.
- **Affected Components**: BFF Command Handler, Read-Model Cache/Projection Engine, Provider Master UI state machine.
- **Interim Recommended Stance**: Implement BFF-level optimistic projection cache with correlation IDs for active user sessions while backend event bus completes eventual synchronization; mark as provisional pending formal ARB clarification.

---

## 2. Business & Functional Clarification Register

### Item CL-001: Contiguous Date Rule Scope
- **Source**: User Guide Release 30.2609
- **Question**: Which exact panels require contiguous date validation (where end-date of previous record must match or precede start-date of subsequent record without gaps)?
- **Assessment**: In accordance with User Guide notes, contiguous date rules apply strictly to Provider Rates, Contracts, and primary Specialty alignments. Universal contiguous validation across all credential and association panels is explicitly prohibited to prevent blocking legitimate overlapping or episodic appointments.
- **Interim Status**: Confirmed restricted to Rates and Contracts.

### Item CL-002: EFT Account Verification Status Workflow
- **Source**: User Guide Section "EFT Enrollments and Waivers"
- **Question**: How do "Final" vs "Not Final" verification statuses restrict editing, and how are external pre-note banking responses ingested?
- **Assessment**:
  - When Account Verification Status is `Not Final` (e.g., Pending Pre-Note, Submitted), bank details, routing numbers, and account linkages are read-only or locked from direct edit; only cancellation/void is allowed.
  - When status is `Final - Verified`, account is active for disburse; edits require initiating a new change transaction with effective dating.
  - When status is `Final - Rejected`, user may re-open or enter corrected banking info with new pre-note generation.
- **Interim Status**: Logic modeled in state machine.

### Item CL-003: External Address Doctor Integration Mode
- **Source**: User Guide Section "Address Doctor Validation"
- **Question**: Does the modernization UI support interactive modal override when Address Doctor returns multiple candidate matches or partial postal matches?
- **Assessment**: Yes. Documented workflow requires: User submits address -> Address Doctor returns standardized candidate(s) or standardized suggestions -> User either selects standardized suggestion or, if permitted by security role, selects "Accept as Entered" with an audit flag recorded in the audit trail.

### Item CL-004: NotebookLM Knowledge Base Inaccessibility
- **Reference**: `https://notebook.google.com/notebook/2e0f22eb-a52d-41e8-9ddc-a7a57ab13546`
- **Status**: UNAVAILABLE
- **Mitigation**: User requested to provide exported summaries or specific source files if there are additional tenant-specific or jurisdiction-specific rules beyond Release 30.2609. Proceeding with authoritative ARB V9, ADRs, and User Guide 30.2609 baseline.
