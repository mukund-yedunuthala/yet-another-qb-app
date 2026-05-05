#!/bin/sh
for file in /usr/share/nginx/html/js/*.js; do
  sed -i "s|__APPWRITE_ENDPOINT__|${APPWRITE_ENDPOINT}|g" "$file"
  sed -i "s|__APPWRITE_PROJECT_ID__|${APPWRITE_PROJECT_ID}|g" "$file"
  sed -i "s|__APPWRITE_DATABASE_ID__|${APPWRITE_DATABASE_ID}|g" "$file"
  sed -i "s|__APPWRITE_TABLE_ID__|${APPWRITE_TABLE_ID}|g" "$file"
done
