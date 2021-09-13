BUCKET=$INQUIRE_BACKUP_BUCKET
TIMESTAMP=`date +%F-%H%M`

# Using mongodump utility to download binary version of database
echo "Downloading database files at $TIMESTAMP"
mongodump --forceTableScan --uri=$MONGO_URI
FILENAME=mongodb-backup-$TIMESTAMP
mv dump $FILENAME
TARFILENAME=$FILENAME.tar.gz
tar -cvf $TARFILENAME $FILENAME

# Using AWS CLI to upload to S3 Bucket
echo "Uploading backed up files to AWS S3"
/usr/local/bin/aws s3 cp $TARFILENAME s3://$BUCKET/ --storage-class STANDARD_IA
TIMESTAMP2=`date +%F-%H%M`

# Deleting files creating in backup process
/bin/rm -f $TARFILENAME
/bin/rm -rf $FILENAME

echo "Finished at $TIMESTAMP2"