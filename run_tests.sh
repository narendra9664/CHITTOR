#!/bin/bash
# run_tests.sh - Script to run all tests in the project

echo "Starting comprehensive test suite..."

echo "1. Running backend tests..."
cd backend/chittorgarh_vlog
python manage.py test
BACKEND_STATUS=$?
cd ../..

if [ $BACKEND_STATUS -ne 0 ]; then
    echo "Backend tests failed!"
    exit 1
fi

echo "Backend tests passed!"

echo "2. Running frontend tests..."
cd frontend
npm test -- --run
FRONTEND_STATUS=$?
cd ..

if [ $FRONTEND_STATUS -ne 0 ]; then
    echo "Frontend tests failed!"
    exit 1
fi

echo "Frontend tests passed!"

echo "All tests completed successfully!"
echo "Project is ready for deployment."