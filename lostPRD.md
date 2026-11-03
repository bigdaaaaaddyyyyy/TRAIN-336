# LOST
## Product Requirements Document (PRD)

**Version:** 1.1  
**Status:** MVP requirements finalized  
**Product Type:** Personalized motivational messaging web application

---

## 1. Product Overview

LOST is a personalized motivational messaging application that delivers motivational quotes to authenticated users based on their profession, current emotional state, and professional level.

The application displays motivational quotes through a simple flashcard interface. The displayed quote changes according to a globally synchronized 10-minute schedule, regardless of whether the user is actively using the application.

LOST retrieves quotes from a free external motivational quotes API and applies its own personalization logic to select relevant content.

Users configure their preferences during registration and can update their current emotional state from their dashboard.

The product prioritizes relevance, simplicity, and consistency over extensive features or user interactions.

## 2. Problem Statement

Students, professionals, and entrepreneurs experience fluctuations in motivation and confidence throughout their personal and professional journeys, which can affect their consistency and commitment to their goals.

Although motivational content is widely available, conventional quote platforms frequently deliver generic messages without considering an individual's profession, career stage, or current emotional state.

LOST addresses this gap by delivering motivational quotes selected according to users' professional identities and changing emotional states.

## 3. Product Objectives

The MVP must:

1. Deliver motivational quotes personalized to individual users.
2. Use profession, current feel, and job level as personalization attributes.
3. Display quotes through a simple, read-only flashcard interface.
4. Change the displayed quote every 10 minutes using globally synchronized intervals.
5. Maintain consistent message assignments across sessions and devices.
6. Allow users to update their current emotional state.
7. Minimize repeated quotes where alternatives are available.
8. Continue providing previously retrieved quotes when the external API is unavailable.

## 4. Target Users

LOST targets individuals who want motivational encouragement relevant to their professional lives.

Primary user groups include:

- Students and graduates.
- Interns and early-career professionals.
- Mid-level and senior professionals.
- Entrepreneurs and business owners.
- Team leads and managers.
- Individuals experiencing professional uncertainty or discouragement.

## 5. User Personalization

### 5.1 Profession

During registration, users select their profession from a predefined list.

Initial categories include:

| Category | Examples |
|---|---|
| Technology | Software Engineer, Data Analyst, Cybersecurity Specialist |
| Healthcare | Doctor, Nurse, Pharmacist |
| Business | Entrepreneur, Business Analyst |
| Finance | Accountant, Banker, Financial Analyst |
| Engineering | Civil, Mechanical, Electrical Engineer |
| Creative | Designer, Writer, Photographer |
| Education | Teacher, Lecturer, Researcher |
| Other | Custom profession |

Users must be able to specify a profession that is not listed.

The profession list should be extensible without requiring fundamental changes to the application.

### 5.2 Current Feel

Users select their current emotional state during registration.

Available options include:

- Motivated
- Unmotivated
- Overwhelmed
- Stressed
- Anxious
- Confident
- Tired
- Discouraged
- Ambitious
- Lost / Uncertain

Users can update this preference at any time through their dashboard.

The application must support both initial selection and ongoing updates.

A change in current feel must influence subsequent quote selection without requiring the user to register again.

LOST must treat this field as a user preference, not a medical assessment.

### 5.3 Job Level

Users select their current professional stage.

Available options include:

- Student
- Intern
- Junior
- Mid-level
- Senior
- Lead / Manager
- Owner / Founder
- Executive

Profession and job level must be independent attributes. For example, a software engineer may be a junior developer, senior engineer, or company founder.

## 6. Functional Requirements

### FR-01: Authentication

Users must be able to:

- Register an account.
- Log in securely.
- Log out.
- Reset a forgotten password.
- Maintain an authenticated session.

User preferences and message history must be associated with the authenticated account.

### FR-02: Onboarding

During registration, users must provide:

1. Profession.
2. Current feel.
3. Job level.

The application must validate required fields and persist the selected preferences.

Users must be able to access their dashboard after successful registration and authentication.

### FR-03: Motivational Flashcard

The dashboard must display a single motivational flashcard.

Each flashcard must contain exactly two content elements:

1. **Quote:** The motivational message.
2. **Author:** The attributed author, when available and sufficiently verified.

