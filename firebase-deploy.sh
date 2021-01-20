#!/bin/sh

echo "Removing all files from ../slapstuk-staging/dist"
rm -r ../slapstuk-staging/dist
echo "Copying files to ../slapstuk-staging folder..."
cp -r ./dist  ../slapstuk-staging
echo "Running 'firebase deploy --only hosting' from ../slapstuk-staging folder..."
initialpath="$cd"
cd ../slapstuk-staging
firebase deploy --only hosting
cd "$initialpath"
echo "Deploy to Slapstuk hosting done."