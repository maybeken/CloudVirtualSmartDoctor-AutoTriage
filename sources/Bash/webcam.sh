#!/bin/bash

#### CONFIGURATION ####

DISABLED=true ## Disable the Script ##

FILE_NAME=image.jpg ## Target File Name ##
TRIGGER_FILE=takepic.txt ## Trigger File Name ##

BUCKET=healthimagecloudlabhk ## AWS S3 Bucket ##
BUCKET_TRIGGER=healthimagecloudlabhk ## AWS S3 Trigger Bucket ##
REGION=us-east-1 ## AWS S3 Region ##

WAIT=10 ## Loop Interval (In seconds) ##
RESOLUTION=640x480 ## Target File Resolution ##

#### DO NOT CHANGE BELOW ####

TRIGGER=http://$BUCKET_TRIGGER.s3-website-$REGION.amazonaws.com/$TRIGGER_FILE

if ($DISABLED); then
  echo "Script disabled, please re-enable it in configuration section.";
  echo "Line 5: DISABLED=false ## Disable the Script ##";
  sleep 3;
fi

while (true && ! $DISABLED); do

  clear;
  echo "Getting trigger file...";
  if wget -O /dev/null -q $TRIGGER;
    then
    echo "Trigger file was found, taking picture...";
    fswebcam -r $RESOLUTION --no-banner /tmp/$FILE_NAME
    echo "Uploading picture to S3...";
    aws s3 cp /tmp/$FILE_NAME s3://$BUCKET --region=$REGION
    echo "Picture uploaded, deleting trigger file...";
    aws s3 rm s3://$BUCKET_TRIGGER/$TRIGGER_FILE --region=$REGION
  else
    echo "Trigger file not found, wait $WAIT sec before retry.";
  fi

  sleep $WAIT
done
