# Quick Deployment Script
# Run this to deploy all changes to production

Write-Host "🚀 Starting Deployment Process..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Add all changes
Write-Host "📦 Step 1: Adding all changes to git..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Changes added successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to add changes" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 2: Commit changes
Write-Host "💾 Step 2: Committing changes..." -ForegroundColor Yellow
$commitMessage = @"
feat: Update contact number, add Heritage View page, and implement info gathering modals

- Updated phone number from +91 6377 595 978 to +91 7733 072 738 across all pages
- Fixed Contact navigation to redirect to /contact page instead of scrolling
- Created standalone Heritage View landing page at /heritage-view
- Added info gathering modals for all PDF downloads
- Updated navigation from Downloads to Heritage View
"@

git commit -m $commitMessage
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Changes committed successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Nothing to commit or commit failed" -ForegroundColor Yellow
}
Write-Host ""

# Step 3: Push to GitHub
Write-Host "🌐 Step 3: Pushing to GitHub..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Success message
Write-Host "🎉 Deployment initiated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Check Netlify dashboard for frontend deployment"
Write-Host "  2. Check Railway dashboard for backend deployment"
Write-Host "  3. Wait 2-5 minutes for builds to complete"
Write-Host "  4. Test your live site!"
Write-Host ""
Write-Host "🔗 What to test:" -ForegroundColor Cyan
Write-Host "  ✓ Phone number updated everywhere"
Write-Host "  ✓ Contact button navigates correctly"
Write-Host "  ✓ Heritage View page loads"
Write-Host "  ✓ Download modals work"
Write-Host ""
Write-Host "✨ All done! Your changes are on the way to production!" -ForegroundColor Green