The interface must not display additional quote-related content such as explanations, categories, or personalized commentary.

The flashcard must:

- Be visually prominent.
- Support desktop, tablet, and mobile layouts.
- Update when the active scheduling interval changes.
- Provide a loading state while retrieving content.
- Display a previously cached quote or another appropriate fallback when a request fails.
- Present the author only when attribution is available and reliable.

LOST must not invent author names or attribute quotations to individuals without sufficient supporting evidence.

### FR-04: Read-Only Interaction

The motivational flashcard is strictly read-only.

Users can view the displayed quote but cannot interact with it through product-specific actions.

The MVP must not include:

- Liking quotes.
- Saving or bookmarking quotes.
- Sharing quotes through built-in controls.
- Commenting on quotes.
- Rating quotes.
- Voting on quotes.

The flashcard exists to deliver motivational content, not to create a social or engagement-driven experience.

### FR-05: Global 10-Minute Scheduling

LOST must use globally synchronized, fixed 10-minute intervals.

The intervals are aligned to the clock rather than individual login times.

Examples:

- 10:00–10:09:59
- 10:10–10:19:59
- 10:20–10:29:59
- 10:30–10:39:59

The next interval begins at the next 10-minute boundary.

The backend must determine the active interval using a consistent time reference, preferably UTC.

The frontend must display the quote assigned to the active interval.

#### Scheduling requirements

1. The backend determines the active global interval.
2. The system selects a quote for the authenticated user and interval.
3. The assignment is persisted or cached.
4. Requests made during the same interval return the same assigned quote.
5. The frontend detects the next interval and requests the newly assigned quote.
6. Inactive users do not require dedicated background timers.
7. Returning users receive the quote assigned to the current interval.
8. Browser refreshes must not reset the schedule.
9. Multiple devices belonging to the same user must display the same quote for the same interval.

**Example**

| Global interval | User's displayed quote |
|---|---|
| 10:00 | Quote A |
| 10:10 | Quote B |
| 10:20 | Quote C |
| 10:30 | Quote D |

If a user leaves the application at 10:02 and returns at 10:25, the application displays Quote C.

The backend does not need to run a separate timer for every user.

A new quote assignment should be generated when required by a new interval or a relevant preference change. The system must not repeatedly fetch external content simply because a user refreshes the page.

### FR-06: External Quotes API Integration

LOST must use a free external motivational quotes API as its initial content source.

The integration must support, where available:

- Retrieving quotes.
- Retrieving multiple quotes.
- Reading quote authors.
- Accessing quote tags or metadata.
- Handling API errors and rate limits.
- Caching retrieved content.

The integration must be isolated within a dedicated backend service so that the external provider can be replaced without substantial changes to the frontend.

The frontend must communicate with LOST's backend rather than directly with the external quotes API.

The chosen provider's licensing, attribution requirements, rate limits, and commercial-use restrictions must be reviewed before production deployment.

### FR-07: Personalization Engine

LOST must select quotes using the user's profession, current feel, and job level.

The proposed initial relevance weights are:

| Attribute | Weight |
|---|---:|
| Current feel | 50% |
| Profession | 30% |
| Job level | 20% |
| **Total** | **100%** |

These weights are initial design assumptions and must be validated against the available quote metadata and observed relevance.

The personalization engine must:

1. Retrieve available quotes from the local cache.
2. Identify supported tags and themes.
3. Map user preferences to relevant themes.
4. Calculate relevance scores.
5. Select a suitable quote.
6. Avoid recently assigned quotes when alternatives exist.
7. Provide a fallback when exact matches are unavailable.

For example, a junior software engineer who feels overwhelmed may receive a quote related to perseverance, learning, patience, or professional growth.

The system must not assume that every external quote API supports profession-specific or emotional-state-specific filtering.

If the API does not provide adequate metadata, LOST must apply its own categorization rules.

The application must never claim a quote is personalized through AI or advanced analysis unless that functionality is actually implemented.

### FR-08: Current Feel Management

Users must be able to update their current feel through their dashboard.

When a preference changes:

- The updated value must be saved.
- The personalization engine must use the new value.
- The application must not require re-registration.
- The user's profession and job level must remain unchanged.

The new preference should influence the next quote selection.

