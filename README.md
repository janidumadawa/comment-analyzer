# Comment Analyzer

A desktop application to extract and analyze Facebook video comments. Built for selecting winners from live stream comments.

## Features

- Fetch all videos from a Facebook Page
- Extract all comments from any video (supports 20,000+ comments)
- View comments with author names and timestamps
- Export comments to CSV file

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

git clone https://github.com/janidumadawa/comment-analyzer.git
cd comment-analyzer

### 2. Install dependencies

cd backend
npm install
cd ../frontend
npm install

### 3. Configure environment

Create a .env file in the backend folder:

PAGE_ACCESS_TOKEN=your_facebook_page_access_token_here

### 4. Run the application

Terminal 1 - Backend:

cd backend
npm run dev

Terminal 2 - Frontend:

cd frontend
npm run dev

Open http://localhost:5173 in your browser.

## Build Desktop App

cd frontend
npm run electron:build

Installer location: frontend/release/Comment Analyzer Setup 1.0.0.exe

## How to Get Facebook Access Token

1. Go to https://developers.facebook.com/tools/explorer/
2. Select User Token from the left dropdown
3. Add permissions: pages_show_list, pages_read_engagement, pages_read_user_content
4. Click Generate Access Token
5. In the query field, enter /me/accounts
6. Click Submit
7. Copy the access_token and id for your page

## Usage

1. Open the application
2. Enter a Facebook Page ID
3. Click Load Videos
4. Select a video to view comments
5. Click Export CSV to download comments

## Notes

- Page Access Token is required for API calls
- Large videos (20,000+ comments) may take 1-2 minutes to fetch
- Token expires when user changes password or removes app permissions

## License

Private — All rights reserved.
