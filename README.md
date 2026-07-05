# Irai Designs

Design prototypes for the IRAI wellness platform.

| Directory | Source | Description |
|-----------|--------|-------------|
| [`mobile-design-user/`](./mobile-design-user/) | `irai-yoga` @ `master` | Mobile-first **user** design (client-facing app) |
| [`mobile-design-admin/`](./mobile-design-admin/) | `irai-yoga` @ `practioner-ui` | Mobile-first **practitioner / admin** design |
| [`irai_web_design_admin/`](./irai_web_design_admin/) | — | Desktop web UI for practitioner workspace and admin panel |

## Run locally

Each project is independent. See the README inside each directory.

```bash
# Mobile — user design
cd mobile-design-user && npm install && npm run dev

# Mobile — practitioner/admin design
cd mobile-design-admin && npm install && npm run dev

# Web admin / practitioner
cd irai_web_design_admin && nvm use && npm install && npm run dev
```
