# Estate · ADO Analysis Roadmap Mock-up

Interactive prototype of the Estate dashboard with a new **Roadmaps** tab alongside Teams and Work.

## Run

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## What's included

- Dark Estate shell matching the uploaded ADO Analysis screens
- **Roadmaps** tab with:
  - Parent-child hierarchy (Theme → Initiative → Epic → Feature)
  - Timeline and Gantt modes
  - Month / quarter / year zoom
  - Filters for project, area path, iteration path, parent, type, labels, status, and search
  - Personal saved views (localStorage)
  - Shareable read-only presentation links
  - Presentation vs Planning modes (local drag/resize, no Azure DevOps write-back)
  - Unscheduled section for items missing start or end dates

Teams and Work tabs are lightweight placeholders so the prototype stays focused on roadmaps.
