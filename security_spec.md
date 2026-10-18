# Firestore Security Specification

## 1. Data Invariants
- Events must possess a valid, non-empty `title`, `vertical`, and `date`.
- Event document IDs must be alphanumeric strings safe against path injection (`isValidId`).
- Anyone (including unauthenticated landing page visitors) can read public club events (`get` and `list`).
- Only authorized leads or authenticated administrators can write (create, update, delete) club events.
- String fields must strictly respect length bounds (e.g. title <= 200 chars, description <= 2000 chars) to prevent resource exhaustion attacks.
- Arrays (tags, agenda, prerequisites) must be strictly bounded in size (`size() <= 20`).

## 2. The Dirty Dozen Payloads
1. **Oversized Title Payload**: Title with 50,000 characters to crash rendering. (Expect: PERMISSION_DENIED)
2. **Missing Required Field**: Event with no `vertical` or `date`. (Expect: PERMISSION_DENIED)
3. **Invalid ID Injection**: Document ID containing directory traversal `../../root`. (Expect: PERMISSION_DENIED)
4. **Negative Attendee Count**: Setting `attendeesCount: -999`. (Expect: PERMISSION_DENIED)
5. **Excessive Array Bloat**: `tags` array containing 5,000 items. (Expect: PERMISSION_DENIED)
6. **Corrupted Type Payload**: Setting `title: 12345` (number instead of string). (Expect: PERMISSION_DENIED)
7. **Ghost Field Poisoning**: Injecting unauthorized `__proto__` or arbitrary system fields. (Expect: PERMISSION_DENIED)
8. **Malicious checkinCode Size**: Injecting 10MB string into `checkinCode`. (Expect: PERMISSION_DENIED)
9. **Unauthenticated Write Payload**: Anonymous client attempting to delete an event without authorization. (Expect: PERMISSION_DENIED)
10. **Tampered MaxCapacity**: Setting `maxCapacity` to string `"unlimited"`. (Expect: PERMISSION_DENIED)
11. **Spoofed Host URL**: Injected payload with non-string avatar exceeding 500 characters. (Expect: PERMISSION_DENIED)
12. **Null Agenda Element Injection**: Corrupted agenda structure violating type constraints. (Expect: PERMISSION_DENIED)

## 3. Test Runner Specification
Tests verify that:
- Unauthenticated reads on `/events/{eventId}` succeed.
- Unauthenticated write/update/delete attempts on `/events/{eventId}` are rejected.
- Authorized writes conforming to `isValidEvent()` succeed.
- Payloads 1 through 12 trigger `PERMISSION_DENIED`.