Because scheduling is global, the preference update must not reset the global clock or create a user-specific 10-minute schedule.

If a user changes their preference during an existing interval, LOST may assign a new quote for that user and interval. The updated assignment must then remain consistent across the user's devices.

### FR-09: Quote History and Repetition Control

LOST must maintain a record of previously assigned quotes to reduce repetition.

The system must:

- Associate quote assignments with users.
- Record the global interval.
- Record assignment timestamps.
- Avoid recently assigned quotes where alternatives exist.
- Maintain consistent assignments across devices.

For the MVP, the system should consider the last 20 assigned quotes per user when avoiding repetition.

If the available quote pool is exhausted, the system may reuse a quote rather than fail to display a message.

### FR-10: Dashboard

The authenticated dashboard must contain:

1. Motivational flashcard.
2. Current feel indicator.
3. Profession and job level.
4. Next refresh information.
5. Preference management.
6. Logout functionality.

The interface must prioritize the motivational quote.

The dashboard must not include social feeds, messaging features, productivity trackers, or other functionality outside the MVP scope.

## 7. User Journey

### First-time user

1. The user opens LOST.
2. The user creates an account.
3. The user selects a profession, current feel, and job level.
4. LOST saves the user's profile.
5. The user accesses the dashboard.
6. The system selects and displays a relevant motivational quote.
7. The flashcard updates at the next global 10-minute boundary.

### Returning user

1. The user logs in.
2. LOST determines the current global interval.
3. The backend retrieves the quote assigned to that user and interval.
4. The dashboard displays the quote and author.
5. The user can update their current feel if necessary.
6. The flashcard updates when the next global interval begins.

## 8. System Architecture

### Proposed technology stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | Secure session cookies or appropriately configured JWT authentication |
| HTTP client | Axios |
| Quote source | Free external motivational quotes API |
| Scheduling | Deterministic global 10-minute intervals |
| Caching | Database initially; Redis if required |
| Frontend deployment | Vercel |
| Backend deployment | A suitable Node.js hosting provider |

### Architectural responsibilities

**Frontend**

- Registration and login interfaces.
- Preference selection and editing.
- Motivational flashcard.
- Global interval change detection.
- Loading and error states.

**Backend**

- Authentication and authorization.
- User preference management.
- External API integration.
- Quote caching.
- Personalization and selection.
- Global interval calculation.
- Assignment persistence.
- Repetition control.

**Database**

- User accounts.
- Profession options.
- User preferences.
- Cached quotes and metadata.
- User quote assignments.

### Scheduling implementation

The global interval can be calculated from the current Unix timestamp:

`intervalStart = floor(currentTimestamp / 600) * 600`

Here, timestamps are expressed in seconds and 600 represents 10 minutes.

This allows the backend to calculate the active interval without maintaining an individual timer for each user.

A database uniqueness constraint on the user and interval assignment should prevent duplicate assignments during concurrent requests.

## 9. Database Requirements

### User

| Field | Purpose |
|---|---|
| id | Unique user identifier |
| name | User's name |
| email | Unique email address |
| passwordHash | Securely hashed password |
| createdAt | Account creation timestamp |

### UserPreference

| Field | Purpose |
|---|---|
| id | Unique preference identifier |
| userId | Associated user |
| professionId | Selected profession |
| currentFeel | Current emotional preference |
| jobLevel | Selected professional level |
| updatedAt | Last preference update |

### Profession

| Field | Purpose |
|---|---|
| id | Unique profession identifier |
| name | Profession name |
| category | Profession grouping |
| isActive | Whether the option is available |

### Quote

| Field | Purpose |
|---|---|
| id | Internal quote identifier |
| externalId | External provider identifier, when available |
| content | Quote text |
| author | Attributed author, when available |
| tags | Available quote metadata |
| source | External provider |
| createdAt | Record creation timestamp |

### UserQuote

| Field | Purpose |
|---|---|
| id | Unique assignment identifier |
| userId | Associated user |
| quoteId | Assigned quote |
| intervalStart | Start of global interval |
| assignedAt | Assignment timestamp |

A uniqueness constraint on `(userId, intervalStart)` must prevent multiple quote assignments for the same user and interval under normal operation.

If a user changes their current feel during an interval, the existing assignment may be updated transactionally to reflect the new preference.

