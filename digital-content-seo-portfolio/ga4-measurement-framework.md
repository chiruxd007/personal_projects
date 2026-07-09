# GA4 Content Measurement Framework

Independent case-study framework for measuring whether a digital content program improves customer experience, search visibility, self-service behaviour and sales outcomes.

## Measurement goal

Content should not be judged only by traffic. For an energy retailer, useful content should help customers understand a topic, complete a task, move toward a quote or self-service action, and reduce confusion.

## Key questions to answer

1. Are customers finding the content through organic search?
2. Are they engaging with the content or leaving quickly?
3. Are they clicking helpful next steps?
4. Which content assists quote starts, moving-home actions, account logins or support journeys?
5. Which topics reduce friction or repeated searching?
6. Which pages should be refreshed, expanded or consolidated?

## Recommended GA4 content events

| Event name | Trigger | Why it matters |
|---|---|---|
| `content_scroll_50` | User reaches 50% scroll depth | Shows meaningful engagement beyond a page view |
| `content_scroll_90` | User reaches 90% scroll depth | Shows full-article consumption |
| `faq_expand` | User opens an FAQ item | Shows which questions customers care about |
| `internal_cta_click` | User clicks a quote, plan, support or moving-home CTA | Connects content to business outcomes |
| `self_service_click` | User clicks login, bill help, moving home or account action | Measures customer-experience impact |
| `content_share_click` | User shares or copies content link | Shows usefulness and trust |
| `outbound_authority_click` | User clicks trusted source or industry reference | Helps assess research behaviour |
| `blog_search_refine` | User uses internal search after content visit | Indicates unresolved questions or content gaps |

## Suggested custom dimensions

| Dimension | Example values | Use |
|---|---|---|
| `content_cluster` | bills, usage, moving_home, solar, comparison | Compare topic performance |
| `content_intent` | informational, commercial_research, support, self_service | Understand user mindset |
| `audience_type` | renter, homeowner, business, student, moving_customer | Segment content usefulness |
| `cta_type` | quote, support, login, moving_home, comparison | Track next-step behaviour |
| `content_status` | new, refreshed, evergreen, campaign | Measure refresh impact |
| `author_type` | marketing, SME, external_contributor | Compare authority content performance |

## Core reports

### 1. Organic content performance report

**Metrics:** organic sessions, engagement rate, average engagement time, scroll depth, returning users.  
**Dimensions:** landing page, content cluster, search query theme where available.  
**Decision use:** Identify which topics attract qualified traffic and which need improvement.

### 2. Content-to-conversion assisted journey report

**Metrics:** CTA clicks, quote starts, moving-home form starts, login clicks, support clicks, assisted conversions.  
**Dimensions:** content page, content cluster, CTA type, user source.  
**Decision use:** Show which educational content supports commercial or self-service outcomes.

### 3. Content refresh impact report

**Metrics:** traffic before/after refresh, engagement before/after, CTA change, ranking/visibility observations.  
**Dimensions:** page, refresh date, content status.  
**Decision use:** Prioritise content refresh work based on measurable improvement.

### 4. Customer confusion report

**Signals:** high internal-search usage after a page visit, repeated support clicks, short engagement time, high exits from important support pages.  
**Decision use:** Find topics where content is not answering the customer’s question clearly enough.

## Example monthly dashboard

| KPI | What it shows | Why it matters |
|---|---|---|
| Organic sessions by cluster | Which topics are being discovered | SEO demand and topic relevance |
| Engaged sessions | Whether visitors stay and read | Content quality and intent match |
| Scroll depth | Whether long-form content is consumed | Structure and usefulness |
| CTA clicks | Whether content drives action | Business and customer outcomes |
| Assisted conversions | Whether content supports sales/self-service | Commercial impact |
| FAQ interactions | Which questions matter most | Content gap and UX improvement |
| AI visibility notes | Whether brand appears in AI answers | GEO progress |

## Optimisation loop

1. Publish or refresh content.
2. Check early engagement and indexing behaviour.
3. Review GA4 events after enough data is collected.
4. Compare content cluster performance.
5. Improve headings, examples, FAQs, internal links and CTAs.
6. Brief SMEs where content needs stronger authority.
7. Re-measure impact after refresh.

## Stakeholder reporting format

A strong report should be readable by non-technical stakeholders:

- What changed this month?
- Which content performed best?
- Which content supported conversion or self-service?
- What did customers seem confused about?
- What should we publish or improve next?
- What risks or technical tracking gaps need attention?