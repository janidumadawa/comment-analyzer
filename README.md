# Comment Analyzer

A desktop application to extract and analyze Facebook video comments. Built for selecting winners from live stream comments.

## Features

- Fetch all videos from a Facebook Page
- Extract all comments from any video (supports 20,000+ comments)
- View comments with author names and timestamps
- Export comments to CSV file
- Desktop app — no terminal needed

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Desktop | Electron |
| API | Facebook Graph API |

## Prerequisites

- Node.js (v18 or higher)
- npm
- Facebook Page Admin access

## Setup (Development)

### 1. Clone the repository

```bash
git clone https://github.com/janidumadawa/comment-analyzer.git
cd comment-analyzer
