
# CitiZen: Comprehensive Technical Documentation

## Introduction
CitiZen is a robust AI-driven civic issue reporting platform designed to modernize municipal governance. Citizens, municipal staff, NGOs, and field workers interact in real-time for issue reporting, resolution, and monitoring. Gamification, multilingual support, instant ML-powered classification, and seamless stakeholder integration set CitiZen apart.

## Core Modules
- **Citizen Reporting**: Submit complaints with photos, text, voice, and geolocation. Easy onboarding, multi-language support, and reward incentives.
- **AI Issue Classification**: YOLO v11 performs image-based detection, auto-classifies issues, and routes them to relevant departments.
- **Admin Dashboard**: Real-time analytics, complaint assignment, performance tracking, and history logs.
- **Worker App**: Mobile app with task lists, route suggestions, status updates, achievement badges, and proof uploads.
- **NGO Portal**: Register, view available issues, apply for tasks, update progress, and receive points/funding rewards.
- **Notifications & Tracking**: Live push notifications, status bars, and instant updates at every project stage.
- **Governance & Transparency**: Immutable logs, administrative controls, and RLS for secure data access; future integration ready for blockchain audit trails.
- **Monitoring & Analytics**: Prometheus/Grafana to track API performance, ML model accuracy, and user activity.

## Detailed Workflow
1. **Submission**: Citizen registers and submits an issue (photo/text/voice/location).
2. **AI Classification**: YOLO v11 processes the upload, categorizes, and tags urgency.
3. **Routing & Assignment**: Admin reviews the ML output, assigns the complaint to workers/NGOs.
4. **Action & Updates**: Workers/NGOs receive notifications, complete tasks, upload "proof of resolution" (photo/geo), and close loop.
5. **Gamification/Rewards**: Stakeholders earn badges, points, or funds for timely and quality work.
6. **Feedback/Transparency**: Citizen gets continuous updates; admin tracks KPIs, response times, and completion rates.
7. **Data & Reports**: Supabase database stores logs, generates dashboards, and maintains audit trails.

## User Stories
- **Citizens**: Submit complaints quickly, get updates, earn rewards, track history, choose language.
- **Workers**: Receive clear tasks, navigation, update status, earn badges, reduce time on road.
- **Admins**: Manage workflow, assign tasks, view analytics, maintain transparency, lower manual overhead.
- **NGOs**: Apply for issues, resolve, receive recognition/funding, impact score visible to all.

- **Flow:** Users interact via devices → Next.js frontend → Next API backend → YOLO v11 ML engine for classification → Supabase database for storage and secure access. Supabase Auth manages identity; Monitoring tools track reliability and metrics.


## Tech Stack
- **Frontend**: Next.js, Tailwind CSS, JavaScript/TypeScript, Vercel
- **Backend**: Next js
- **ML/AI**: YOLO v11, CNN, Python
- **Database**: Supabase (PostgreSQL), File Storage
- **Authentication**: Supabase Auth
- **Cloud/Infra**: Supabase, Vercel
- **Monitoring**: Prometheus, Grafana (metrics, alerting)

## Workflow
1. **Citizen/NGO/Field Worker/Admin** logs in via the web/mobile app.
2. Citizens submit a complaint (photo/voice/location); YOLO v11 instantly classifies and routes it.
3. Admin reviews and assigns issues, NGOs can apply to resolve them.
4. Field workers get assigned tasks and update progress (with proof/photos).
5. Stakeholders get real-time notifications and status updates.
6. Completion triggers reward mechanisms for citizens/NGOs/workers.


## Impact
- **Time saved**: Issue resolution reduced from 8–12 days to 2–4 days.
- **Cost savings**: 60–70% operational reduction from digital workflows.
- **Environmental**: Reduced paper & fuel consumption, improved eco-footprint.
- **User experience**: More transparency, engagement, and satisfaction.


## Contact Information
Team Avyantrons (Hackspire 25)
- **Sujal Kushwaha**: sujalkushwaha195@gmail.com
- **Aayushi Tripathi**: aayushitripathi28@gmail.com
- **Suchismita Bakshi**: suchismitabakshi25k@gmail.com
- **Sanchari Dey**: deysanchari17@gmail.com
- **Raunak Chakraborty**: raunakjuly7@gmail.com
- **Sobhan Roy**: roysobhan.sr@gmail.com

For further information, visuals, and live demo instructions, see project documentation and slides.