## 10. API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register an account |
| POST | `/api/auth/login` | Authenticate a user |
| POST | `/api/auth/logout` | End the session |
| GET | `/api/users/me` | Retrieve the authenticated user's profile |
| GET | `/api/preferences` | Retrieve current preferences |
| PATCH | `/api/preferences` | Update preferences |
| GET | `/api/quotes/current` | Retrieve the current interval's assigned quote |
| GET | `/api/quotes/history` | Retrieve previously assigned quotes |

The frontend must not access protected resources without authentication.

The `/api/quotes/current` endpoint must return the assigned quote, author, and interval timing information required by the frontend.

It must return the same assignment for repeated requests within an interval unless the user's preferences change and the assignment is deliberately recalculated.

## 11. Non-Functional Requirements

| Requirement | Expected behaviour |
|---|---|
| Performance | Dashboard loads quickly under normal operating conditions. |
| Security | Passwords are securely hashed and protected endpoints require authentication. |
| Privacy | User preferences are accessible only to authorized users. |
| Availability | Cached quotes remain available during external API outages. |
| Reliability | API failures do not leave the dashboard unusable. |
| Consistency | The same user sees the same assigned quote across devices during an interval. |
| Responsiveness | Interface supports mobile, tablet, and desktop. |
| Scalability | Scheduling does not require individual background timers for every user. |
| Maintainability | External quote provider can be replaced independently of the frontend. |

## 12. MVP Scope

### Included

- User registration and authentication.
- Profession selection.
- Current feel selection and editing.
- Job level selection.
- Personalized motivational flashcard.
- External free quotes API integration.
- Global 10-minute refresh schedule.
- Read-only quote display.
- Quote and author presentation.
- Quote caching and fallback handling.
- Assignment history.
- Repetition control.
- Responsive dashboard.
- Consistent assignments across sessions and devices.

### Excluded

- Liking, saving, or bookmarking quotes.
- Sharing controls.
- Comments and community features.
- AI-generated motivational content.
- Chatbots.
- Push notifications.
- Streaks and gamification.
- Paid subscriptions.
- Daily goals and productivity tracking.
- Advanced analytics dashboards.

## 13. Acceptance Criteria

The MVP is considered ready for release when:

1. A user can register and select all three personalization attributes.
2. A user can log in and access their dashboard.
3. The dashboard displays a quote and its author when available.
4. Quote selection considers the user's saved preferences.
5. Global scheduling follows fixed 10-minute boundaries.
6. The assigned quote remains consistent throughout the same interval.
7. The quote changes at the next interval.
8. Returning users receive the assignment for the current interval.
9. Browser refreshes do not reset the global schedule.
10. Devices belonging to the same user display consistent assignments.
11. Updating current feel influences subsequent quote selection.
12. Repeated requests do not unnecessarily trigger external API calls.
13. Recent quote repetition is minimized when alternatives exist.
14. API failures are handled without breaking the dashboard.
15. The flashcard contains no interactive actions.
16. The application does not invent author attributions.
17. The application works on mobile and desktop.

## 14. Development Roadmap

| Phase | Deliverable |
|---|---|
| Phase 1 | Project setup, database design, authentication |
| Phase 2 | Onboarding, profession options, preference management |
| Phase 3 | External quotes API integration and caching |
| Phase 4 | Personalization engine and quote assignment |
| Phase 5 | Flashcard dashboard and global 10-minute scheduling |
| Phase 6 | Testing, security checks, deployment |

## 15. Final Product Decisions

The following decisions are finalized for the MVP:

| Decision | Final requirement |
|---|---|
| Scheduling | Global fixed 10-minute intervals |
| Personalization | Profession, current feel, and job level |
| Current feel | Selected during registration and editable anytime |
| Flashcard content | Quote + author |
| Interaction | Read-only |
| Content source | Free external motivational quotes API |
| Quote selection | Backend-controlled personalization |
| Repetition control | Avoid recent quotes when alternatives exist |
| Inactive users | No individual background timer required |
| Cross-device behaviour | Consistent assignment for the same user and interval |

**MVP success principle:** LOST should consistently deliver relevant motivational quotes with minimal friction. Its initial success depends on content relevance, scheduling reliability, and a simple reading experience rather than a large collection of features.