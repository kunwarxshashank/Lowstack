# 🏆 Punya System - Hall of Fame

## Overview
The **Punya System** is a gamification feature that rewards users for contributing notes and study materials to the LowStack community. Users earn **Punya points** for every upload, and top contributors are celebrated in the **Hall of Punya** leaderboard.

## Features

### 1. Punya Points
- Users earn **10 Punya points** for each document/note uploaded
- Points are automatically awarded when a post is successfully created
- Total Punya is displayed on the leaderboard

### 2. Hall of Punya Page (`/hallofpunya`)
A vibrant, modern leaderboard showcasing:
- **Top 3 Contributors** - Featured in a podium-style display with:
  - Gold (🥇), Silver (🥈), and Bronze (🥉) badges
  - Gradient backgrounds matching their rank
  - Larger cards with special animations
  - Profile pictures and university information
  - Total Punya points with fire icons
  - Number of contributions

- **All Contributors** - Listed below the top 3 with:
  - Rank number
  - Profile picture
  - Name and university
  - Total Punya points
  - Number of contributions
  - Smooth animations on load

### 3. Navigation
- Added "Hall of Punya" to the main navigation menu
- Accessible from both desktop sidebar and mobile menu
- Uses a distinctive icon (important/star icon)

## Technical Implementation

### Database Schema
```prisma
model User {
  // ... other fields
  punya Int @default(0)  // Points earned by uploading notes
}
```

### API Endpoints

#### GET `/api/leaderboard`
Fetches the leaderboard data
- **Query Parameters:**
  - `limit` (optional): Number of users to return (default: 50)
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "user_id",
        "name": "User Name",
        "email": "user@example.com",
        "avatar": "avatar_url",
        "university": "University Name",
        "punya": 150,
        "_count": { "posts": 15 },
        "rank": 1
      }
    ],
    "total": 50
  }
  ```

#### POST `/api/post`
Creates new posts and awards Punya points
- Awards 10 points per successful upload
- Returns total Punya earned in response message

### UI Design
- **Vibrant gradient backgrounds** - Primary, secondary, and accent colors
- **Animated elements** - Smooth fade-in and slide animations
- **Responsive design** - Works on mobile, tablet, and desktop
- **Rank-based styling** - Different colors for top 3 positions
- **Modern components** - DaisyUI components with custom styling
- **Hero header** - Eye-catching header with trophy icon and sparkles

## User Experience

### For Contributors
1. Upload notes through the normal upload flow
2. Receive confirmation message with Punya points earned
3. See their rank on the Hall of Punya leaderboard
4. Compete with other contributors for top positions

### Motivation
- **Recognition** - Top contributors are prominently displayed
- **Gamification** - Points system encourages more uploads
- **Community** - Celebrates those who help others learn
- **Visual Appeal** - Beautiful, modern UI makes participation exciting

## Future Enhancements (Optional)
- Badges for milestone achievements (100, 500, 1000 Punya)
- Monthly/Weekly leaderboards
- Punya decay system to encourage consistent contributions
- Rewards or perks for top contributors
- Social sharing of leaderboard position
- User profile pages showing individual Punya history

## Files Modified/Created

### Created
- `/app/(root)/(home)/(routes)/hallofpunya/page.jsx` - Main leaderboard page
- `/app/api/leaderboard/route.js` - API endpoint for leaderboard data
- `PUNYA_SYSTEM.md` - This documentation

### Modified
- `/prisma/schema.prisma` - Added `punya` field to User model
- `/app/api/post/route.js` - Added Punya point awarding logic
- `/constants/index.js` - Added Hall of Punya to navigation
- Database needs migration: `npx prisma generate && npx prisma db push`

## Setup Instructions

1. **Update Database Schema**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

2. **Restart Development Server**
   ```bash
   npm run dev
   ```

3. **Access Hall of Punya**
   - Navigate to `/hallofpunya` or click "Hall of Punya" in the menu

## Notes
- Existing users will have `punya: 0` by default
- Points are only awarded for new uploads after this feature is deployed
- The leaderboard updates in real-time as users upload content
- No negative points - Punya can only increase
