#!/bin/bash

# Base URL
BASE_URL="http://localhost:3000"

# Test getting pending cars
echo "Getting pending cars..."
curl "$BASE_URL/cars?status=Pending"

# Test approving a car
echo -e "\n\nApproving car with ID 1..."
curl -X PATCH \
  -H "Content-Type: application/json" \
  -d '{"status": "Approved"}' \
  "$BASE_URL/cars/1"

# Test rejecting a car with feedback
echo -e "\n\nRejecting car with ID 2..."
curl -X PATCH \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Rejected",
    "adminFeedback": "Price too high for the mileage"
  }' \
  "$BASE_URL/cars/2" 