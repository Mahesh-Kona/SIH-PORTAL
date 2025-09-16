@echo off
echo Building SIH Web Portal for Netlify deployment...
echo.

echo Installing dependencies...
npm install

echo.
echo Building project...
npm run build

echo.
echo Build completed! 
echo.
echo Your build files are in the 'dist' folder.
echo You can now:
echo 1. Drag and drop the 'dist' folder to netlify.com
echo 2. Or connect your GitHub repo to Netlify for automatic deploys
echo.
echo Backend API URL: https://sih-backend-9ub9.onrender.com/api
echo.
pause